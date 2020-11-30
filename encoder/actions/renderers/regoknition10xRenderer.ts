import { Renderer } from "./RendererType";

const rekognition10xRender: Renderer = (file: string): Promise<void> => {
  console.log(`Starting rekognition10xRenderer for ${file}`);

  ffmpeg;
  // ffmpeg.exe -i DJI_0009.MP4 -filter:v "setpts=0.1*PTS" -an .\DJI_0009_speed10x.mp4

  console.log(`rekognition10xRenderer for ${file} done`);
};

export default rekognition10xRender;
