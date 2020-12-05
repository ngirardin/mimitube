import fs from "fs/promises";
import projectUtils from "../projectUtils";
import { Project } from "../schemas/projectVideoSchema";
import videoUtils from "../videoUtils";

const generateProject = async (path: string): Promise<Project> => {
  const files = await fs.readdir(path);
  const videoFiles = files.filter(videoUtils.fileIsVideo);

  console.log(`Found ${files.length} files, including ${videoFiles.length} videos`);

  const videos = await Promise.all(
    videoFiles.map(async (file) => ({
      file,
      attributes: {
        isDrone: videoUtils.isDroneVideo(file),
      },
      progress: {
        h264: false,
        h265: false,
        rekognition10x: false,
      },
    }))
  );

  return { path, videos };
};

export default async (path: string): Promise<void> => {
  // TODO check if project file already exists
  console.log(`Analyzing files in ${path}...`);

  const project = await generateProject(path);
  await projectUtils.writeProject(project);
};
