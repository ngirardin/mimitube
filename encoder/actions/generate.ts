import fs from "fs/promises";
import { ProjectVideos } from "../schemas/projectVideoSchema";
import videoUtils from "../videoUtils";

const generateProject = async (path: string): Promise<ProjectVideos> => {
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
        h264: false,
        h265: false,
        rekognition10x: false,
      },
    }))
  );
};

export default async (path: string): Promise<void> => {
  // TODO check if project file already exists
  console.log(`Analyzing files in ${path}...`);

  const project = await generateProject(path);

  await fs.writeFile(`${path}/project.json`, JSON.stringify(project, null, 4));
};
