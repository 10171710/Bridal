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

// Curated list of known wedding & bridal photography on Unsplash
const candidates = [
  // Indian / South Asian brides & reception glam
  'photo-1617627143750-d86bc21e42bb', // Indian bride pink/gold saree, royal jewellery
  'photo-1610030469983-98e550d6193c', // Indian woman in purple silk saree
  'photo-1601055283742-8b27e81b5553', // Indian bride red lehenga
  'photo-1595777457583-95e059d581b8', // Bride in lace gown
  'photo-1583939003579-730e3918a45a', // Bride
  'photo-1609357605129-26f69add5d6e', // Bride portrait
  'photo-1596704017254-9b121068fb31', // Makeup palette
  'photo-1520854221256-17451cc331bf',
  'photo-1529636798458-92182e662485', // Bride smiling
  'photo-1537633552985-df8429e8048b',
  'photo-1519741497674-611481863552',
  'photo-1546804784-896d0dca3805', // Bride veil
  'photo-1563245372-f21724e3856d', // Makeup
  'photo-1524504388940-b1c1722653e1', // Model beauty
  'photo-1534528741775-53994a69daeb', // Beauty portrait
  'photo-1517841905240-472988babdf9', // Model
  'photo-1544005313-94ddf0286df2',
  'photo-1515886657613-9f3515b0c78f',
  'photo-1549416878-b9ca95e26903', // Bride with cathedral veil on staircase
  'photo-1616683693504-3ea7e9ad6fec', // Flawless HD makeup face
  'photo-1519741347686-c1e0aadf4611',
  'photo-1591604466107-ec97de577aff', // Couple with flowers
  'photo-1607190074257-dd4b7af0309f', // Sunset couple
  'photo-1583939411023-14783179e581',
  'photo-1532712938310-34cb3982ef74',
  'photo-1588516903720-8ceb67f9ef84',
  'photo-1512496015851-a90fb38ba796', // Makeup brushes
  'photo-1487412720507-e7ab37603c6f',
  'photo-1508214751196-bcfd4ca60f91',
  'photo-1526045612212-70caf35c14df'
];

// Let's also fetch direct web pages from unsplash collections or source
function fetchUnsplashSearch(query) {
  return new Promise((resolve) => {
    const url = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=20`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const ids = (json.results || []).map(r => {
            const m = r.urls.raw.match(/photo-[a-zA-Z0-9-]+/);
            return m ? m[0] : null;
          }).filter(Boolean);
          resolve(ids);
        } catch (e) {
          resolve([]);
        }
      });
    }).on('error', () => resolve([]));
  });
}

async function run() {
  const q1 = await fetchUnsplashSearch('indian bride makeup');
  const q2 = await fetchUnsplashSearch('bridal makeup portrait');
  const q3 = await fetchUnsplashSearch('bride wedding veil');
  
  const allIds = [...new Set([...candidates, ...q1, ...q2, ...q3])];
  console.log(`Found ${allIds.length} candidate photo IDs.`);
  
  const validUnused = [];
  for (const id of allIds) {
    if (usedIds.has(id)) {
      continue;
    }
    // Check if 200
    await new Promise((resolve) => {
      const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=85`;
      https.get(url, (res) => {
        if (res.statusCode === 200 || (res.statusCode >= 300 && res.statusCode < 400)) {
          validUnused.push(id);
          console.log(`[VALID & UNUSED] ${id}`);
        }
        resolve();
      }).on('error', () => resolve());
    });
  }
  
  console.log(`Total Valid Unused: ${validUnused.length}`);
  fs.writeFileSync(path.join(__dirname, 'valid_unused_bridal.json'), JSON.stringify(validUnused, null, 2));
}

run();
