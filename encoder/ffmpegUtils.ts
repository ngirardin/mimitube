import CliProgress from "cli-progress";
import Ffmpeg, { FfmpegCommand } from "fluent-ffmpeg";
import ffprobeUtils from "./ffprobeUtils";

type Command = (command: FfmpegCommand) => FfmpegCommand;

const encode = (pathIn: string, fileIn: string, pathOut: string, fileOut: string, commands: Command): Promise<string> =>
  new Promise((resolve, reject) => {
    const fileProgress = new CliProgress.Bar({
      format: "[{bar}] {percentage}% | {eta_formatted} | {timemark} on {duration} | {fps} fps",
    });

    const duration = ffprobeUtils.getDuration(pathIn, fileIn);

    fileProgress.start(100, 0, { fps: 0, timemark: "00:00:00", duration });

    const command = Ffmpeg(`${pathIn}/${fileIn}`);

    commands(command);

    command
      .output(`${pathOut}/${fileOut}`)
      .on("error", function (err, stdout, stderr) {
        console.error(err);
        console.error(stdout);
        console.error(stderr);
        reject(err);
      })
      .on("progress", function (progress) {
        const { currentFps, timemark, percent } = progress;
        fileProgress.update(percent, {
          fps: Math.round(currentFps),
          timemark,
          duration,
        });
      })
      .on("end", () => {
        // Clear the progress bar
        fileProgress.stop();
        resolve();
      })
      .run();
  });

export default { encode };

// const command = Ffmpeg(fileIn)
//   .size(`${resolution.width}x${resolution.height}`)
//   .fps(50)
//   .autopad()
//   .videoBitrate(bitrate)
//   .videoCodec("libvpx-vp9")
//   .outputOptions(`-minrate ${minRate}`)
//   .outputOptions(`-maxrate ${maxRate}`)
//   .outputOptions(`-tile-columns ${tileColumns}`)
//   .outputOptions("-g 240")
//   .outputOptions(`-threads ${threads}`)
//   .outputOptions("-quality good")
//   .outputOptions(`-crf ${crf}`)
//   .outputOptions("-speed 4")
//   .outputOptions(`-pass ${pass}`)
//   .audioCodec("libopus")
//   .output(fileOut);
