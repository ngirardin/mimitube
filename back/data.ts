import { DynamoDB } from "aws-sdk";
import { nanoid } from "nanoid";
import * as zod from "zod";
import constants from "./utils/constants";

const videoSchema = zod.object({
  // TODO: check date shape /^([0-9]{4})-[0-1][0-9](-[0-3][0-9])?$/
  date: zod.string(),
  name: zod.string(),
  quality: zod.object({
    fps: zod.number(),
    resolution: zod.enum(["4k", "hd"]),
  }),
  sequences: zod.array(zod.number()),
  variant: zod.enum(["clean", "nsfw"]),
});

export type VideoJSON = zod.infer<typeof videoSchema>;

export interface VideoItem extends VideoJSON {
  videoId: string;
}

const validateVideoJSON = (json: any): VideoJSON => {
  const out = videoSchema.parse(json);

  const date = out.date;
  if (!/^([0-9]{4})-[0-1][0-9](-[0-3][0-9])?$/.test(date)) {
    throw new Error(`Invalid date: ${date}`);
  }

  return out;
};

// Global dynamoDb client
const dynamoDb = new DynamoDB.DocumentClient();

export default {
  putVideo: async (video: VideoJSON): Promise<VideoItem> => {
    const videoOut = {
      videoId: nanoid(),
      ...video,
    };

    await dynamoDb
      .put({
        TableName: constants.tableName,
        Item: videoOut,
      })
      .promise();

    return videoOut;
  },
  validateVideoJSON,
};
