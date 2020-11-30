import * as fs from "fs/promises";
import { Project, projectSchema } from "../schemas/projectSchema";
import normalizedRender from "./renderers/normalizeRenderer";
import rekognition10xRender from "./renderers/regoknition10xRenderer";
import { Renderer } from "./renderers/RendererType";

const readProject = async (path: string): Promise<Project> => {
  const file = await fs.readFile(`${path}/project.json`);
  const json = JSON.parse(file.toString());
  return projectSchema.parse(json);
};

const hasOutFolder = async (path: string): Promise<boolean> => {
  try {
    await fs.access(`${path}/out`);
    return true;
  } catch {
    return false;
  }
};

type Render = { file: string; render: Renderer };

export default async (path: string) => {
  console.log(`Reading ${path}/project.json...`);

  if (await hasOutFolder(path)) {
    console.log("Checking project videos integrity...");
    //TODO const isIntegrityOK = await checkIntegrity(path);
  }

  const videos = await readProject(path);

  console.log(`Found ${videos.length} videos`);

  const init: Render[] = [];

  const renders: Render[] = videos.reduce((acc, video) => {
    const arr: Render[] = [];

    if (!video.progress.normalized) {
      arr.push({ file: video.file, render: normalizedRender });
    }

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
    await render.render(render.file);
    console.log(`Rendering of ${render.file} done`);
  }

  console.log(`Rendering of ${path} done!`);
};
