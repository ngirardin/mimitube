import fs from "fs/promises";
import ffprobeUtils from "./ffprobeUtils";

interface CreationTime {
  source: "metadata" | "fileCreation";
  date: Date;
}

const videoExtensions = ["mp4", "mts"];

export default {
  fileIsVideo: (file: string): boolean => {
    const extension = file.split(".").pop();
    return extension !== undefined && videoExtensions.includes(extension.toLowerCase());
  },

  getCreationTime: async (path: string, file: string): Promise<CreationTime> => {
    const creationTime = await ffprobeUtils.getCreationTime(path, file);

    if (creationTime) {
      return { source: "metadata", date: creationTime };
    }

    const { mtime } = await fs.stat(`${path}/${file}`);

    return { source: "fileCreation", date: mtime };
  },

  isDroneVideo: (file: string): boolean => file.startsWith("DJI_"),

  isGoProVideo: (file: string): boolean =>
    file.startsWith("GOPR") || file.startsWith("GH") || file.startsWith("GP") || file.startsWith("GX"),
};
