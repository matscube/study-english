import { concatVideos, createVideoFromImage, mixAudioAndVideo } from "./video";
import { concatAudios } from "./audio";
import { createImage } from "./image";
import { Manuscript } from "./types";
import { ttsEnglish, ttsJapanese } from "./tts";

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

const scripts: Manuscript[] = [
  {
    ja: "会議室を押さえておいてくれますか？",
    en: "Could you reserve a meeting room?",
  },
  {
    ja: "本日の会議の議題をメールにて添付しました。",
    en: "I have attached the agenda for today’s meeting in this e-mail.",
  },
  {
    ja: "事前にご確認下さいませ。",
    en: "Please have a look at it in advance.",
  },
  {
    ja: "会議についていけず、議事録がとれませんでした。",
    en: "I couldn’t keep up with the meeting and couldn’t take the minutes.",
  },
  {
    ja: "電話会議をさせていただけますか？",
    en: "Would it be possible for us to have a teleconference?",
  },
];

async function createVideo(script: Manuscript, index: number): Promise<string> {
  console.log(`creating video ${index}... (script: ${script.ja}/${script.en})`);

  // Silent video
  await createImage({
    script,
    japaneseImagePath: `./out/image-${index}-ja.png`,
    englishImagePath: `./out/image-${index}-en.png`,
  }),
  await Promise.all([
    createVideoFromImage({
      imagePath: `./out/image-${index}-ja.png`,
      outputPath: `./out/image-${index}-ja.mp4`,
    }),
    createVideoFromImage({
      imagePath: `./out/image-${index}-en.png`,
      outputPath: `./out/image-${index}-en.mp4`,
    })
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
        `data/silence_5_seconds.mp3`,
      ],
      outputPath: `./out/speech-${index}-ja-with-silence.mp3`,
    }),
    concatAudios({
      audioPaths: [
        `./out/speech-${index}-en.mp3`,
        `data/silence_5_seconds.mp3`,
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
    })
  ]);

  // Concat videos
  await concatVideos({
    videoPaths: [`./out/output-${index}-ja.mp4`, `./out/output-${index}-en.mp4`, `./out/output-${index}-en.mp4`],
    outputPath: `./out/output-${index}.mp4`,
  });
  console.log(`created video ${index}!`);
  return `./out/output-${index}.mp4`;
}


async function run() {
  console.log('Start!');
  const operations = scripts.map(async (script, index) => {
    return createVideo(script, index);
  });
  const videoPaths = await Promise.all(operations)
  console.log({ videoPaths })

  await concatVideos({ videoPaths, outputPath: `out/output.mp4`})

  console.log('Done!');
}

run();
