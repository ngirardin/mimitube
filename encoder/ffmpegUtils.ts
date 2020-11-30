// const encode = (fileIn: string, fileOut: string, encodingParams: EncodingParams, pass: 1 | 2): Promise<void> =>
//   new Promise((resolve, reject) => {
//     const { bitrate, crf, maxRate, minRate, resolution, threads, tileColumns } = encodingParams;

//     const command = Ffmpeg(fileIn)
//       .size(`${resolution.width}x${resolution.height}`)
//       .fps(50)
//       .autopad()
//       .videoBitrate(bitrate)
//       .videoCodec("libvpx-vp9")
//       .outputOptions(`-minrate ${minRate}`)
//       .outputOptions(`-maxrate ${maxRate}`)
//       .outputOptions(`-tile-columns ${tileColumns}`)
//       .outputOptions("-g 240")
//       .outputOptions(`-threads ${threads}`)
//       .outputOptions("-quality good")
//       .outputOptions(`-crf ${crf}`)
//       .outputOptions("-speed 4")
//       .outputOptions(`-pass ${pass}`)
//       .audioCodec("libopus")
//       .output(fileOut);

//     const fileProgress = new CliProgress.Bar({
//       format: "[{bar}] {percentage}% | {eta_formatted} | {fps} fps for pass {pass} at {width}x{height} | {timemark}",
//     });
//     fileProgress.start(100, 0, { fps: 0, pass: 0, width: 0, height: 0, timemark: "00:00:00" });

//     command
//       .on("error", function (err, stdout, stderr) {
//         console.error(err);
//         console.error(stdout);
//         console.error(stderr);
//         reject(err);
//       })
//       .on("progress", function (progress) {
//         const { currentFps, timemark, percent } = progress;
//         fileProgress.update(percent, {
//           fps: Math.round(currentFps),
//           width: encodingParams.resolution.width,
//           height: encodingParams.resolution.height,
//           pass,
//           timemark,
//         });
//       })
//       .on("end", () => {
//         // Clear the progress bar
//         fileProgress.stop();
//         resolve();
//       })
//       .run();
//   });

// const encodeFile = async (fileIn: string, fileOut: string, encodingParam: EncodingParams): Promise<void> => {
//   console.log(fileIn);
//   await encode(fileIn, fileOut, encodingParam, 1);
//   await encode(fileIn, fileOut, encodingParam, 2);
// };
