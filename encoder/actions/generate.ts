import fs from "fs/promises";
import videoUtils from "../videoUtils";

interface GenerateResult {
  file: string;
}

export default async (path: string): Promise<GenerateResult[]> => {
  console.log(`Analysing files in ${path}...`);
  const files = await fs.readdir(path);

  const videos = files.filter(videoUtils.fileIsVideo);

  console.log(`Found ${files.length} files, including ${videos.length} videos`);

  return videos.map((file) => {
    const attributes = [videoUtils.isDroneVideo(file) ? "isDrone" : undefined];

    return {
      file: file,
      attributes: attributes.filter((attribute) => attribute !== undefined),
    };
  });
};
