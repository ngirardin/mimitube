import {
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  S3Handler,
} from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { nanoid } from "nanoid";
import "source-map-support/register";
import data from "../data";
import constants from "../utils/constants";
import s3Utils from "../utils/s3Utils";
import uploadUtils from "../utils/uploadUtils";

// cognito app client id: 7u7dgc69c53t4jm5rv609d3tp5
const dynamoDb = new DynamoDB.DocumentClient();

export const create: APIGatewayProxyHandler = (
  event,
  _context,
  callback
): void => {
  //Request body is passed in as a JSON encoded string in 'event.body'
  if (!event.body) {
    throw new Error("No body");
  }

  const data = JSON.parse(event.body);

  const params: DynamoDB.DocumentClient.PutItemInput = {
    TableName: constants.tableName,
    Item: {
      noteId: nanoid(),
      content: data.content,
      attachment: data.attachment,
      createdAt: new Date().toISOString(),
      userId: "9999", //event.requestContext.identity.cognitoIdentityId,
    },
  };

  dynamoDb.put(params, (error) => {
    // Set response headers to enable CORS (Cross-Origin Resource Sharing)
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    };

    // Return status code 500 on error
    if (error) {
      const response = {
        statusCode: 500,
        headers: headers,
        body: JSON.stringify({ error, status: false }),
      };
      callback(null, response);
      return;
    }

    // Return status code 200 and the newly created item
    const response = {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};

// export const list: APIGatewayProxyHandler = async (event, _context): Promise<APIGatewayProxyResult> => {
//   const dynamoDB = new DynamoDB();
//   const tables = await dynamoDB.listTables().promise();
//   const body: string = tables.TableNames && tables.TableNames?.length > 0 ? tables.TableNames.join(", ") : "no tables";
//   console.log({ body });
//   return { body, statusCode: 200 };
// };

export const onS3Upload: S3Handler = async (event, _context): Promise<void> => {
  if (event.Records.length !== 1) {
    throw new Error(`Expected 1 records but got ${event.Records.length}`);
  }

  const containVideoAndMetas = await uploadUtils.containVideoAndMetas();

  if (!containVideoAndMetas) {
    console.log("Incomplete upload", containVideoAndMetas);
    return;
  }

  console.log("Upload complete!");
};

export const uploadStatus: APIGatewayProxyHandler = async (
  event,
  _context
): Promise<APIGatewayProxyResult> => ({
  body: JSON.stringify(await uploadUtils.containVideoAndMetas()),
  statusCode: 200,
});

export const xxx: APIGatewayProxyHandler = async (
  _event,
  _context
): Promise<APIGatewayProxyResult> => {
  try {
    const { bucketName, uploadFolder } = constants;

    const object = await s3Utils.downloadObject({
      bucketName,
      key: `${uploadFolder}/metadata.json`,
    });

    const videoJSON = data.validateVideoJSON(JSON.parse(object.toString()));

    const videoItem = await data.putVideo(videoJSON);

    // TODO: rename video to id

    return {
      body: JSON.stringify(videoItem),
      statusCode: 200,
    };
  } catch (error) {
    return {
      body: JSON.stringify(error),
      statusCode: 500,
    };
  }
};
