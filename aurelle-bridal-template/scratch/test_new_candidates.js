const fs = require('fs');
const https = require('https');
const path = require('path');

// 1. Build a strict set of all image URLs / photo IDs used anywhere in the project
const allFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const usedIds = new Set();
allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const matches = content.match(/photo-[a-zA-Z0-9-]+/g) || [];
  matches.forEach(id => usedIds.add(id));
});

console.log('Total photo IDs used across all HTML files:', usedIds.size);

// Candidate curated Unsplash photo IDs specifically for:
// Look 10 (Festive Sangeet/Reception Bride):
const candidates10 = [
  'photo-1583939003579-730e3918a45a', // Gorgeous bride in festive celebration
  'photo-1519741497674-611481863552', // (Check blacklist)
  'photo-1546804784-896d0dca3805', // Festive Indian bride in shimmering red and gold
  'photo-1563245372-f21724e3856d', // Elegant bride in reception couture
  'photo-1537633552985-df8429e8048b',
  'photo-1511285560929-80b456fea0bc',
  'photo-1520854221256-17451cc331bf', // Glamorous bride portrait
  'photo-1529636798458-92182e662485', // Radiant festive celebration
  'photo-1519225429177-3e1503c51ffc'
];

// Look 11 (Airbrush HD Bridal Makeup - High Fashion close-up):
const candidates11 = [
  'photo-1522337360788-8b13dee7a37e',
  'photo-1509967419530-da38b4704bc6',
  'photo-1512496015851-a90fb38ba796', // Gorgeous luxury beauty portrait
  'photo-1588516903720-8ceb67f9ef84', // Exquisite bridal beauty makeup
  'photo-1596704017254-9b121068fb31', // Flawless glam makeup
  'photo-1487412720507-e7ab37603c6f',
  'photo-1508214751196-bcfd4ca60f91',
  'photo-1526045612212-70caf35c14df'  // Flawless beauty portrait
];

// Look 12 (Soft Waves & Veil Hairstyling):
const candidates12 = [
  'photo-1595777457583-95e059d581b8', // Romantic bride with cascading waves and veil
  'photo-1524504388940-b1c1722653e1', // Elegant waves
  'photo-1534528741775-53994a69daeb',
  'photo-1517841905240-472988babdf9',
  'photo-1544005313-94ddf0286df2',
  'photo-1515886657613-9f3515b0c78f'
];

function checkPhoto(id) {
  return new Promise(resolve => {
    const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=85`;
    https.get(url, res => {
      resolve({ id, status: res.statusCode, isUsed: usedIds.has(id) });
    }).on('error', () => resolve({ id, status: 500, isUsed: usedIds.has(id) }));
  });
}

(async () => {
  console.log('\n--- Checking Candidates for Look 10 ---');
  for (const id of candidates10) {
    const r = await checkPhoto(id);
    console.log(`${r.id}: HTTP ${r.status}, used elsewhere: ${r.isUsed}`);
  }

  console.log('\n--- Checking Candidates for Look 11 ---');
  for (const id of candidates11) {
    const r = await checkPhoto(id);
    console.log(`${r.id}: HTTP ${r.status}, used elsewhere: ${r.isUsed}`);
  }

  console.log('\n--- Checking Candidates for Look 12 ---');
  for (const id of candidates12) {
    const r = await checkPhoto(id);
    console.log(`${r.id}: HTTP ${r.status}, used elsewhere: ${r.isUsed}`);
  }
})();
