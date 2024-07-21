const ffmpeg = require('fluent-ffmpeg');
export function createVideoFromImage() {
  const imagePath = 'out/html-image-2.png';
  // const imagePath = 'data/29028444_m.jpg';
  // make sure you set the correct path to your video file
  var proc = ffmpeg(imagePath)
    // loop for 5 seconds
    .loop(10)
    // using 25 fps
    .fps(25)
    // setup event handlers
    .on('end', function() {
      console.log('file has been converted succesfully');
    })
    .on('error', function(err: any) {
      console.log('an error happened: ' + err.message);
    })
    // save to file
    // Either working
    // .save('out/output.m4v');
    .save('out/image-video-2.mp4');
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
