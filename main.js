const Jimp = require('jimp'); 
const fs = require('fs'); 
const path = require('path');
const process = require('process');

const bannerFolder = path.join(__dirname, 'banners');
const qrFolder = process.argv[2];

const outFolder = path.join(__dirname, '../output');

async function generateBanners() {

  const qrFiles = await getImageFiles(qrFolder);

  for(let i = 0; i < qrFiles.length; i++) {

    const bannerPath = path.join(bannerFolder, 'banner.jpg');
    const banner = await Jimp.read(bannerPath);

    const qrPath = path.join(qrFolder, qrFiles[i]);
    const qr = await Jimp.read(qrPath);

    centerQR(banner, 645, 165, qr, 450, 450);

    const outPath = path.join(outFolder, `banner-${i}.jpg`);
    banner.write(outPath);
  }

}

async function getImageFiles(folder) {
    return new Promise((resolve, reject) => {
      fs.readdir(folder, (err, files) => {
        if(err) reject(err);
        else {
          resolve(files.filter(name => name.endsWith('.jpg')));  
        }
      });
    });
  }

function centerQR(banner, left, top, qr, width, height) {
    qr.resize(width, height);
    banner.composite(qr, left, top);
}

generateBanners()
  .catch(err => console.error(err));