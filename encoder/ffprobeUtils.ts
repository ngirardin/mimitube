import Ffmpeg, { FfprobeData } from "fluent-ffmpeg";

const probe = async (path: string, file: string): Promise<FfprobeData> => {
  const fullPath = `${path}/${file}`;
  return new Promise((resolve, reject) => {
    Ffmpeg.ffprobe(fullPath, (err: any, data: any) => {
      if (err) {
        return reject(err);
      }

      return resolve(data);
    });
  });
};

export default {
  getCreationTime: async (path: string, file: string): Promise<Date | undefined> => {
    const metadata = await probe(path, file);
    const tags: any = metadata.format.tags;

    const creationTime: string = tags?.creation_time;

    if (!creationTime) {
      return undefined;
    }

    if (creationTime.length !== 27) {
      throw new Error("Invalid creation_time tag");
    }

    return new Date(creationTime);
  },

  getDuration: async (path: string, file: string): Promise<string> => {
    const result = await probe(path, file);

    const firstStreamDuration = result.streams[0].duration;

    if (!firstStreamDuration) {
      throw new Error(`No duration on stream 0`);
    }

    const equalDurations = result.streams.every(
      // Some stream, especially on GoPro can have a 0.01s difference
      // ex:  ['hevc: 26.82', 'aac: 26.837333',) 'unknown: 26.82', 'bin_data: 26.837', 'unknown: 26.82']
      (stream) => stream.duration && Math.abs(parseFloat(stream.duration) - parseFloat(firstStreamDuration)) < 0.02
    );

    if (!equalDurations) {
      throw new Error(`The duration is not the same on all streams`);
    }

    return firstStreamDuration;
  },
};
