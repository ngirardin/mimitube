import ffprobePromise from "./ffprobeUtils";
import { testVideos, testVideosPath } from "./videoUtils.test";

describe("the getCreationTime method", () => {
  it("should return undefine for a Mavic Air video", async () => {
    const probeData = await ffprobePromise.probe(testVideosPath, testVideos.drone);
    expect(probeData).toMatchSnapshot();
    expect(await ffprobePromise.getCreationTime(probeData)).toBeUndefined();
  });

  it("should extract the creation date from a gopro video", async () => {
    const probeData = await ffprobePromise.probe(testVideosPath, testVideos.gopro);
    expect(probeData).toMatchSnapshot();
    expect(await ffprobePromise.getCreationTime(probeData)).toEqual(new Date("2020-09-13T16:00:25.000Z"));
  });

  it("should extract the creation date from a gsm video", async () => {
    const probeData = await ffprobePromise.probe(testVideosPath, testVideos.gsm);
    expect(probeData).toMatchSnapshot();
    expect(await ffprobePromise.getCreationTime(probeData)).toEqual(new Date("2020-11-07T12:09:04.000Z"));
  });
});
