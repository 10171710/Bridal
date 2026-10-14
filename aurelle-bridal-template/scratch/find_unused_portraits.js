const fs = require('fs');
const https = require('https');
const path = require('path');

// 1. All used IDs in the workspace
const allFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const usedIds = new Set();
allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const matches = content.match(/photo-[a-zA-Z0-9-]+/g) || [];
  matches.forEach(id => usedIds.add(id));
});

// Curated list of high quality bridal portrait photography IDs from Unsplash
const candidates = [
  'photo-1519741497674-611481863552', // wedding veil & lace
  'photo-1606800052052-a08af7148866', // beautiful Indian bride portrait
  'photo-1616683693504-3ea7e9ad6fec', // bride close up makeup
  'photo-1597157639073-69284dc0fdaf', // Indian bride in reception attire
  'photo-1607190074257-dd4b7af0309f', // bridal portrait with jewelry
  'photo-1583939003579-730e3918a45a', // smiling bride
  'photo-1515934751635-c81c6bc9a2d8', // bride in veil
  'photo-1507652313519-d4e9174996dd', // bride hair
  'photo-1534528741775-53994a69daeb', // beauty close up
  'photo-1524504388940-b1c1722653e1', // beauty portrait
  'photo-1517841905240-472988babdf9', // radiant bride portrait
  'photo-1529626455594-4ff0802cfb7e', // bridal makeup
  'photo-1534447677768-be436bb09401', // bridal styling
  'photo-1506794778202-cad84cf45f1d', // portrait
  'photo-1509967419530-da38b4704bc6', // bridal glam
  'photo-1610030469668-93510cb077fa', // bridal makeup
  'photo-1609357605129-26f69add5d6e', // bride
  'photo-1579783902614-a3fb3927b675', // bride
  'photo-1576828831022-ae4189f5097b', // bridal makeup
  'photo-1599447421416-3414500d18a5', // bridal look
  'photo-1526045612212-70caf35c14df', // beauty portrait
  'photo-1508214751196-bcfd4ca60f91', // radiant smile
  'photo-1549416878-b9ca95e26903', // bride in lehenga
  'photo-1596704017254-9b121068fb31', // makeup
  'photo-1616763355603-9755a640a287', // bride
  'photo-1587300003388-59208cc962cb', // used in test
  'photo-1566737236500-c8ac43014a67'
];

const tempDir = path.resolve('scratch/test_portraits');
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
          resolve({ id, status: 200, size: fs.statSync(dest).size, isUsed: usedIds.has(id) });
        });
      } else {
        resolve({ id, status: res.statusCode, isUsed: usedIds.has(id) });
      }
    }).on('error', () => resolve({ id, status: 500, isUsed: usedIds.has(id) }));
  });
}

(async () => {
  for (const id of candidates) {
    const r = await download(id);
    if (r.status === 200 && !r.isUsed) {
      console.log(`✓ UNUSED & VALID: ${r.id} (${(r.size/1024).toFixed(1)} KB)`);
    } else {
      console.log(`✗ Skipped: ${r.id} (status: ${r.status}, used: ${r.isUsed})`);
    }
  }
})();
