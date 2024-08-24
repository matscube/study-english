import fs from "fs";
import OpenAI from "openai";
import "dotenv/config";
import { Manuscript } from "./types";
import { AppConfig } from "./config";
import { generateSecureRandomHash } from "./util";
import path from "path";

const openai = new OpenAI();

export async function ttsJapanese(props: { text: string }): Promise<{
  outputPath: string;
}> {
  const outputPath = path.join(AppConfig.tmpDir, `speech-ja-${generateSecureRandomHash()}.mp3`);
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "fable",
    input: props.text,
  });
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(outputPath, buffer);
  return {
    outputPath,
  };
}
export async function ttsEnglish(props: { text: string }): Promise<{ outputPath: string; }> {
  const outputPath = path.join(AppConfig.tmpDir, `speech-en-${generateSecureRandomHash()}.mp3`);
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: props.text,
  });
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(outputPath, buffer);
  return {
    outputPath,
  };
}
