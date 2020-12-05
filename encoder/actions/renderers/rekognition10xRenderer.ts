import { FfmpegCommand } from "fluent-ffmpeg";
import ffmpegUtils from "../../ffmpegUtils";
import { Renderer } from "./RendererType";

const renderer: Renderer = {
  name: "rekognition10x",
  render: async (pathIn: string, fileIn: string, pathOut: string): Promise<string> => {
    console.log(`Starting rekognition10xRenderer for ${fileIn}...`);

    const speed = 10;
    const command = (command: FfmpegCommand) =>
      command
        .noAudio()
        .videoFilter([`setpts=${1 / speed}*PTS`])
        .videoCodec("libx264")
        .outputOption("-preset ultrafast");

    return await ffmpegUtils.encode(pathIn, fileIn, pathOut, "out.mp4", command);
  },
};

export default renderer;
