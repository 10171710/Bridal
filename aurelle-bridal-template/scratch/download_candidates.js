const fs = require('fs');
const https = require('https');
const path = require('path');

const candidates = [
  // Bridal Reception / Sangeet
  { key: 'look10_a', id: 'photo-1546804784-896d0dca3805' },
  { key: 'look10_b', id: 'photo-1563245372-f21724e3856d' },
  { key: 'look10_c', id: 'photo-1529636798458-92182e662485' },
  { key: 'look10_d', id: 'photo-1605497788044-5a32c7078486' },
  // Airbrush HD Bridal
  { key: 'look11_a', id: 'photo-1588516903720-8ceb67f9ef84' },
  { key: 'look11_b', id: 'photo-1596704017254-9b121068fb31' },
  { key: 'look11_c', id: 'photo-1512496015851-a90fb38ba796' },
  { key: 'look11_d', id: 'photo-1509967419530-da38b4704bc6' },
  // Hairstyling / Waves & Veil
  { key: 'look12_a', id: 'photo-1515934751635-c81c6bc9a2d8' },
  { key: 'look12_b', id: 'photo-1524504388940-b1c1722653e1' },
  { key: 'look12_c', id: 'photo-1507652313519-d4e9174996dd' },
  { key: 'look12_d', id: 'photo-1534447677768-be436bb09401' }
];

const tempDir = path.resolve('scratch/preview_candidates');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return resolve({ status: res.statusCode });
      }
      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close();
        resolve({ status: 200, size: fs.statSync(dest).size });
      });
    }).on('error', reject);
  });
}

(async () => {
  for (const c of candidates) {
    const dest = path.join(tempDir, `${c.key}.jpg`);
    const url = `https://images.unsplash.com/${c.id}?auto=format&fit=crop&w=1200&q=85`;
    const res = await download(url, dest);
    console.log(`${c.key} (${c.id}): ${res.status === 200 ? 'OK (' + (res.size / 1024).toFixed(1) + ' KB)' : 'FAIL ' + res.status}`);
  }
})();
