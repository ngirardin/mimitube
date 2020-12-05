import { projectSchema } from "./projectVideoSchema";

const video1 = {
  file: "video1.mp4",
  attributes: { isDrone: true },
  progress: {
    h264: false,
    h265: false,
    rekognition10x: false,
  },
};

const video2 = {
  file: "video2.mp4",
  attributes: { isDrone: false },
  progress: {
    h264: true,
    h265: true,
    rekognition10x: true,
  },
};

const projectVideos = [video1, video2];

it("should reject an invalid schema", () =>
  expect(() => projectSchema.parse({})).toThrowErrorMatchingInlineSnapshot(`
    "[
      {
        \\"code\\": \\"invalid_type\\",
        \\"expected\\": \\"array\\",
        \\"received\\": \\"undefined\\",
        \\"path\\": [
          \\"videos\\"
        ],
        \\"message\\": \\"Required\\"
      }
    ]"
  `));

it("should accept a valid project", () => expect(projectSchema.parse(projectVideos)).toEqual(projectVideos));
