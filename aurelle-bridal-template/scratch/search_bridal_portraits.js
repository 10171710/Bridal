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

function searchUnsplash(query) {
  return new Promise((resolve) => {
    const url = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=20&orientation=portrait`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const results = (json.results || []).map(r => {
            const m = r.urls.raw.match(/photo-[a-zA-Z0-9-]+/);
            return {
              id: m ? m[0] : null,
              desc: r.alt_description || r.description || '',
              url: r.urls.regular
            };
          }).filter(x => x.id);
          resolve(results);
        } catch (e) {
          resolve([]);
        }
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
  const queries = [
    'indian bride',
    'bridal makeup portrait',
    'bride veil portrait',
    'wedding hair bride'
  ];
  
  let allResults = [];
  for (const q of queries) {
    const res = await searchUnsplash(q);
    allResults = allResults.concat(res);
  }
  
  // Deduplicate and filter out used
  const map = new Map();
  for (const item of allResults) {
    if (!usedIds.has(item.id) && !map.has(item.id)) {
      map.set(item.id, item);
    }
  }
  
  console.log(`Found ${map.size} unique unused portrait candidates.`);
  
  let index = 0;
  for (const [id, item] of map.entries()) {
    if (index >= 12) break; // Download first 12 to preview
    const dest = `C:/Users/HP/.gemini/antigravity-ide/brain/3a83a3aa-c80c-46c9-b73d-980d148d053b/bridal_cand_${index}_${id}.jpg`;
    await new Promise((resolve) => {
      const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=85`;
      download(url, dest, (err) => {
        if (!err) {
          console.log(`[${index}] Downloaded ${id}: ${item.desc}`);
          index++;
        }
        resolve();
      });
    });
  }
}

main();
