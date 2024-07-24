const ffmpeg = require("fluent-ffmpeg");
export async function concatAudios(props: {
  audioPaths: string[];
  outputPath: string;
}): Promise<boolean> {
  // List of MP3 files to concatenate
  // const files = [
  //   "out/speech-jp-0.mp3",
  //   "out/speech-en-0.mp3",
  //   "out/speech-jp-1.mp3",
  //   "out/speech-en-1.mp3",
  // ];

  // Name of the silent file
  // const silenceFile = "data/silence_5_seconds.mp3";

  // Create an array to hold the files and silence files in sequence
  const fileSequence: string[] = [];

  props.audioPaths.forEach((file, index) => {
    fileSequence.push(file);
    // if (index < props.audioPaths.length - 1) {
    //   fileSequence.push(silenceFile);
    // }
  });

  // Create a new ffmpeg command
  const command = ffmpeg();

  // Add each input file to the command
  fileSequence.forEach((file) => {
    command.input(file);
  });

  // Set the output format and pipe to the output stream
  return new Promise((resolve, reject) => {
    command
      .on("error", (err: any) => {
        console.error("Error: " + err.message);
        reject(err);
      })
      .on("end", () => {
        console.log("Files have been concatenated successfully.");
        resolve(true);
      })
      .mergeToFile(props.outputPath);
  });
}
