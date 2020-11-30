import { Project, projectSchema, Video, videoSchema } from "./projectSchema";

const video1: Video = {
  file: "video1.mp4",
  attributes: { isDrone: true },
  progress: {
    rekognition10x: false,
    normalized: false,
  },
};

const video2: Video = {
  file: "video2.mp4",
  attributes: { isDrone: false },
  progress: {
    rekognition10x: true,
    normalized: true,
  },
};

const project: Project = [video1, video2];

describe("the videoSchema", () => {
  it("should reject an invalid schema", () =>
    expect(() => videoSchema.parse({})).toThrowErrorMatchingInlineSnapshot(`
      "[
        {
          \\"code\\": \\"invalid_type\\",
          \\"expected\\": \\"string\\",
          \\"received\\": \\"undefined\\",
          \\"path\\": [
            \\"file\\"
          ],
          \\"message\\": \\"Required\\"
        },
        {
          \\"code\\": \\"invalid_type\\",
          \\"expected\\": \\"object\\",
          \\"received\\": \\"undefined\\",
          \\"path\\": [
            \\"attributes\\"
          ],
          \\"message\\": \\"Required\\"
        },
        {
          \\"code\\": \\"invalid_type\\",
          \\"expected\\": \\"object\\",
          \\"received\\": \\"undefined\\",
          \\"path\\": [
            \\"progress\\"
          ],
          \\"message\\": \\"Required\\"
        }
      ]"
    `));

  it("should accept a valid video", () => {
    expect(videoSchema.parse(video1)).toEqual(video1);
    expect(videoSchema.parse(video2)).toEqual(video2);
  });
});

describe("the projectSchema", () => {
  it("should accept a valid schema", () => expect(projectSchema.parse(project)).toEqual(project));
});
