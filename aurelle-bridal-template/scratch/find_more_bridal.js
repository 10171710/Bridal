const fs = require('fs');
const https = require('https');
const path = require('path');

// Extract all used photos across HTML files
const htmlFiles = fs.readdirSync(path.join(__dirname, '..')).filter(f => f.endsWith('.html'));
const usedIds = new Set();
for (const file of htmlFiles) {
  const content = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  const matches = content.match(/photo-[a-zA-Z0-9-]+/g) || [];
  matches.forEach(m => usedIds.add(m));
}

console.log('Blacklisted IDs count:', usedIds.size);

// Potential bridal photoshoot IDs
const candidateIds = [
  'photo-1617627143750-d86bc21e42bb', // Indian bride pink/gold saree, royal jewelry
  'photo-1549416878-b9ca95e26903', // Bride with cathedral veil on staircase
  'photo-1595777457583-95e059d581b8', // Bride in lace gown
  'photo-1519741347686-c1e0aadf4611', // Wedding couple
  'photo-1532712938310-34cb3982ef74', // Bride portrait
  'photo-1522673607200-164d1b6ce486', // Bride with flowers
  'photo-1519225429177-3e1503c51ffc',
  'photo-1606800052052-a08af7148866',
  'photo-1511285560929-80b456fea0bc',
  'photo-1529626455594-4ff0802cfb7e', // Beauty portrait
  'photo-1509967419530-da38b4704bc6', // HD makeup
  'photo-1534447677768-be436bb09401',
  'photo-1594744803329-e58b31de8bf5',
  'photo-1515934751635-c81c6bc9a2d8', // Bride
  'photo-1588516903720-8ceb67f9ef84',
  'photo-1605497788044-5a32c7078486',
  'photo-1541257710737-06d667133a53',
  'photo-1531746020798-e6953c6e8e04',
  'photo-1506794778202-cad84cf45f1d',
  'photo-1596704017254-9b121068fb31'
];

function download(url, dest, callback) {
  https.get(url, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      return download(res.headers.location, dest, callback);
    }
    if (res.statusCode !== 200) {
      return callback(new Error(`Status ${res.statusCode}`));
    }
    const file = fs.createWriteStream(dest);
    res.pipe(file);
    file.on('finish', () => file.close(callback));
  }).on('error', callback);
}

async function testAll() {
  for (const id of candidateIds) {
    if (usedIds.has(id)) {
      console.log(`[USED] ${id} - skipping`);
      continue;
    }
    const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=85`;
    const dest = `C:/Users/HP/.gemini/antigravity-ide/brain/3a83a3aa-c80c-46c9-b73d-980d148d053b/cand2_${id}.jpg`;
    await new Promise((resolve) => {
      download(url, dest, (err) => {
        if (err) {
          console.log(`[404/ERR] ${id}`);
        } else {
          const stats = fs.statSync(dest);
          console.log(`[VALID UNUSED] ${id} (${(stats.size / 1024).toFixed(1)} KB)`);
        }
        resolve();
      });
    });
  }
}

testAll();
