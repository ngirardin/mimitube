import ffprobeUtils from "./ffprobeUtils";
import { testVideos, testVideosPath } from "./videoUtils.test";

describe("the getCreationTime method", () => {
  it("should return undefine for a Mavic Air video", async () =>
    expect(await ffprobeUtils.getCreationTime(testVideosPath, testVideos.drone)).toBeUndefined());

  it("should extract the creation date from a gopro video", async () =>
    expect(await ffprobeUtils.getCreationTime(testVideosPath, testVideos.gopro)).toEqual(
      new Date("2020-09-13T16:00:25.000Z")
    ));

  it("should extract the creation date from a gsm video", async () =>
    expect(await ffprobeUtils.getCreationTime(testVideosPath, testVideos.gsm)).toEqual(
      new Date("2020-11-07T12:09:04.000Z")
    ));
});

describe("the getDuration method", () => {
  it("should throw an exception when the file is not a video", async () =>
    await expect(ffprobeUtils.getDuration(testVideosPath, testVideos.text)).rejects.toThrowError(
      "No duration on stream 0"
    ));

  it("should return the duration of the videos", async () => {
    expect(await ffprobeUtils.getDuration(testVideosPath, testVideos.drone)).toEqual(290.9907);
    expect(await ffprobeUtils.getDuration(testVideosPath, testVideos.gopro)).toEqual(26.82);
    expect(await ffprobeUtils.getDuration(testVideosPath, testVideos.gsm)).toEqual(40.430678);
  });
});
