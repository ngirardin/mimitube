import CliProgress from "cli-progress";
import Ffmpeg, { FfprobeData } from "fluent-ffmpeg";
import fs from "fs";

const ffprobe = async (file: string): Promise<FfprobeData> => {
  return new Promise((resolve, reject) => {
    Ffmpeg.ffprobe(file, (err, data) => {
      if (err) {
        return reject(err);
      }

      return resolve(data);
    });
  });
};

const readCreationTime = async (fullPath: string): Promise<string> => {
  const metadata = await ffprobe(fullPath);

  const tags: any = metadata.format.tags;
  const creationTime: string = tags.creation_time;

  if (creationTime.length !== 27) {
    throw new Error(`No creation_time in ${fullPath}`);
  }

  return creationTime;
};

interface InputFile {
  file: string;
  creationTime: string;
}

const normalizeCreationTime = (creationTime: string): string => creationTime.slice(0, 19).replace(/\:/g, "-");

// interface InputFileVariant {
//   name: string;
//   files: InputFile[];
// }

// const createVariants = async (path: string): Promise<InputFileVariant[]> => {
//   const clean = await extractDates(`${path}/clean`);
//   const nsfw = await extractDates(`${path}/nsfw`);

//   return [
//     { name: "clean", files: clean },
//     { name: "nsfw", files: [...clean, ...nsfw] },
//   ];
// };

interface Resolution {
  height: number;
  width: number;
}

interface EncodingParams {
  bitrate: string;
  crf: number;
  maxRate: string;
  minRate: string;
  resolution: Resolution;
  threads: number;
  tileColumns: number;
}

const encode = (fileIn: string, fileOut: string, encodingParams: EncodingParams, pass: 1 | 2): Promise<void> =>
  new Promise((resolve, reject) => {
    const { bitrate, crf, maxRate, minRate, resolution, threads, tileColumns } = encodingParams;

    const command = Ffmpeg(fileIn)
      .size(`${resolution.width}x${resolution.height}`)
      .fps(50)
      .autopad()
      .videoBitrate(bitrate)
      .videoCodec("libvpx-vp9")
      .outputOptions(`-minrate ${minRate}`)
      .outputOptions(`-maxrate ${maxRate}`)
      .outputOptions(`-tile-columns ${tileColumns}`)
      .outputOptions("-g 240")
      .outputOptions(`-threads ${threads}`)
      .outputOptions("-quality good")
      .outputOptions(`-crf ${crf}`)
      .outputOptions("-speed 4")
      .outputOptions(`-pass ${pass}`)
      .audioCodec("libopus")
      .output(fileOut);

    const fileProgress = new CliProgress.Bar({
      format: "[{bar}] {percentage}% | {eta_formatted} | {fps} fps for pass {pass} at {width}x{height} | {timemark}",
    });
    fileProgress.start(100, 0, { fps: 0, pass: 0, width: 0, height: 0, timemark: "00:00:00" });

    command
      .on("error", function (err, stdout, stderr) {
        console.error(err);
        console.error(stdout);
        console.error(stderr);
        reject(err);
      })
      .on("progress", function (progress) {
        const { currentFps, timemark, percent } = progress;
        fileProgress.update(percent, {
          fps: Math.round(currentFps),
          width: encodingParams.resolution.width,
          height: encodingParams.resolution.height,
          pass,
          timemark,
        });
      })
      .on("end", () => {
        // Clear the progress bar
        fileProgress.stop();
        resolve();
      })
      .run();
  });

const encodeFile = async (fileIn: string, fileOut: string, encodingParam: EncodingParams): Promise<void> => {
  console.log(fileIn);
  await encode(fileIn, fileOut, encodingParam, 1);
  await encode(fileIn, fileOut, encodingParam, 2);
};

const encodeAllFiles = async (
  inPath: string,
  fileNames: string[],
  outPath: string,
  encodingParams: EncodingParams[]
): Promise<void> => {
  console.log(`Encoding ${fileNames.length} files from ${inPath} to ${outPath} in ${encodingParams.length} formats...`);

  const matrix = fileNames
    .map((filename) =>
      encodingParams.map((encodingParam) => ({
        filename,
        encodingParam,
      }))
    )
    .flat();

  // Run the encoding sequentially
  await matrix.reduce(async (previousPromise, fileWithParams) => {
    await previousPromise;
    const { filename, encodingParam } = fileWithParams;

    const inFile = `${inPath}/${filename}`;

    const timestamp = normalizeCreationTime(await readCreationTime(inFile));
    const outFile = `${outPath}/${encodingParam.resolution.height}_${timestamp}.webm`;

    return encodeFile(inFile, outFile, encodingParam);
  }, Promise.resolve());
};

const app = async () => {
  const path = process.argv[2];

  if (!path) {
    console.error("Missing path argument");
    return;
  }

  // const variants = await createVariants(path);

  const encodingParams: EncodingParams[] = [
    {
      bitrate: "276k",
      crf: 36,
      maxRate: "400k",
      minRate: "138k",
      resolution: { height: 360, width: 640 },
      threads: 4,
      tileColumns: 1,
    },
    {
      bitrate: "1800k",
      crf: 32,
      maxRate: "2610k",
      minRate: "900k",
      resolution: { width: 1280, height: 720 },
      threads: 8,
      tileColumns: 2,
    },
    {
      bitrate: "3000k",
      crf: 31,
      maxRate: "4350k",
      minRate: "1500k",
      resolution: { width: 1920, height: 1080 },
      threads: 8,
      tileColumns: 2,
    },
    {
      resolution: { width: 3840, height: 2160 },
      bitrate: "18000k",
      minRate: "9000k",
      maxRate: "26100k",
      tileColumns: 3,
      threads: 24,
      crf: 15,
    },
  ];

  const inCleanPath = `${path}/sources/clean`;
  const inNsfwPath = `${path}/sources/nsfw`;

  const outCleanPath = `${path}/out/clean`;
  // const outCleanPath = ".";

  const outNsfwPath = `${path}/out/nsfw`;

  const inCleanFiles = await fs.promises.readdir(inCleanPath);
  const inNsfwFiles = await fs.promises.readdir(inNsfwPath);

  console.log(`Encoding ${inCleanPath} files...`);
  await encodeAllFiles(inCleanPath, inCleanFiles, outCleanPath, encodingParams);

  console.log("All done!");
};

app();
