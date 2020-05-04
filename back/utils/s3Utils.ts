import { S3 } from "aws-sdk";
import { ObjectList } from "aws-sdk/clients/s3";

interface DownloadObject {
  bucketName: string;
  key: string;
}

interface ListObjects {
  bucketName: string;
  folder?: string;
}

export default {
  downloadObject: async (params: DownloadObject): Promise<Buffer> => {
    const { bucketName, key } = params;
    const x: S3.GetObjectRequest = { Bucket: bucketName, Key: key };

    const result = await new S3().getObject(x).promise();

    return result.Body as Buffer;
  },

  listObjects: async (params: ListObjects): Promise<ObjectList> => {
    const { bucketName, folder } = params;

    const objects = await new S3()
      .listObjectsV2({ Bucket: bucketName, Delimiter: "/", Prefix: folder })
      .promise();

    if (objects.IsTruncated) {
      throw new Error("Unexpected truncated response");
    }

    const contents = objects.Contents;

    if (!contents) {
      throw new Error("No content");
    }

    return contents;
  },

  sizeToMB: (size: number): string => `${Math.round(size / (1000 * 1000))} MB`,
};
