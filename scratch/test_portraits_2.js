const fs = require('fs');
const https = require('https');
const path = require('path');

const allFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const usedIds = new Set();
allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const matches = content.match(/photo-[a-zA-Z0-9-]+/g) || [];
  matches.forEach(id => usedIds.add(id));
});

// Targeted bridal & reception IDs
const candidates = [
  'photo-1595777457583-95e059d581b8',
  'photo-1519741497674-611481863552',
  'photo-1544005313-94ddf0286df2',
  'photo-1534528741775-53994a69daeb',
  'photo-1524504388940-b1c1722653e1',
  'photo-1517841905240-472988babdf9',
  'photo-1531746020798-e6953c6e8e04',
  'photo-1541257710737-06d667133a53',
  'photo-1509967419530-da38b4704bc6',
  'photo-1616683693504-3ea7e9ad6fec',
  'photo-1549416878-b9ca95e26903',
  'photo-1588516903720-8ceb67f9ef84',
  'photo-1605497788044-5a32c7078486',
  'photo-1607190074257-dd4b7af0309f',
  'photo-1583939003579-730e3918a45a',
  'photo-1515934751635-c81c6bc9a2d8',
  'photo-1616763355603-9755a640a287',
  'photo-1594744803329-e58b31de8bf5',
  'photo-1610030469983-98e550d6193c',
  'photo-1560750588-73207b1ef5b8',
  'photo-1617627143750-d86bc21e42bb',
  // New specific bridal search IDs
  'photo-1532712938310-34cb3982ef74', // bride in veil
  'photo-1519741347686-c1e0aadf4611', // bride portrait
  'photo-1583939411023-14783179e581', // bride smiling
  'photo-1596704017254-9b121068fb31',
  'photo-1520854221256-17451cc331bf',
  'photo-1606800052052-a08af7148866',
  'photo-1511285560929-80b456fea0bc',
  'photo-1585241645927-c7a8e5fce5c0',
  'photo-1522673607200-164d1b6ce486',
  'photo-1591604466107-ec97de577aff'  // bride and groom / bride
];

const tempDir = path.resolve('scratch/test_portraits_2');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

function checkAndDownload(id) {
  return new Promise(resolve => {
    const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=85`;
    const dest = path.join(tempDir, `${id}.jpg`);
    https.get(url, res => {
      if (res.statusCode === 200) {
        const stream = fs.createWriteStream(dest);
        res.pipe(stream);
        stream.on('finish', () => {
          stream.close();
          resolve({ id, status: 200, isUsed: usedIds.has(id), size: fs.statSync(dest).size });
        });
      } else {
        resolve({ id, status: res.statusCode, isUsed: usedIds.has(id) });
      }
    }).on('error', () => resolve({ id, status: 500, isUsed: usedIds.has(id) }));
  });
}

(async () => {
  for (const id of candidates) {
    const r = await checkAndDownload(id);
    if (r.status === 200 && !r.isUsed) {
      console.log(`✓ UNUSED & 200: ${r.id} (${(r.size/1024).toFixed(1)} KB)`);
    }
  }
})();
