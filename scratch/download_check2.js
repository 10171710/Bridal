const fs = require('fs');
const https = require('https');

const list = [
  'photo-1516975080664-ed2fc6a32937',
  'photo-1522337660859-02fbefca4702',
  'photo-1560066984-138dadb4c035',
  'photo-1560750588-73207b1ef5b8',
  'photo-1594744803329-e58b31de8bf5'
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
  for (const id of list) {
    const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=85`;
    const dest = `C:/Users/HP/.gemini/antigravity-ide/brain/3a83a3aa-c80c-46c9-b73d-980d148d053b/check2_${id}.jpg`;
    await new Promise((resolve) => {
      download(url, dest, (err) => {
        if (!err) console.log('Downloaded', id);
        resolve();
      });
    });
  }
}

run();
