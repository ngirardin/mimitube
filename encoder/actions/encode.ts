import * as fs from "fs/promises";
import { Project, projectSchema } from "./projectSchema";

const readProject = async (path: string): Promise<Project> => {
  const file = await fs.readFile(`${path}/project.json`);
  const json = JSON.parse(file.toString());
  return projectSchema.parse(json);
};

const hasOutFolder = (path: string): boolean => fs.access(`${path}/out`);

export default async (path: string) => {
  console.log(`Encoding ${path}...`);

  console.log(await readProject(path));
};
