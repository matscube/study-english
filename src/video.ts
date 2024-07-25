const ffmpeg = require("fluent-ffmpeg");
export async function createVideoFromImage(props: {
  imagePath: string;
  outputPath: string;
}): Promise<boolean> {
  const durationSecond = 2;
  return new Promise((resolve, reject) => {
    ffmpeg(props.imagePath)
      .loop(durationSecond)
      .fps(25)
      .on("end", function () {
        resolve(true);
      })
      .on("error", function (err: any) {
        console.error("an error happened: " + err.message);
        reject(err);
      })
      // save to file
      // Either working
      // .save('out/output.m4v');
      .save(props.outputPath);
  });
}

export async function mixAudioAndVideo(props: {
  videoPath: string;
  audioPath: string;
  outputPath: string;
}): Promise<boolean> {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .addInput(props.videoPath)
      .addInput(props.audioPath)
      .addOptions(["-map 0:v", "-map 1:a", "-c:v copy"])
      .format("mp4")
      .on("error", (error: any) => {
        console.log(error);
        reject(error);
      })
      .on("end", () => {
        resolve(true);
      })
      .saveToFile(props.outputPath);
  });
}

export async function concatVideos(props: {
  videoPaths: string[];
  outputPath: string;
}): Promise<boolean> {
  const command = ffmpeg();
  props.videoPaths.forEach((videoPath) => {
    command.input(videoPath);
  });
  return new Promise((resolve, reject) => {
    command
      .on("error", (error: any) => {
        console.log(error);
        reject(error);
      })
      .on("end", () => {
        resolve(true);
      })
      .mergeToFile(props.outputPath);
  });
}
