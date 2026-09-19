const fs = require('fs');
const https = require('https');
const path = require('path');

const brainDir = 'C:\\Users\\HP\\.gemini\\antigravity-ide\\brain\\3a83a3aa-c80c-46c9-b73d-980d148d053b';
const targetDir = path.resolve('assets/images/portfolio');

// Find generated files
const brainFiles = fs.readdirSync(brainDir);
const look5 = brainFiles.find(f => f.startsWith('portfolio_look_5'));
const look6 = brainFiles.find(f => f.startsWith('portfolio_look_6'));
const look7 = brainFiles.find(f => f.startsWith('portfolio_look_7'));
const look8 = brainFiles.find(f => f.startsWith('portfolio_look_8'));
const look9 = brainFiles.find(f => f.startsWith('portfolio_look_9'));

console.log('Found generated files:', { look5, look6, look7, look8, look9 });

if (look5) fs.copyFileSync(path.join(brainDir, look5), path.join(targetDir, 'portfolio-look-5.png'));
if (look6) fs.copyFileSync(path.join(brainDir, look6), path.join(targetDir, 'portfolio-look-6.png'));
if (look7) fs.copyFileSync(path.join(brainDir, look7), path.join(targetDir, 'portfolio-look-7.png'));
if (look8) fs.copyFileSync(path.join(brainDir, look8), path.join(targetDir, 'portfolio-look-8.png'));
if (look9) fs.copyFileSync(path.join(brainDir, look9), path.join(targetDir, 'portfolio-look-9.png'));

// Download looks 10, 11, 12 from high-res Unsplash sources
const downloads = [
  { id: 'photo-1587300003388-59208cc962cb', filename: 'portfolio-look-10.png' },
  { id: 'photo-1566737236500-c8ac43014a67', filename: 'portfolio-look-11.png' },
  { id: 'photo-1502823403499-6ccfcf4fb453', filename: 'portfolio-look-12.png' }
];

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error('Failed to download ' + url + ' status ' + res.statusCode));
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    }).on('error', reject);
  });
}

(async () => {
  for (const item of downloads) {
    const url = `https://images.unsplash.com/${item.id}?auto=format&fit=crop&w=1200&q=85`;
    const dest = path.join(targetDir, item.filename);
    console.log(`Downloading ${item.filename} from ${url}...`);
    await downloadImage(url, dest);
    console.log(`✓ Saved ${item.filename} (${fs.statSync(dest).size} bytes)`);
  }
  
  console.log('\nAll portfolio images 1 to 12 are now in assets/images/portfolio:');
  fs.readdirSync(targetDir).forEach(f => {
    const size = fs.statSync(path.join(targetDir, f)).size;
    console.log(`  ${f.padEnd(24)}: ${(size / 1024).toFixed(1)} KB`);
  });
})();
