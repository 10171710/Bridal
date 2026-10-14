const fs = require('fs');
const https = require('https');
const path = require('path');

// Extract all used photos across HTML files
const htmlFiles = fs.readdirSync(path.join(__dirname, '..')).filter(f => f.endsWith('.html'));
const usedIds = new Set();
for (const file of htmlFiles) {
  const content = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  const matches = content.match(/photo-[a-zA-Z0-9-]+/g) || [];
  matches.forEach(m => usedIds.add(m));
}

// Additional bridal makeup photography IDs from Unsplash
const candidates = [
  'photo-1596704017254-9b121068fb31',
  'photo-1616683693504-3ea7e9ad6fec',
  'photo-1509967419530-da38b4704bc6',
  'photo-1512496015851-a90fb38ba796',
  'photo-1588516903720-8ceb67f9ef84',
  'photo-1534528741775-53994a69daeb',
  'photo-1517841905240-472988babdf9',
  'photo-1524504388940-b1c1722653e1',
  'photo-1531746020798-e6953c6e8e04',
  'photo-1541257710737-06d667133a53',
  'photo-1529626455594-4ff0802cfb7e',
  'photo-1594744803329-e58b31de8bf5',
  'photo-1560750588-73207b1ef5b8',
  'photo-1519741347686-c1e0aadf4611',
  'photo-1591604466107-ec97de577aff',
  'photo-1607190074257-dd4b7af0309f',
  'photo-1583939411023-14783179e581',
  'photo-1532712938310-34cb3982ef74',
  'photo-1506794778202-cad84cf45f1d',
  'photo-1563245372-f21724e3856d',
  'photo-1544005313-94ddf0286df2',
  'photo-1515886657613-9f3515b0c78f',
  // Curated bridal portraits from Unsplash:
  'photo-1520854221256-17451cc331bf',
  'photo-1583939003579-730e3918a45a',
  'photo-1519741497674-611481863552',
  'photo-1537633552985-df8429e8048b',
  'photo-1511285560929-80b456fea0bc',
  'photo-1487412720507-e7ab37603c6f',
  'photo-1508214751196-bcfd4ca60f91',
  'photo-1526045612212-70caf35c14df',
  'photo-1595777457583-95e059d581b8',
  'photo-1566737236500-c8ac43014a67',
  'photo-1587300003388-59208cc962cb',
  'photo-1512496015851-a90fb38ba796',
  // Real bride portraits
  'photo-1583939411023-14783179e581',
  'photo-1606800052052-a08af7148866',
  'photo-1522337360788-8b13dee7a37e',
  'photo-1522337094344-6617833ae3fb',
  'photo-1516975080664-ed2fc6a32937',
  'photo-1522337660859-02fbefca4702',
  'photo-1560066984-138dadb4c035',
  'photo-1522337094344-6617833ae3fb'
];

function checkPhoto(id) {
  return new Promise((resolve) => {
    if (usedIds.has(id)) {
      return resolve({ id, status: 'USED' });
    }
    const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=85`;
    https.get(url, (res) => {
      if (res.statusCode === 200 || (res.statusCode >= 300 && res.statusCode < 400)) {
        resolve({ id, status: 'AVAILABLE' });
      } else {
        resolve({ id, status: res.statusCode });
      }
    }).on('error', () => resolve({ id, status: 'ERR' }));
  });
}

async function run() {
  const tested = new Set();
  const available = [];
  for (const id of candidates) {
    if (tested.has(id)) continue;
    tested.add(id);
    const res = await checkPhoto(id);
    if (res.status === 'AVAILABLE') {
      available.push(id);
      console.log(`[AVAILABLE & UNUSED] ${id}`);
    }
  }
  console.log(`Total Available Unused: ${available.length}`);
}

run();
