import fs from "fs";
import OpenAI from "openai";
import "dotenv/config";
import { Manuscript } from "./types";

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

async function runTts(scripts: Manuscript[]) {
  scripts.forEach(async (script, index) => {
    const outputJapanese = `./out/speech-jp-${index}.mp3`;
    const outputEnglish = `./out/speech-en-${index}.mp3`;
    await ttsJapanese(script.ja, outputJapanese);
    await ttsEnglish(script.en, outputEnglish);
  });
}
