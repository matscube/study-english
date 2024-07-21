const ffmpeg = require('fluent-ffmpeg');
export function createVideoFromImage() {
  
  // make sure you set the correct path to your video file
  var proc = ffmpeg('data/29028444_m.jpg')
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
    .save('out/output.mp4');
}

export function mixAudioAndVideo() {
  const videoPath = 'out/output.mp4';
  const audioPath = 'out/speech-en-0.mp3';
  const outputPath = 'out/mixed.mp4';
  
  ffmpeg()
  .addInput(videoPath)
  .addInput(audioPath)
  .addOptions(['-map 0:v', '-map 1:a', '-c:v copy'])
  .format('mp4')
  .on('error', (error: any) => console.log(error))
  .on('end', () => console.log(' finished !'))
  .saveToFile(outputPath)
}
