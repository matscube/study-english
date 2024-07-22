import fs from 'fs';
import { Manuscript } from "./types";
import puppeteer from 'puppeteer';
import { createCanvas, loadImage } from 'canvas';

const backgroundImagePath = 'data/29028444_m.jpg';

export async function createImage(props: {
  script: Manuscript
  japaneseImagePath: string
  englishImagePath: string
}) {
  // First
  const firstImageBuffer = await renderComponentToImage({ script: props.script, mode: 'ja' })
  fs.writeFileSync(props.japaneseImagePath, firstImageBuffer);

  // Second
  const secondImageBuffer = await renderComponentToImage({ script: props.script, mode: 'en' })
  fs.writeFileSync(props.englishImagePath, secondImageBuffer);
}

async function convertToDataURL(filePath: string, type: 'jpeg' | 'png') {
  const img = await loadImage(filePath);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  switch (type) {
    case 'jpeg':
      return canvas.toDataURL('image/jpeg');
    case 'png':
      return canvas.toDataURL('image/png');
  }
};

async function renderComponentToImage(props: {
  script: Manuscript
  mode: 'ja' | 'en'
}) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const dataURL = await convertToDataURL(backgroundImagePath, 'jpeg')

  const japaneseText = props.script.ja;
  const englishText = props.mode === 'en' ? props.script.en : '';

  const content = `
  <html>
  <head>
    <style>
      body {
        margin: 0;
        height: 100%;
        width: 100%;
        background: url('${dataURL}') no-repeat center center;
        background-size: cover;
      }
      .content {
        height: 100%;
        width 100%;
        padding: 100px;
        border: 1px solid black;
        background: rgba(255, 255, 255, 0.5);
        display: flex;
        flex-direction: column;
        align-items: center;
        row-gap: 100px;
      }
      p {
        font-size: 30px;
        font-family: Arial, sans-serif;
        color: black;
      }
    </style>
  </head>
  <body>
    <div class="content">
      <p>${japaneseText}</p>
      <p>${englishText}</p>
    </div>
  </body>
</html>
  `;

  await page.setContent(content);
  await page.setViewport({ width: 800, height: 600 });

  const imageBuffer = await page.screenshot({ type: 'png' });

  await browser.close();

  return imageBuffer;
};
