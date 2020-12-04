import { ProjectVideo, ProjectVideos, projectVideoSchema, projectVideosSchema } from "./projectVideoSchema";

const video1: ProjectVideo = {
  file: "video1.mp4",
  attributes: { isDrone: true },
  progress: {
    rekognition10x: false,
    normalized: false,
  },
};

const video2: ProjectVideo = {
  file: "video2.mp4",
  attributes: { isDrone: false },
  progress: {
    rekognition10x: true,
    normalized: true,
  },
};

const projectVideos: ProjectVideos = [video1, video2];

describe("the projectVideoSchema", () => {
  it("should reject an invalid schema", () =>
    expect(() => projectVideoSchema.parse({})).toThrowErrorMatchingInlineSnapshot(`
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
    expect(projectVideoSchema.parse(video1)).toEqual(video1);
    expect(projectVideoSchema.parse(video2)).toEqual(video2);
  });
});

describe("the projectVideosSchema", () => {
  it("should accept a valid project", () => expect(projectVideosSchema.parse(projectVideos)).toEqual(projectVideos));
});
