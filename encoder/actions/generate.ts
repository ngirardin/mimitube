import fs from "fs/promises";
import videoUtils from "../videoUtils";

export default async (path: string): Promise<void> => {
  console.log(`Analysing files in ${path}...`);
  const files = await fs.readdir(path);

  const videos = files.filter(videoUtils.fileIsVideo);

  console.log(`Found ${files.length} files, including ${videos.length} videos`);

  const rows = await Promise.all(
    videos.map(async (video) => {
      const attributes = [videoUtils.isDroneVideo(video) ? "isDrone" : undefined];

      return {
        definition: {
          file: video,
          attributes: attributes.filter((attribute) => attribute !== undefined),
          progress: {
            rekognition10x: false,
            normalized: false,
          },
        },
      };
    })
  );

  await fs.writeFile(`${path}/project.json`, JSON.stringify(rows, null, 4));
};
