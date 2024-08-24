import path from "path";
import { AppConfig } from "./config";
import { generateSecureRandomHash } from "./util";

const ffmpeg = require("fluent-ffmpeg");
export async function createVideoFromImage(props: {
  imagePath: string;
}): Promise<{
  outputPath: string;
}> {
  const outputPath = path.join(AppConfig.tmpDir, `image-${generateSecureRandomHash()}.mp4`)
  const durationSecond = 2;
  return new Promise((resolve, reject) => {
    ffmpeg(props.imagePath)
      .loop(durationSecond)
      .fps(25)
      .on("end", function () {
        resolve({
          outputPath,
        });
      })
      .on("error", function (err: any) {
        console.error("an error happened: " + err.message);
        reject(err);
      })
      // save to file
      // Either working
      // .save('out/output.m4v');
      .save(outputPath);
  });
}

export async function mixAudioAndVideo(props: {
  videoPath: string;
  audioPath: string;
}): Promise<{
  outputPath: string;
}> {
  const outputPath = path.join(AppConfig.tmpDir, `mix-audio-and-video-${generateSecureRandomHash()}.mp4`);
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
        resolve({ outputPath });
      })
      .saveToFile(outputPath);
  });
}

export async function concatVideos(props: {
  videoPaths: string[];
}): Promise<{
  outputPath: string;
}> {
  const outputPath = path.join(AppConfig.tmpDir, `mix-audio-and-video-${generateSecureRandomHash()}.mp4`);
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
        resolve({ outputPath });
      })
      .mergeToFile(outputPath);
  });
}
