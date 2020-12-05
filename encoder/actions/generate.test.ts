import fs from "fs/promises";
import genereate from "./generate";

it("should generate a list of videos", async () => {
  const path = "/mnt/c/Users/ngira/Desktop/gopro/test";
  await genereate(path);

  const file = await fs.readFile(`${path}/project.json`);
  expect(file.toString()).toMatchInlineSnapshot(`
    "{
        \\"videos\\": [
            {
                \\"file\\": \\"DJI_0009.MP4\\",
                \\"attributes\\": {
                    \\"isDrone\\": true
                },
                \\"progress\\": {
                    \\"h264\\": false,
                    \\"h265\\": false,
                    \\"rekognition10x\\": false
                }
            },
            {
                \\"file\\": \\"GX013175.MP4\\",
                \\"attributes\\": {
                    \\"isDrone\\": false
                },
                \\"progress\\": {
                    \\"h264\\": false,
                    \\"h265\\": false,
                    \\"rekognition10x\\": false
                }
            },
            {
                \\"file\\": \\"VID_20201107_130823.mp4\\",
                \\"attributes\\": {
                    \\"isDrone\\": false
                },
                \\"progress\\": {
                    \\"h264\\": false,
                    \\"h265\\": false,
                    \\"rekognition10x\\": false
                }
            }
        ]
    }"
  `);
});
