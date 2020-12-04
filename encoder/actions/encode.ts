import * as fs from "fs/promises";
import projectUtils from "../projectUtils";
import rekognition10xRender from "./renderers/regoknition10xRenderer";
import { Renderer } from "./renderers/RendererType";

const pathExists = async (path: string): Promise<boolean> => {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
};

export type Render = { file: string; render: Renderer };

export default async (path: string) => {
  console.log(`Reading ${path}/project.json...`);

  const pathOut = `${path}/out`;
  const pathOutTemp = `${pathOut}/temp`;

  if (await pathExists(pathOut)) {
    console.log("Project already rendered ");
    console.log("TODO check integrity");
    process.exit(0);
    //TODO const isIntegrityOK = await checkIntegrity(path);
  }

  if (await pathExists(pathOutTemp)) {
    console.log("Clearing existing out folder");
    await fs.rm(`${pathOutTemp}`, { recursive: true });
  }

  console.log("Creating temp out folder");
  await fs.mkdir(pathOutTemp, { recursive: true });

  const project = await projectUtils.readProject(path);
  const projectVideos = project.videos;

  console.log(`Found ${projectVideos.length} videos`);

  const init: Render[] = [];

  const renders: Render[] = projectVideos.reduce((acc, video) => {
    const arr: Render[] = [];

    // if (!video.progress.normalized) {
    //   arr.push({ file: video.file, render: normalizedRender });
    // }

    if (!video.progress.rekognition10x) {
      arr.push({ file: video.file, render: rekognition10xRender });
    }

    return [...acc, ...arr];
  }, init);

  if (renders.length === 0) {
    console.log("All the videos have been already been rendered");
    process.exit(0);
  }

  console.log(`${renders.length} renders queued`);

  for (const render of renders) {
    console.log(`Rendering ${render.file}...`);
    const fileOut = await render.render.render(path, render.file, pathOutTemp);

    console.log(`Rendering of ${render.file} to ${fileOut} done`);

    const newName = `${pathOut}/rekognition_${render.file}`;

    console.log(`${fileOut} -> ${newName} done`);
    await fs.rename(fileOut, newName);

    const updatedProject = await projectUtils.setProgressComplete(project, render);
    projectUtils.writeProject(updatedProject);
  }

  console.log(`Rendering of ${path} done!`);
};
