import fs from "fs";
import path from "path";
import OpenAI from "openai";
import 'dotenv/config'

console.log(process.env.OPENAI_API_KEY);

const openai = new OpenAI();

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0]);
}

main();

// const openai = new OpenAI();

// const speechFile = path.resolve("./speech.mp3");

// async function main() {
//   const mp3 = await openai.audio.speech.create({
//     model: "tts-1",
//     voice: "alloy",
//     input: "Today is a wonderful day to build something people love!",
//   });
//   console.log(speechFile);
//   const buffer = Buffer.from(await mp3.arrayBuffer());
//   await fs.promises.writeFile(speechFile, buffer);
// }
// main();
