import { FfmpegCommand } from "fluent-ffmpeg";
import ffmpegUtils from "../../ffmpegUtils";
import { Renderer } from "./RendererType";

const renderer: Renderer = {
  name: "h265",
  render: async (pathIn: string, fileIn: string, pathOut: string): Promise<string> => {
    console.log(`Starting h265 render for ${fileIn}...`);

    const command = (command: FfmpegCommand) =>
      command
        .audioCodec("aac")
        .autopad()
        .fps(60)
        .size("3840x2160")
        // default is 28 == h264 @ 23
        .outputOption(["-crf 25", "-preset veryfast"])
        .videoCodec("libx265");

    return await ffmpegUtils.encode(pathIn, fileIn, pathOut, "out.mp4", command);
  },
};

export default renderer;
