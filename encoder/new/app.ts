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

interface InputFile {
  fullPath: string;
  creationTime: string;
}

const getFullPathFiles = async (path: string): Promise<string[]> =>
  (await fs.promises.readdir(path)).map((file) => `${path}/${file}`);

const readCreationTime = async (fullPath: string): Promise<InputFile> => {
  const metadata = await ffprobe(fullPath);

  const tags: any = metadata.format.tags;
  const creationTime: string = tags.creation_time;

  if (creationTime.length !== 27) {
    throw new Error(`No creation_time in ${fullPath}`);
  }

  return { fullPath, creationTime };
};

const app = async () => {
  const path = process.argv[2];

  if (!path) {
    console.error("Missing path argument");
    return;
  }

  const inFiles = await getFullPathFiles(path);
  console.log(`Processing ${inFiles.length} files`);

  console.log("reading creation date...");
  const creationTimes = await Promise.all(
    inFiles.map(async (file) => {
      const out = await readCreationTime(file);
      process.stdout.write(".");
      return out;
    })
  );

  // const creationDate = creationTime.slice(0, 19).replace(/\:/g, "-");

  console.log(creationTimes);
};

app();
