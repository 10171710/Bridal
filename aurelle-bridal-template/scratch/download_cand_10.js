const fs = require('fs');
const https = require('https');
const path = require('path');

const candidates = [
  'photo-1534528741775-53994a69daeb',
  'photo-1607190074257-dd4b7af0309f',
  'photo-1616763355603-9755a640a287',
  'photo-1610030469983-98e550d6193c',
  'photo-1560750588-73207b1ef5b8',
  'photo-1617627143750-d86bc21e42bb',
  'photo-1583939411023-14783179e581',
  'photo-1522673607200-164d1b6ce486',
  'photo-1591604466107-ec97de577aff'
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

async function testAll() {
  for (const id of candidates) {
    const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=85`;
    const dest = `C:/Users/HP/.gemini/antigravity-ide/brain/3a83a3aa-c80c-46c9-b73d-980d148d053b/cand_${id}.jpg`;
    await new Promise((resolve) => {
      download(url, dest, (err) => {
        if (err) {
          console.log(`Failed ${id}:`, err.message);
        } else {
          console.log(`Downloaded ${id}`);
        }
        resolve();
      });
    });
  }
}

testAll();
