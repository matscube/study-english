import fs from 'fs';
import { Manuscript } from "./types";
import puppeteer from 'puppeteer';
import { createCanvas, loadImage } from 'canvas';

// const backgroundImagePath = 'src/assets/images/29028444_m.jpg';
const backgroundImagePath = 'src/assets/images/white_00029.jpg';

export async function createImage(props: {
  index: number
  script: Manuscript
  japaneseImagePath: string
  englishImagePath: string
  japaneseReviewImagePath: string
  englishReviewImagePath: string
}): Promise<boolean> {
  const results = await Promise.all([
    // ja
    new Promise<boolean>(async (resolve, _reject) => {
      // index: 0, 1, 2... / no: 1, 2, 3...
      const buffer = await renderComponentToImage({ no: props.index + 1, script: props.script, mode: 'ja' })
      fs.writeFileSync(props.japaneseImagePath, buffer);
      resolve(true);
    }),
    // en
    new Promise<boolean>(async (resolve, _reject) => {
      const buffer = await renderComponentToImage({ no: props.index + 1, script: props.script, mode: 'en' })
      fs.writeFileSync(props.englishImagePath, buffer);
      resolve(true);
    }),
    // ja review
    new Promise<boolean>(async (resolve, _reject) => {
      const buffer = await renderComponentToImage({ no: props.index + 1, isReviewing: true, script: props.script, mode: 'ja' })
      fs.writeFileSync(props.japaneseReviewImagePath, buffer);
      resolve(true);
    }),
    // en review
    new Promise<boolean>(async (resolve, _reject) => {
      const buffer = await renderComponentToImage({ no: props.index + 1, isReviewing: true, script: props.script, mode: 'en' })
      fs.writeFileSync(props.englishReviewImagePath, buffer);
      resolve(true);
    }),
  ]);
  return results.reduce((acc, cur) => acc && cur, true);
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

export async function testRenderImage() {
  const imageBuffer = await renderComponentToImage({
    no: 21,
    isReviewing: true,
    script: {
      ja: "会議についていけず、議事録がとれませんでした。",
      en: "I couldn’t keep up with the meeting and couldn’t take the minutes.",
    },
    mode: 'en',
  });
  fs.writeFileSync('out/test.png', imageBuffer);
}

async function renderComponentToImage(props: {
  no?: number
  isReviewing?: boolean
  script: Manuscript
  mode: 'ja' | 'en'
}) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const dataURL = await convertToDataURL(backgroundImagePath, 'jpeg')

  const japaneseText = props.script.ja;
  const englishText = props.script.en;
  const englishTextModifierClass = props.mode === 'ja' ? 'script-en--transparent' : '';

  const indexDisplay = props.no ? `#${props.no}` : '';
  const reviewDisplay = props.isReviewing ? `Review` : '';

  const content = `
  <html>
  <head>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c&family=Noto+Sans+JP:wght@100..900&display=swap" rel="stylesheet">
    <style>
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
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
        padding-left: 240px;
        padding-right: 240px;
        background: rgba(255, 255, 255, 0.3);

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        row-gap: 80px;

        position: relative;
      }
      .script-ja {
        color: #1a1afb;
        // font-family: 'Noto Sans JP', sans-serif;
        font-family: "M PLUS Rounded 1c", sans-serif;
        font-size: 48px;
        font-weight: 400;
        text-align: center;
      }
      .script-en {
        color: #0f1419;
        font-family: "M PLUS Rounded 1c", sans-serif;
        font-size: 64px;
        font-weight: 700;
        text-align: center;
      }
      .script-en--transparent {
        color: transparent!important;
      }
      .script-caption {
        position: absolute;
        left: 32px;
        top: 32px;
        // color: #1a1afb;
        color: #0f1419;
        font-size: 48px;
        font-family: "M PLUS Rounded 1c", sans-serif;
        font-weight: bold;

        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
      .script-caption-index {

      }
      .script-caption-review {
        color: #F711FA;
      }
    </style>
  </head>
  <body>
    <div class="content">
      <div class="script-caption">
        <span class="script-caption-index">${indexDisplay}</span>
        <span class="script-caption-review">&nbsp;${reviewDisplay}</span>
      </div>
      <p class="script-ja">${japaneseText}</p>
      <p class="script-en ${englishTextModifierClass}">${englishText}</p>
    </div>
  </body>
</html>
  `;

  await page.setContent(content, {
    waitUntil: ['networkidle0', 'load', 'domcontentloaded']
  });
  await page.setViewport({ width: 1600, height: 900 }); // Youtube aspect-ratio: 16 / 9
  await page.evaluateHandle('document.fonts.ready');

  const imageBuffer = await page.screenshot({ type: 'png', fullPage: true });

  await browser.close();

  return imageBuffer;
};
