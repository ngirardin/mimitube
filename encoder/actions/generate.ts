import fs from "fs/promises";
import { Project } from "../schemas/projectSchema";
import videoUtils from "../videoUtils";

const generateProject = async (path: string): Promise<Project> => {
  const files = await fs.readdir(path);
  const videoFiles = files.filter(videoUtils.fileIsVideo);

  console.log(`Found ${files.length} files, including ${videoFiles.length} videos`);

  return Promise.all(
    videoFiles.map(async (file) => ({
      file,
      attributes: {
        isDrone: videoUtils.isDroneVideo(file),
      },
      progress: {
        rekognition10x: false,
        normalized: false,
      },
    }))
  );
};

export default async (path: string): Promise<void> => {
  console.log(`Analyzing files in ${path}...`);

  const project = await generateProject(path);

  await fs.writeFile(`${path}/project.json`, JSON.stringify(project, null, 4));
};
