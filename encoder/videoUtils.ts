import fs from "fs/promises";
import ffprobeUtils from "./ffprobeUtils";

interface CreationTime {
  source: "metadata" | "fileCreation";
  date: Date;
}

export default {
  getCreationTime: async (file: string): Promise<CreationTime> => {
    const metadata = await ffprobeUtils.probe(file);
    const creationTime = await ffprobeUtils.getCreationTime(metadata);

    if (creationTime) {
      return { source: "metadata", date: creationTime };
    }

    const { mtime } = await fs.stat(file);

    return { source: "fileCreation", date: mtime };
  },
};
