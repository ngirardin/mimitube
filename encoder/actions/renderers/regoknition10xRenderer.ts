import { FfmpegCommand } from "fluent-ffmpeg";
import fs from "fs/promises";
import ffmpegUtils from "../../ffmpegUtils";
import { Renderer } from "./RendererType";

const rekognition10xRender: Renderer = async (pathIn: string, fileIn: string, pathOut: string): Promise<string> => {
  console.log(`Starting rekognition10xRenderer for ${fileIn}...`);

  const speed = 10;
  const command = (command: FfmpegCommand) => command.noAudio().videoFilter([`setpts=${1 / speed}*PTS`]);

  const fileOut = await ffmpegUtils.encode(pathIn, fileIn, pathOut, "out.mp4", command);

  const newName = fs.rename(fileOut, `rekognition_${fileIn}`);

  console.log(`${fileIn} -> ${newName} done`);

  return fileOut;
};

export default rekognition10xRender;
