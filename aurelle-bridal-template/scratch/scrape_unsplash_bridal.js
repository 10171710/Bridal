const https = require('https');
const fs = require('fs');
const path = require('path');

// Extract all used photos across HTML files
const htmlFiles = fs.readdirSync(path.join(__dirname, '..')).filter(f => f.endsWith('.html'));
const usedIds = new Set();
for (const file of htmlFiles) {
  const content = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  const matches = content.match(/photo-[a-zA-Z0-9-]+/g) || [];
  matches.forEach(m => usedIds.add(m));
}

function fetchPage(urlPath) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'unsplash.com',
      path: urlPath,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
    };
    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const matches = data.match(/photo-[a-zA-Z0-9-]+/g) || [];
        resolve(matches);
      });
    }).on('error', () => resolve([]));
  });
}

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

async function main() {
  const p1 = await fetchPage('/s/photos/indian-bridal-makeup');
  const p2 = await fetchPage('/s/photos/bride-veil');
  const p3 = await fetchPage('/s/photos/bridal-makeup-look');
  const p4 = await fetchPage('/s/photos/bride-portrait');

  const all = [...new Set([...p1, ...p2, ...p3, ...p4])];
  console.log(`Extracted ${all.length} raw photo IDs.`);

  const unused = all.filter(id => !usedIds.has(id));
  console.log(`Unused count: ${unused.length}`);

  let saved = 0;
  for (const id of unused) {
    if (saved >= 12) break;
    const dest = `C:/Users/HP/.gemini/antigravity-ide/brain/3a83a3aa-c80c-46c9-b73d-980d148d053b/bridal_scraped_${saved}_${id}.jpg`;
    await new Promise((resolve) => {
      const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=85`;
      download(url, dest, (err) => {
        if (!err) {
          console.log(`[${saved}] Saved ${id}`);
          saved++;
        }
        resolve();
      });
    });
  }
}

main();
