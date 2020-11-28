import * as zod from "zod";

export const videoSchema = zod.object({
  file: zod.string(),
  attributes: zod.object({
    isDrone: zod.boolean(),
  }),
  progress: zod.object({
    rekognition10x: zod.boolean(),
    normalized: zod.boolean(),
  }),
});

export const projectSchema = videoSchema.array();

export type Video = zod.infer<typeof videoSchema>;

export type Project = zod.infer<typeof projectSchema>;
