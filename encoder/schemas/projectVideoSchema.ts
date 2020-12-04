import * as zod from "zod";

const progressSchema = zod.object({
  rekognition10x: zod.boolean(),
  normalized: zod.boolean(),
});

export type ProgressSchema = zod.infer<typeof progressSchema>;

export const projectVideoSchema = zod.object({
  file: zod.string(),
  attributes: zod.object({
    isDrone: zod.boolean(),
  }),
  progress: progressSchema,
});

export type ProjectVideo = zod.infer<typeof projectVideoSchema>;

export const projectVideosSchema = projectVideoSchema.array();
export type ProjectVideos = zod.infer<typeof projectVideosSchema>;
