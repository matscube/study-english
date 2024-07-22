const ffmpeg = require('fluent-ffmpeg');
export async function createVideoFromImage(props: {
  imagePath: string;
  outputPath: string;
}): Promise<boolean> {
  const durationSecond = 2
  return new Promise((resolve, reject) => {
    ffmpeg(props.imagePath)
      .loop(durationSecond)
      .fps(25)
      .on('end', function() {
        resolve(true);
      })
      .on('error', function(err: any) {
        console.error('an error happened: ' + err.message);
        reject(err);
      })
      // save to file
      // Either working
      // .save('out/output.m4v');
      .save(props.outputPath);
  });
}

export function mixAudioAndVideo() {
  const videoPath = 'out/image-video-2.mp4';
  const audioPath = 'out/speech-en-1.mp3';
  const outputPath = 'out/output-1-en.mp4';
  
  ffmpeg()
  .addInput(videoPath)
  .addInput(audioPath)
  .addOptions(['-map 0:v', '-map 1:a', '-c:v copy'])
  .format('mp4')
  .on('error', (error: any) => console.log(error))
  .on('end', () => console.log(' finished !'))
  .saveToFile(outputPath)
}

export function concatVideos() {
  const videoPaths = [
    'out/output-1-jp.mp4',
    'out/output-1-en.mp4',
  ];
  const outputPath = 'out/output.mp4';
  
  const command = ffmpeg();
  videoPaths.forEach((videoPath) => {
    command.input(videoPath);
  });
  command
  .on('error', (error: any) => console.log(error))
  .on('end', () => console.log(' finished !'))
  .mergeToFile(outputPath);
}
