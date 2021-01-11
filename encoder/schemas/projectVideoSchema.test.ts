import { projectSchema } from "./projectVideoSchema";

const project = {
  videos: [
    {
      file: "video1.mp4",
      attributes: { isDrone: true },
      progress: {
        h264: false,
        h265: false,
        rekognition10x: false,
      },
    },
    {
      file: "video2.mp4",
      attributes: { isDrone: false },
      progress: {
        h264: true,
        h265: true,
        rekognition10x: true,
      },
    },
  ],
};

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

it("should accept a valid project", () => expect(projectSchema.parse(project)).toEqual(project));
