import Ffmpeg, { FfprobeData } from "fluent-ffmpeg";

export default {
  probe: async (file: string): Promise<FfprobeData> => {
    return new Promise((resolve, reject) => {
      Ffmpeg.ffprobe(file, (err: any, data: any) => {
        if (err) {
          return reject(err);
        }

        return resolve(data);
      });
    });
  },
};
