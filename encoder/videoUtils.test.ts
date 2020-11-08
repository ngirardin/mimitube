import videoUtils from "./videoUtils";

const videosPath = "/mnt/c/Users/ngira/Desktop/gopro";

export const testVideos = {
  drone: `${videosPath}/drone/DJI_0009.MP4`, // no creation_date metadata
  gopro: `${videosPath}/GX013175.MP4`,
  gsm: `${videosPath}/VID_20201107_130823.mp4`,
};

it("should return the creation date from the video metadata", async () => {
  expect(await videoUtils.getCreationTime(testVideos.gopro)).toEqual({
    date: new Date("2020-09-13T16:00:25.000Z"),
    source: "metadata",
  });
  expect(await videoUtils.getCreationTime(testVideos.gsm)).toEqual({
    date: new Date("2020-11-07T12:09:04.000Z"),
    source: "metadata",
  });
});

it("should fallback to reading the file date if the video has no metadata", async () => {
  expect(await videoUtils.getCreationTime(testVideos.drone)).toEqual({
    date: new Date("2020-10-10T14:09:34.000Z"),
    source: "fileCreation",
  });
});
