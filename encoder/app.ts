import encode from "./actions/encode";
import generate from "./actions/generate";
import parseArguments from "./parseArguments";

const app = () => {
  // Remove the first argument that's added when ran from ts-node
  const args = parseArguments(process.argv.slice(1));

  if ("error" in args) {
    console.error(args.error);
    process.exit(1);
  }

  if (args.action === "generate") {
    return generate(args.path);
  }

  if (args.action === "encode") {
    return encode(args.path);
  }

  throw new Error("Unknown action");
};

app();

// const normalizeCreationTime = (creationTime: Date): string =>
//   creationTime.toISOString().slice(0, 19).replace(/\:/g, "-");

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

// interface Resolution {
//   height: number;
//   width: number;
// }

// interface EncodingParams {
//   bitrate: string;
//   crf: number;
//   maxRate: string;
//   minRate: string;
//   resolution: Resolution;
//   threads: number;
//   tileColumns: number;
// }

// const encodeAllFiles = async (
//   inPath: string,
//   fileNames: string[],
//   outPath: string,
//   encodingParams: EncodingParams[]
// ): Promise<void> => {
//   console.log(`Encoding ${fileNames.length} files from ${inPath} to ${outPath} in ${encodingParams.length} formats...`);

//   const matrix = fileNames
//     .map((filename) =>
//       encodingParams.map((encodingParam) => ({
//         filename,
//         encodingParam,
//       }))
//     )
//     .flat();

//   // Run the encoding sequentially
//   await matrix.reduce(async (previousPromise, fileWithParams) => {
//     await previousPromise;
//     const { filename, encodingParam } = fileWithParams;

//     const inFile = `${inPath}/${filename}`;

//     const creationDate = await videoUtils.getCreationTime(inFile);
//     const timestamp = normalizeCreationTime(creationDate.date);
//     const outFile = `${outPath}/${encodingParam.resolution.height}_${timestamp}.webm`;

//     return encodeFile(inFile, outFile, encodingParam);
//   }, Promise.resolve());
// };

// const app = async () => {

//   // const variants = await createVariants(path);

//   const encodingParams: EncodingParams[] = [
//     {
//       bitrate: "276k",
//       crf: 36,
//       maxRate: "400k",
//       minRate: "138k",
//       resolution: { height: 360, width: 640 },
//       threads: 4,
//       tileColumns: 1,
//     },
//     {
//       bitrate: "1800k",
//       crf: 32,
//       maxRate: "2610k",
//       minRate: "900k",
//       resolution: { width: 1280, height: 720 },
//       threads: 8,
//       tileColumns: 2,
//     },
//     {
//       bitrate: "3000k",
//       crf: 31,
//       maxRate: "4350k",
//       minRate: "1500k",
//       resolution: { width: 1920, height: 1080 },
//       threads: 8,
//       tileColumns: 2,
//     },
//     {
//       resolution: { width: 3840, height: 2160 },
//       bitrate: "18000k",
//       minRate: "9000k",
//       maxRate: "26100k",
//       tileColumns: 3,
//       threads: 24,
//       crf: 15,
//     },
//   ];

//   const inCleanPath = `${path}/sources/clean`;
//   const inNsfwPath = `${path}/sources/nsfw`;

//   const outCleanPath = `${path}/out/clean`;
//   // const outCleanPath = ".";

//   const outNsfwPath = `${path}/out/nsfw`;

//   const inCleanFiles = await fs.promises.readdir(inCleanPath);
//   const inNsfwFiles = await fs.promises.readdir(inNsfwPath);

//   console.log(`Encoding ${inCleanPath} files...`);
//   await encodeAllFiles(inCleanPath, inCleanFiles, outCleanPath, encodingParams);

//   console.log("All done!");
// };
