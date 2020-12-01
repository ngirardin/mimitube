import videoUtils from "./videoUtils";

export const testVideosPath = "/mnt/c/Users/ngira/Desktop/gopro/test";

export const testVideos = {
  drone: `DJI_0009.MP4`, // no creation_date metadata
  gopro: `GX013175.MP4`,
  gsm: `VID_20201107_130823.mp4`,
  text: "file.txt",
};

describe("The fileIsVideo method", () => {
  it("should return false for a file without any extension", () =>
    expect(videoUtils.fileIsVideo("no extensions")).toEqual(false));

  it("should return false for a file with a txt extension", () =>
    expect(videoUtils.fileIsVideo("file.txt")).toEqual(false));

  it("should return true for a file with an mp4 extension", () =>
    expect(videoUtils.fileIsVideo("file.mp4")).toEqual(true));

  it("should return true for a file with an MP4 extension", () =>
    expect(videoUtils.fileIsVideo("file.MP4")).toEqual(true));
});

describe("The getCreationTime method", () => {
  it("should return the creation date from the video metadata", async () => {
    expect(await videoUtils.getCreationTime(testVideosPath, testVideos.gopro)).toEqual({
      date: new Date("2020-09-13T16:00:25.000Z"),
      source: "metadata",
    });
    expect(await videoUtils.getCreationTime(testVideosPath, testVideos.gsm)).toEqual({
      date: new Date("2020-11-07T12:09:04.000Z"),
      source: "metadata",
    });
  });

  it("should fallback to reading the file date if the video has no metadata", async () => {
    expect(await videoUtils.getCreationTime(testVideosPath, testVideos.drone)).toEqual({
      date: new Date("2020-10-10T14:09:34.000Z"),
      source: "fileCreation",
    });
  });
});

describe("The isDrone method", () => {
  it("should return false if a video doesn't starts with DJI_", () =>
    expect(videoUtils.isDroneVideo(testVideos.gopro)).toBe(false));

  it("should return true if a video starts with DJI_", () =>
    expect(videoUtils.isDroneVideo(testVideos.drone)).toBe(true));
});

describe("The isGoPro method", () => {
  it("should return false if a video isn't from a GoPro", () =>
    expect(videoUtils.isGoProVideo(testVideos.drone)).toBe(false));

  it("should return true if a video starts with GOPRO", () =>
    expect(videoUtils.isGoProVideo("GOPRO123.MP4")).toBe(true));

  it("should return true if a video starts with GH", () => expect(videoUtils.isGoProVideo("GH123456.MP4")).toBe(true));
  it("should return true if a video starts with GP", () => expect(videoUtils.isGoProVideo("GP123456.MP4")).toBe(true));
  it("should return true if a video starts with GX", () => expect(videoUtils.isGoProVideo("GX123456.MP4")).toBe(true));
});
