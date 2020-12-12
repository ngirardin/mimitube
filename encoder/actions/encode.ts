import * as fs from "fs/promises";
import ffmpegUtils from "../ffmpegUtils";
import projectUtils from "../projectUtils";
import videoUtils from "../videoUtils";
import h264Renderer from "./renderers/h264Renderer";
import h265Renderer from "./renderers/h265Renderer";
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
  const timeMessage = `Rendering of ${path} done!`;
  console.time(timeMessage);

  const project = await projectUtils.readProject(path);

  const pathOut = `${path}/out`;
  const pathOutTemp = `${pathOut}/temp`;

  // if (await pathExists(pathOut)) {
  //   console.log("Project already rendered ");
  //   console.log("TODO check integrity");
  //   process.exit(0);
  //   //TODO const isIntegrityOK = await checkIntegrity(path);
  // }

  if (await pathExists(pathOutTemp)) {
    console.log("Clearing existing out folder");
    await fs.rm(`${pathOutTemp}`, { recursive: true });
  }

  console.log("Creating temp out folder");
  await fs.mkdir(pathOutTemp, { recursive: true });

  const projectVideos = project.videos;

  console.log(`Found ${projectVideos.length} videos`);

  const init: Render[] = [];

  const renders: Render[] = projectVideos.reduce((acc, video) => {
    const arr: Render[] = [];

    // TODO map the renderer name / method somewhere to avoid this if
    if (!video.progress.h264) {
      arr.push({ file: video.file, render: h264Renderer });
    }

    if (!video.progress.h265) {
      arr.push({ file: video.file, render: h265Renderer });
    }

    // if (!video.progress.rekognition10x) {
    //   arr.push({ file: video.file, render: rekognition10xRender });
    // }

    return [...acc, ...arr];
  }, init);

  if (renders.length === 0) {
    console.log("All the videos have been already been rendered");
  } else {
    // TODO move to fn

    console.log(`${renders.length} renders queued`);

    for (const render of renders) {
      console.log(`Rendering ${render.file}...`);
      const fileOut = await render.render.render(path, render.file, pathOutTemp);

      console.log(`Rendering of ${render.file} to ${fileOut} done`);

      const newName = `${pathOut}/${render.render.name}_${render.file}`;

      console.log(`${fileOut} -> ${newName} done`);
      await fs.rename(fileOut, newName);

      const updatedProject = await projectUtils.setProgressComplete(project, render);
      projectUtils.writeProject(updatedProject);
    }
  }

  // TODO check for merged flag

  console.log(`Merging videos...`);

  // Sort the video
  const concatFiles = (
    await Promise.all(
      projectVideos.map(async (v) => ({
        file: v.file,
        creationDate: (await videoUtils.getCreationTime(project.path, v.file)).date.getTime(),
      }))
    )
  ).sort((video1, video2) => video1.creationDate - video2.creationDate);

  for (const codec of ["h264", "h265"]) {
    console.log(`Concatenating ${codec} videos...`);
    const concatOut = await ffmpegUtils.concat(
      pathOut,
      pathOutTemp,
      concatFiles.map((v) => `${codec}_${v.file}`)
    );

    await fs.rename(concatOut, `${pathOut}/${codec}.mp4`);
  }

  console.timeEnd(timeMessage);
};
