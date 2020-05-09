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

const getFullPathFiles = async (path: string): Promise<string[]> =>
  (await fs.promises.readdir(path)).map((file) => `${path}/${file}`);

const normalizeCreationTime = (creationTime: string): string => creationTime.slice(0, 19).replace(/\:/g, "-");

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

const extractDates = async (path: string): Promise<InputFile[]> => {
  const inFiles = await getFullPathFiles(path);
  console.log(`Processing ${inFiles.length} files in ${path}`);

  console.log("reading creation date...");

  return Promise.all(
    inFiles.map(async (file) => {
      const creationTime = await readCreationTime(file);
      process.stdout.write(".");
      return { file, creationTime };
    })
  );
};

interface InputFileVariant {
  name: string;
  files: InputFile[];
}

const createVariants = async (path: string): Promise<InputFileVariant[]> => {
  const clean = await extractDates(`${path}/clean`);
  const nsfw = await extractDates(`${path}/nsfw`);

  return [
    { name: "clean", files: clean },
    { name: "nsfw", files: [...clean, ...nsfw] },
  ];
};

const app = async () => {
  const path = process.argv[2];

  if (!path) {
    console.error("Missing path argument");
    return;
  }

  const variants = await createVariants(path);
};

app();
