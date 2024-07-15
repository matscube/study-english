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
