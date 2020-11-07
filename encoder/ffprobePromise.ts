import Ffmpeg, { FfprobeData } from "fluent-ffmpeg";

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

const getCreationTime = async (metadata: FfprobeData): Promise<Date> => {
  const tags: any = metadata.format.tags;
  const creationTime: string = tags.creation_time;

  if (creationTime.length !== 27) {
    throw new Error("No creation_time tag");
  }

  return new Date(creationTime);
};

export default { probe, getCreationTime };
