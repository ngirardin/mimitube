import constants from "./constants";
import s3Utils from "./s3Utils";

interface ContainsVideoAndMetas {
  complete: boolean;
  metadata: boolean;
  video: boolean;
}

export default {
  containVideoAndMetas: async (): Promise<ContainsVideoAndMetas> => {
    const { bucketName, uploadFolder } = constants;

    const objects = await s3Utils.listObjects({
      bucketName,
      folder: `${uploadFolder}/`,
    });

    const keys = objects.map((content) => content.Key);

    const metadata = keys.find((key) => key?.endsWith(".json")) !== undefined;
    const video = keys.find((key) => key?.endsWith(".mp4")) !== undefined;
    const complete = metadata && video;

    return {
      complete,
      metadata,
      video,
    };
  },
};
