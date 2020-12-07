import { FfmpegCommand } from "fluent-ffmpeg";
import ffmpegUtils from "../../ffmpegUtils";
import { Renderer } from "./RendererType";

const renderer: Renderer = {
  name: "h264",
  render: async (pathIn: string, fileIn: string, pathOut: string): Promise<string> => {
    console.log(`Starting h264 render for ${fileIn}...`);

    const command = (command: FfmpegCommand) =>
      command
        .audioCodec("aac")
        .autopad()
        .fps(60)
        .size("3840x2160")
        .outputOption(["-crf 20", "-preset veryfast"])
        .videoCodec("libx264");

    return ffmpegUtils.encode(pathIn, fileIn, pathOut, command);
  },
};

export default renderer;
