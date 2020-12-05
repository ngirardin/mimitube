import * as zod from "zod";

const progressSchema = zod.object({
  h264: zod.boolean(),
  h265: zod.boolean(),
  rekognition10x: zod.boolean(),
});
export type ProgressSchema = zod.infer<typeof progressSchema>;

const videoSchema = zod.object({
  file: zod.string(),
  attributes: zod.object({
    isDrone: zod.boolean(),
  }),
  progress: progressSchema,
});

export const projectSchema = zod.object({
  videos: videoSchema.array(),
});
type ProjectSchema = zod.infer<typeof projectSchema>;

export interface Project extends ProjectSchema {
  path: string;
}
