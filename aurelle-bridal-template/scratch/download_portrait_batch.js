const fs = require('fs');
const https = require('https');

const ids = [
  'photo-1534528741775-53994a69daeb',
  'photo-1517841905240-472988babdf9',
  'photo-1524504388940-b1c1722653e1',
  'photo-1531746020798-e6953c6e8e04',
  'photo-1541257710737-06d667133a53',
  'photo-1529626455594-4ff0802cfb7e',
  'photo-1594744803329-e58b31de8bf5',
  'photo-1560750588-73207b1ef5b8'
];

function download(url, dest, callback) {
  https.get(url, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      return download(res.headers.location, dest, callback);
    }
    if (res.statusCode !== 200) return callback(new Error(`Status ${res.statusCode}`));
    const file = fs.createWriteStream(dest);
    res.pipe(file);
    file.on('finish', () => file.close(callback));
  }).on('error', callback);
}

async function run() {
  for (const id of ids) {
    const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=85`;
    const dest = `C:/Users/HP/.gemini/antigravity-ide/brain/3a83a3aa-c80c-46c9-b73d-980d148d053b/cand_portrait_${id}.jpg`;
    await new Promise((resolve) => {
      download(url, dest, (err) => {
        if (!err) console.log('Saved', id);
        resolve();
      });
    });
  }
}

run();
