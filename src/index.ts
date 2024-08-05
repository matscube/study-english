import { concatVideos, createVideoFromImage, mixAudioAndVideo } from "./video";
import { concatAudios } from "./audio";
import { createImage, testRenderImage } from "./image";
import { Manuscript } from "./types";
import { ttsEnglish, ttsJapanese } from "./tts";
import { scripts } from "./assets/scripts";
import { generateScripts } from "./script";

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
  await createImage({
    index,
    script,
    japaneseImagePath: `./out/image-${index}-ja.png`,
    englishImagePath: `./out/image-${index}-en.png`,
    japaneseReviewImagePath: `./out/image-${index}-ja-review.png`,
    englishReviewImagePath: `./out/image-${index}-en-review.png`,
  }),
  await Promise.all([
    createVideoFromImage({
      imagePath: `./out/image-${index}-ja.png`,
      outputPath: `./out/image-${index}-ja.mp4`,
    }),
    createVideoFromImage({
      imagePath: `./out/image-${index}-en.png`,
      outputPath: `./out/image-${index}-en.mp4`,
    }),
    createVideoFromImage({
      imagePath: `./out/image-${index}-ja-review.png`,
      outputPath: `./out/image-${index}-ja-review.mp4`,
    }),
    createVideoFromImage({
      imagePath: `./out/image-${index}-en-review.png`,
      outputPath: `./out/image-${index}-en-review.mp4`,
    }),
  ]);

  // Audio
  await Promise.all([
    ttsJapanese({
      text: script.ja,
      output: `./out/speech-${index}-ja.mp3`,
    }),
    ttsEnglish({
      text: script.en,
      output: `./out/speech-${index}-en.mp3`,
    })
  ])
  await Promise.all([
    concatAudios({
      audioPaths: [
        `./out/speech-${index}-ja.mp3`,
        `src/assets/audios/silence_5_seconds.mp3`,
      ],
      outputPath: `./out/speech-${index}-ja-with-silence.mp3`,
    }),
    concatAudios({
      audioPaths: [
        `./out/speech-${index}-en.mp3`,
        `src/assets/audios/silence_5_seconds.mp3`,
      ],
      outputPath: `./out/speech-${index}-en-with-silence.mp3`,
    })
  ]);

  // Mix audio to video
  await Promise.all([
    mixAudioAndVideo({
      videoPath: `./out/image-${index}-ja.mp4`,
      audioPath: `./out/speech-${index}-ja-with-silence.mp3`,
      outputPath: `./out/output-${index}-ja.mp4`,
    }),
    mixAudioAndVideo({
      videoPath: `./out/image-${index}-en.mp4`,
      audioPath: `./out/speech-${index}-en-with-silence.mp3`,
      outputPath: `./out/output-${index}-en.mp4`,
    }),
    mixAudioAndVideo({
      videoPath: `./out/image-${index}-ja-review.mp4`,
      audioPath: `./out/speech-${index}-ja-with-silence.mp3`,
      outputPath: `./out/output-${index}-ja-review.mp4`,
    }),
    mixAudioAndVideo({
      videoPath: `./out/image-${index}-en-review.mp4`,
      audioPath: `./out/speech-${index}-en-with-silence.mp3`,
      outputPath: `./out/output-${index}-en-review.mp4`,
    }),
  ]);

  // Concat videos
  await Promise.all([
    await concatVideos({
      // repeat the English video twice
      // videoPaths: [`./out/output-${index}-ja.mp4`, `./out/output-${index}-en.mp4`, `./out/output-${index}-en.mp4`],
      videoPaths: [`./out/output-${index}-ja.mp4`, `./out/output-${index}-en.mp4`],
      outputPath: `./out/output-${index}.mp4`,
    }),
    await concatVideos({
      // repeat the English video twice
      // videoPaths: [`./out/output-${index}-ja-review.mp4`, `./out/output-${index}-en-review.mp4`, `./out/output-${index}-en-review.mp4`],
      videoPaths: [`./out/output-${index}-ja-review.mp4`, `./out/output-${index}-en-review.mp4`],
      outputPath: `./out/output-${index}-review.mp4`,
    }),
  ]);
  console.log(`created video ${index}!`);
  return {
    normalPath: `./out/output-${index}.mp4`,
    reviewPath: `./out/output-${index}-review.mp4`,
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

  await concatVideos({ videoPaths: sortedVideoPaths, outputPath: `out/output.mp4`})

  console.log('Done!');
}

// run();

// For image rendering test
// testRenderImage();

// For generating scripts
// generateScripts();
