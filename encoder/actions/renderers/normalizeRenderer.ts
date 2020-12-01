import { Renderer } from "./RendererType";

const normalizeRenderer: Renderer = (pathIn: string, fileIn: string, pathOut: string): Promise<string> => {
  console.log(`Starting normalizeRenderer for ${fileIn}`);
  // TODO remove
  console.log(`remove ${pathIn} ${pathOut}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`rekognition10xRenderer for ${fileIn} done`);
      resolve("out.mp4");
    }, 2_000);
  });
};

export default normalizeRenderer;
