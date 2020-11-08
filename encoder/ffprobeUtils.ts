import Ffmpeg, { FfprobeData } from "fluent-ffmpeg";

const getCreationTime = async (metadata: FfprobeData): Promise<Date | undefined> => {
  const tags: any = metadata.format.tags;
  const creationTime: string = tags.creation_time;

  if (!creationTime) {
    return undefined;
  }

  if (creationTime.length !== 27) {
    throw new Error("Invalid creation_time tag");
  }

  return new Date(creationTime);
};

const probe = async (file: string): Promise<FfprobeData> => {
  return new Promise((resolve, reject) => {
    Ffmpeg.ffprobe(file, (err: any, data: any) => {
      if (err) {
        return reject(err);
      }

      return resolve(data);
    });
  });
};

export default { getCreationTime, probe };
