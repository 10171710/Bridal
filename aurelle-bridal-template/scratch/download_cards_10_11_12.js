const fs = require('fs');
const https = require('https');
const path = require('path');

const downloads = [
  {
    name: 'portfolio-look-10.png',
    url: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1200&q=85',
    target: path.join(__dirname, '../assets/images/portfolio/portfolio-look-10.png'),
    artifact: 'C:/Users/HP/.gemini/antigravity-ide/brain/3a83a3aa-c80c-46c9-b73d-980d148d053b/portfolio_look_10_test.jpg'
  },
  {
    name: 'portfolio-look-11.png',
    url: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=1200&q=85',
    target: path.join(__dirname, '../assets/images/portfolio/portfolio-look-11.png'),
    artifact: 'C:/Users/HP/.gemini/antigravity-ide/brain/3a83a3aa-c80c-46c9-b73d-980d148d053b/portfolio_look_11_test.jpg'
  },
  {
    name: 'portfolio-look-12.png',
    url: 'https://images.unsplash.com/photo-1549416878-b9ca95e26903?auto=format&fit=crop&w=1200&q=85',
    target: path.join(__dirname, '../assets/images/portfolio/portfolio-look-12.png'),
    artifact: 'C:/Users/HP/.gemini/antigravity-ide/brain/3a83a3aa-c80c-46c9-b73d-980d148d053b/portfolio_look_12_test.jpg'
  }
];

function download(url, dest, callback) {
  https.get(url, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      return download(res.headers.location, dest, callback);
    }
    if (res.statusCode !== 200) {
      return callback(new Error(`Failed to download: status ${res.statusCode}`));
    }
    const file = fs.createWriteStream(dest);
    res.pipe(file);
    file.on('finish', () => {
      file.close(callback);
    });
  }).on('error', callback);
}

async function run() {
  for (const item of downloads) {
    await new Promise((resolve, reject) => {
      download(item.url, item.target, (err) => {
        if (err) {
          console.error(`Error downloading ${item.name}:`, err);
          return reject(err);
        }
        // Also copy to artifact dir so we can preview it
        fs.copyFileSync(item.target, item.artifact);
        const stats = fs.statSync(item.target);
        console.log(`Saved ${item.name}: ${(stats.size / 1024).toFixed(1)} KB`);
        resolve();
      });
    });
  }
  console.log('Done downloading 10, 11, 12!');
}

run();
