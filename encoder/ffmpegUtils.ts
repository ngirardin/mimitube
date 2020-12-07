import CliProgress from "cli-progress";
import Ffmpeg, { FfmpegCommand } from "fluent-ffmpeg";
import fs from "fs/promises";

const fileOut = "out.mp4";

const executeCommand = (command: FfmpegCommand): Promise<void> =>
  new Promise<void>(async (resolve, reject) => {
    const fileProgress = new CliProgress.Bar({
      format: "[{bar}] {percentage}% | {fps} fps | elapsed: {duration_formatted} | ETA: {eta_formatted}",
    });

    fileProgress.start(100, 0, { fps: 0 });

    command
      .on("error", function (err, stdout, stderr) {
        console.error(err);
        console.error(stdout);
        console.error(stderr);
        return reject(err);
      })
      .on("progress", function (progress) {
        const { currentFps, percent } = progress;
        fileProgress.update(percent, {
          fps: Math.round(currentFps),
        });
      })
      .on("end", () => {
        // Clear the progress bar
        fileProgress.stop();
        return resolve();
      })
      .run();
  });

const concat = async (pathInOut: string, pathOutTemp: string, filesIn: string[]): Promise<string> => {
  const playlist = `${pathOutTemp}/concat`;
  await fs.writeFile(playlist, filesIn.map((file) => `file '${pathInOut}/${file}'`).join("\n"));

  const pathFileOut = `${pathInOut}/${fileOut}`;

  const command = Ffmpeg(playlist)
    .inputOption("-f concat")
    .inputOption("-safe 0")
    .outputOption("-c copy")
    .output(`${pathInOut}/out.mp4`);

  await executeCommand(command);

  await fs.rm(playlist);
  return pathFileOut;
};

const encode = async (
  pathIn: string,
  fileIn: string,
  pathOut: string,
  updateCommand: (command: FfmpegCommand) => void
): Promise<string> => {
  const command = Ffmpeg(`${pathIn}/${fileIn}`);
  updateCommand(command);
  command.output(`${pathOut}/${fileOut}`);

  await executeCommand(command);

  return `${pathOut}/${fileOut}`;
};

export default { concat, encode };
