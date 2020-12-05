import fs from "fs/promises";
import { Render } from "./actions/encode";
import { Project, projectSchema } from "./schemas/projectVideoSchema";

const filename = "project.json";

const readProject = async (path: string): Promise<Project> => {
  const file = await fs.readFile(`${path}/${filename}`);
  const json = JSON.parse(file.toString());
  const project = projectSchema.parse(json);
  return { ...project, path };
};

export default {
  readProject,

  setProgressComplete: async (project: Project, render: Render): Promise<Project> => {
    console.log(
      `Updating project ${project.path} for video ${render.file}, setting render ${String(
        render.render.name
      )} progress to true`
    );

    const diskProject = await readProject(project.path);

    const newVideos = diskProject.videos.map((v) => {
      if (v.file !== render.file) {
        return v;
      }

      return { ...v, progress: { ...v.progress, [render.render.name]: true } };
    });

    return { ...project, videos: newVideos };
  },

  writeProject: async (project: Project): Promise<void> => {
    // No need to write the path, it's only set when reading the project
    const { path, ...rest } = project;
    fs.writeFile(`${project.path}/${filename}`, JSON.stringify(rest, null, 4));
  },
};
