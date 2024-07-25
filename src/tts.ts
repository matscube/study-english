import fs from "fs";
import OpenAI from "openai";
import "dotenv/config";
import { Manuscript } from "./types";

const openai = new OpenAI();

export async function ttsJapanese(props: { text: string, output: string }) {
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "fable",
    input: props.text,
  });
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(props.output, buffer);
}
export async function ttsEnglish(props: { text: string, output: string }) {
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: props.text,
  });
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(props.output, buffer);
}
