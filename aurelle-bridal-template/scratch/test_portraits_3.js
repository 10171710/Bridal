const fs = require('fs');
const https = require('https');
const path = require('path');

const ids = [
  'photo-1532712938310-34cb3982ef74',
  'photo-1519741347686-c1e0aadf4611',
  'photo-1596704017254-9b121068fb31',
  'photo-1588516903720-8ceb67f9ef84',
  'photo-1512496015851-a90fb38ba796',
  'photo-1607190074257-dd4b7af0309f',
  'photo-1522337360788-8b13dee7a37e',
  'photo-1563245372-f21724e3856d',
  'photo-1529636798458-92182e662485',
  'photo-1590086782957-93e06ef21604',
  'photo-1534528741775-53994a69daeb',
  'photo-1524504388940-b1c1722653e1',
  'photo-1509967419530-da38b4704bc6'
];

const tempDir = path.resolve('scratch/test_portraits_3');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

function download(id) {
  return new Promise(resolve => {
    const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=85`;
    const dest = path.join(tempDir, `${id}.jpg`);
    https.get(url, res => {
      if (res.statusCode === 200) {
        const s = fs.createWriteStream(dest);
        res.pipe(s);
        s.on('finish', () => {
          s.close();
          resolve({ id, status: 200, size: fs.statSync(dest).size });
        });
      } else {
        resolve({ id, status: res.statusCode });
      }
    }).on('error', () => resolve({ id, status: 500 }));
  });
}

(async () => {
  for (const id of ids) {
    const r = await download(id);
    console.log(`${id}: status ${r.status}`);
  }
})();
