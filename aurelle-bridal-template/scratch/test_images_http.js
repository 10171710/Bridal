const fs = require('fs');
const https = require('https');
const path = require('path');

const projectDir = path.resolve(__dirname, '..');
const htmlFiles = fs.readdirSync(projectDir).filter(f => f.endsWith('.html'));

const urls = new Set();

htmlFiles.forEach(file => {
  const content = fs.readFileSync(path.join(projectDir, file), 'utf8');
  const imgRegex = /https:\/\/images\.unsplash\.com\/photo-[^"'\s)]+/g;
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    urls.add(match[0]);
  }
});

// Also check article-data.js
const articleData = fs.readFileSync(path.join(projectDir, 'assets/js/article-data.js'), 'utf8');
const articleImgRegex = /https:\/\/images\.unsplash\.com\/photo-[^"'\s)]+/g;
let aMatch;
while ((aMatch = articleImgRegex.exec(articleData)) !== null) {
  urls.add(aMatch[0]);
}

console.log(`Checking ${urls.size} unique Unsplash URLs across the site...`);

let pending = urls.size;
let successCount = 0;
let failCount = 0;

Array.from(urls).forEach(url => {
  const req = https.request(url, { method: 'HEAD' }, (res) => {
    if (res.statusCode >= 200 && res.statusCode < 400) {
      successCount++;
    } else {
      console.error(`FAILED: ${url} -> Status ${res.statusCode}`);
      failCount++;
    }
    pending--;
    if (pending === 0) {
      console.log(`\nURL Verification Complete: ${successCount} OK, ${failCount} Failed.`);
    }
  });

  req.on('error', (err) => {
    console.error(`ERROR fetching ${url}:`, err.message);
    failCount++;
    pending--;
    if (pending === 0) {
      console.log(`\nURL Verification Complete: ${successCount} OK, ${failCount} Failed.`);
    }
  });

  req.end();
});
