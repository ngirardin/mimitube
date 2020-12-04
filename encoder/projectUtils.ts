import fs from "fs/promises";
import { Render } from "./actions/encode";
import { ProjectVideos, projectVideosSchema } from "./schemas/projectVideoSchema";

export interface Project {
  path: string;
  videos: ProjectVideos;
}

const filename = "project.json";

export default {
  readProject: async (path: string): Promise<Project> => {
    const file = await fs.readFile(`${path}/${filename}`);
    const json = JSON.parse(file.toString());
    const projectVideos: ProjectVideos = projectVideosSchema.parse(json);
    return { path, videos: projectVideos };
  },

  setProgressComplete: async (project: Project, render: Render): Promise<Project> => {
    console.log(
      `Updating project ${project} for video ${render.file}, setting render ${render.render.name} progress to true`
    );

    const newVideos: ProjectVideos = project.videos.map((v) => {
      if (v.file !== render.file) {
        return v;
      }

      return { ...v, progress: { ...v.progress, [render.render.name]: true } };
    });

    return { ...project, videos: newVideos };
  },

  writeProject: (project: Project): Promise<void> =>
    fs.writeFile(`${project.path}/${filename}`, JSON.stringify(project)),
};
