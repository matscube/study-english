import fs from "fs";
import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI();

async function ttsJapanese(text: string, output: string) {
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "fable",
    input: text,
  });
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(output, buffer);
}
async function ttsEnglish(text: string, output: string) {
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: text,
  });
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(output, buffer);
}
const texts: { ja: string; en: string }[] = [
  {
    ja: "会議室を押さえておいてくれますか？",
    en: "Could you reserve a meeting room?",
  },
  {
    ja: "本日の会議の議題をメールにて添付しましたので、事前にご確認下さいませ。",
    en: "I have attached the agenda for today’s meeting in this e-mail. Please have a look at it in advance.",
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
async function runTts() {
  texts.forEach(async (text, index) => {
    const outputJapanese = `./out/speech-jp-${index}.mp3`;
    const outputEnglish = `./out/speech-en-${index}.mp3`;
    await ttsJapanese(text.ja, outputJapanese);
    await ttsEnglish(text.en, outputEnglish);
  });
}
