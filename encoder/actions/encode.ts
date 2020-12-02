import * as fs from "fs/promises";
import { Project, projectSchema } from "../schemas/projectSchema";
import rekognition10xRender from "./renderers/regoknition10xRenderer";
import { Renderer } from "./renderers/RendererType";

const readProject = async (path: string): Promise<Project> => {
  const file = await fs.readFile(`${path}/project.json`);
  const json = JSON.parse(file.toString());
  return projectSchema.parse(json);
};

const pathExists = async (path: string): Promise<boolean> => {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
};

type Render = { file: string; render: Renderer };

export default async (path: string) => {
  console.log(`Reading ${path}/project.json...`);

  const pathOut = `${path}/out`;
  const pathOutTemp = `${pathOut}/temp`;

  if (await pathExists(pathOutTemp)) {
    console.log("Clearing existing out folder");
    await fs.rm(pathOutTemp, { recursive: true });
  }

  console.log("Creating temp out folder");
  await fs.mkdir(pathOutTemp);

  if (await pathExists(pathOut)) {
    console.log("Checking project videos integrity...");
    //TODO const isIntegrityOK = await checkIntegrity(path);
  }

  const videos = await readProject(path);

  console.log(`Found ${videos.length} videos`);

  const init: Render[] = [];

  const renders: Render[] = videos.reduce((acc, video) => {
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
    const fileOut = await render.render(path, render.file, pathOutTemp);

    console.log(`Rendering of ${render.file} to ${fileOut} done`);

    const newName = `${pathOut}/rekognition_${render.file}`;

    console.log(`${fileOut} -> ${newName} done`);
    await fs.rename(fileOut, newName);
  }

  console.log(`Rendering of ${path} done!`);
};
