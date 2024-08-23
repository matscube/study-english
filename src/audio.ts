const ffmpeg = require("fluent-ffmpeg");

export async function volumeUp(props: {
  audioPath: string;
  outputPath: string;
}): Promise<boolean> {
  return new Promise((resolve, reject) => {
    ffmpeg(props.audioPath)
      .audioFilters("volume=10dB")
      .on("error", (err: any) => {
        console.error("Error: " + err.message);
        reject(err);
      })
      .on("end", () => {
        resolve(true);
      })
      .save(props.outputPath);
  });
}

export async function concatAudios(props: {
  audioPaths: string[];
  outputPath: string;
}): Promise<boolean> {
  const fileSequence: string[] = [];

  props.audioPaths.forEach((file, index) => {
    fileSequence.push(file);
  });
  const command = ffmpeg();
  fileSequence.forEach((file) => {
    command.input(file);
  });

  return new Promise((resolve, reject) => {
    command
      .on("error", (err: any) => {
        console.error("Error: " + err.message);
        reject(err);
      })
      .on("end", () => {
        resolve(true);
      })
      .mergeToFile(props.outputPath);
  });
}
