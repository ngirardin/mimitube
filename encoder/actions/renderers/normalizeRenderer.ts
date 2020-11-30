import { Renderer } from "./RendererType";

const normalizeRenderer: Renderer = (file: string): Promise<void> => {
  console.log(`Starting normalizeRenderer for ${file}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`rekognition10xRenderer for ${file} done`);
      resolve();
    }, 2_000);
  });
};

export default normalizeRenderer;
