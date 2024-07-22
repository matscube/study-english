import { concatVideos, createVideoFromImage, mixAudioAndVideo } from "./video";
import { concatAudios } from "./audio";
import { createImage } from "./image";
import { Manuscript } from "./types";

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

console.log('Start!');

scripts.forEach(async (script, index) => {
  await createImage({
    script,
    japaneseImagePath: `./out/image-${index}-ja.png`,
    englishImagePath: `./out/image-${index}-en.png`,
  });
});
// createVideoFromImage();
// concatAudios();
// mixAudioAndVideo();
// concatVideos();

console.log('Done!');

