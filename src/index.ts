import { concatVideos, createVideoFromImage, mixAudioAndVideo } from "./video";
import { concatAudios, volumeUp } from "./audio";
import { createImage, testRenderImage } from "./image";
import { Manuscript } from "./types";
import { ttsEnglish, ttsJapanese } from "./tts";
import { scripts } from "./assets/scripts";
import { generateScripts } from "./script";
import { AppConfig } from "./config";

/**
 * How to make a video
 *
 * 1. Prepare manuscripts.
 * 2. Create images with the manuscripts.
 * 3. Create silent movies from the images.
 * 4. Create audio files from the manuscripts.
 * 5. Combine the silent movies and the audio files one by one.
 * 6. Combine the videos into one.
 */
async function createVideo(script: Manuscript, index: number): Promise<{ normalPath: string, reviewPath: string }> {
  console.log(`creating video ${index}... (script: ${script.ja}/${script.en})`);

  // Silent video
  const imageResult = await createImage({
    index,
    script,
  });

  const imageVideoResult = await Promise.all([
    createVideoFromImage({
      imagePath: imageResult.japaneseImagePath,
    }),
    createVideoFromImage({
      imagePath: imageResult.englishImagePath,
    }),
    createVideoFromImage({
      imagePath: imageResult.japaneseReviewImagePath,
    }),
    createVideoFromImage({
      imagePath: imageResult.englishReviewImagePath,
    }),
  ]);

  // Audio
  const ttsResult = await Promise.all([
    ttsJapanese({
      text: script.ja,
    }),
    ttsEnglish({
      text: script.en,
    })
  ])

  // await Promise.all([
  //   volumeUp({
  //     audioPath: `./out/speech-${index}-ja.mp3`,
  //     outputPath: `./out/speech-${index}-ja-volume-up.mp3`,
  //   }),
  //   volumeUp({
  //     audioPath: `./out/speech-${index}-en.mp3`,
  //     outputPath: `./out/speech-${index}-en-volume-up.mp3`,
  //   })
  // ]);

  const concatAudiosResult = await Promise.all([
    // ja + silent
    concatAudios({
      audioPaths: [
        ttsResult[0].outputPath,
        AppConfig.silentVideoPath,
      ],
    }),
    // en + silent
    concatAudios({
      audioPaths: [
        ttsResult[1].outputPath,
        AppConfig.silentVideoPath,
      ],
    })
  ]);

  // Mix audio to video
  const mixAudioAndVideoResult = await Promise.all([
    // ja
    mixAudioAndVideo({
      videoPath: imageVideoResult[0].outputPath,
      audioPath: concatAudiosResult[0].outputPath,
    }),
    // en
    mixAudioAndVideo({
      videoPath: imageVideoResult[1].outputPath,
      audioPath: concatAudiosResult[1].outputPath,
    }),
    // review ja
    mixAudioAndVideo({
      videoPath: imageVideoResult[2].outputPath,
      audioPath: concatAudiosResult[0].outputPath,
    }),
    // review en
    mixAudioAndVideo({
      videoPath: imageVideoResult[3].outputPath,
      audioPath: concatAudiosResult[1].outputPath,
    }),
  ]);

  // Concat videos
  const concatVideosResult = await Promise.all([
    await concatVideos({
      // video
      videoPaths: [mixAudioAndVideoResult[0].outputPath, mixAudioAndVideoResult[1].outputPath],
    }),
    await concatVideos({
      // review video
      videoPaths: [mixAudioAndVideoResult[2].outputPath, mixAudioAndVideoResult[3].outputPath],
    }),
  ]);
  console.log(`created video ${index}!`);
  return {
    normalPath: concatVideosResult[0].outputPath,
    reviewPath: concatVideosResult[1].outputPath,
  };
}


async function run() {
  console.log('Start!');
  const operations = scripts.map(async (script, index) => {
    return createVideo(script, index);
  });
  const videoPaths = await Promise.all(operations)
  console.log({ videoPaths })
  const normalVideoPaths = videoPaths.map(({ normalPath }) => normalPath);
  const reviewVideoPaths = videoPaths.map(({ reviewPath }) => reviewPath);
  const sortedVideoPaths = normalVideoPaths.concat(reviewVideoPaths);
  console.log({ sortedVideoPaths })

  const result = await concatVideos({ videoPaths: sortedVideoPaths })
  console.log({ result });

  console.log('Done!');
}

run();

// For image rendering test
// testRenderImage();

// For generating scripts
// generateScripts();

// For audio test
// await Promise.all([
//   ttsJapanese({
//     text: script.ja,
//     output: `./out/speech-${index}-ja.mp3`,
//   }),
//   ttsEnglish({
//     text: script.en,
//     output: `./out/speech-${index}-en.mp3`,
//   })
// ])
