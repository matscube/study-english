const puppeteer = require('puppeteer');

const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

const convertToDataURL = async (filePath: string) => {
  const img = await loadImage(filePath);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  // const dataURL = canvas.toDataURL('image/png');
  const dataURL = canvas.toDataURL('image/jpeg');
  return dataURL;
};

// (async () => {
//   const dataURL = await convertToDataURL('data/29028444_m.jpg');
//   console.log(dataURL);
// })();

const renderComponentToImage = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const dataURL = await convertToDataURL('data/29028444_m.jpg')

  const japaneseText = '本日の会議の議題をメールにて添付しました。';
  // const englishText = 'I have attached the agenda for today’s meeting in this e-mail.';
  const englishText = '';

  const content = `
  <html>
  <head>
    <style>
      body {
        margin: 0;
        height: 100%;
        width: 100%;
        // display: flex;
        // justify-content: center;
        // align-items: center;
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
      // h1 {
      //   font-family: Arial, sans-serif;
      //   color: #333;
      // }
      p {
        font-size: 30px;
        font-family: Arial, sans-serif;
        // color: #666;
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

const outputImagePath = 'out/html-image.png'
export async function createImage() {
  renderComponentToImage().then((imageBuffer) => {
    const fs = require('fs');
    fs.writeFileSync(outputImagePath, imageBuffer);
    console.log('Image saved!');
  });
}
