import { ProgressSchema } from "../../schemas/projectVideoSchema";

export interface Renderer {
  render: (pathIn: string, fileIn: string, pathOut: string) => Promise<string>;
  name: keyof ProgressSchema;
}
