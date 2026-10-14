const fs = require('fs');
const https = require('https');

const list = [
  'photo-1601055283742-8b27e81b5553',
  'photo-1609357605129-26f69add5d6e',
  'photo-1546804784-896d0dca3805',
  'photo-1529636798458-92182e662485'
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

async function run() {
  for (const id of list) {
    const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=85`;
    const dest = `C:/Users/HP/.gemini/antigravity-ide/brain/3a83a3aa-c80c-46c9-b73d-980d148d053b/check_${id}.jpg`;
    await new Promise((resolve) => {
      download(url, dest, (err) => {
        if (!err) console.log('Downloaded', id);
        resolve();
      });
    });
  }
}

run();
