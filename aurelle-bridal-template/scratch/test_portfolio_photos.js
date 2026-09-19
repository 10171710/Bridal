const https = require('https');
const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'portfolio.html');
const blacklist = new Set();
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const matches = content.match(/photo-[a-zA-Z0-9-]+/g) || [];
  matches.forEach(id => blacklist.add(id));
});

console.log('Blacklisted IDs from other pages count:', blacklist.size);

const candidates = [
  'photo-1610030469983-98e550d6193c',
  'photo-1594744803329-e58b31de8bf5',
  'photo-1587300003388-59208cc962cb',
  'photo-1566737236500-c8ac43014a67',
  'photo-1588516903720-8ceb67f9ef84',
  'photo-1605497788044-5a32c7078486',
  'photo-1596704017254-9b121068fb31',
  'photo-1549416878-b9ca95e26903',
  'photo-1531746020798-e6953c6e8e04',
  'photo-1541257710737-06d667133a53',
  'photo-1509967419530-da38b4704bc6',
  'photo-1529626455594-4ff0802cfb7e',
  'photo-1502823403499-6ccfcf4fb453',
  'photo-1494790108377-be9c29b29330',
  'photo-1515934751635-c81c6bc9a2d8',
  'photo-1500917293891-ef795e70e1f6',
  'photo-1507652313519-d4e9174996dd',
  'photo-1556760544-74068565f05c',
  'photo-1617627143750-d86bc21e42bb',
  'photo-1600880292203-757bb62b4baf',
  'photo-1599447421416-3414500d18a5',
  'photo-1609357605129-26f69add5d6e',
  'photo-1579783902614-a3fb3927b675',
  'photo-1560750588-73207b1ef5b8',
  'photo-1492562080023-ab3db95bfbce',
  'photo-1526045612212-70caf35c14df',
  'photo-1516726817505-f5ed825624d8',
  'photo-1576828831022-ae4189f5097b',
  'photo-1515886657613-9f3515b0c78f',
  'photo-1506794778202-cad84cf45f1d',
  'photo-1534447677768-be436bb09401'
];

async function checkUrl(id) {
  return new Promise((resolve) => {
    const url = 'https://images.unsplash.com/' + id + '?auto=format&fit=crop&w=600&q=85';
    https.get(url, (res) => {
      resolve({ id, status: res.statusCode, isBlacklisted: blacklist.has(id) });
    }).on('error', () => resolve({ id, status: 500, isBlacklisted: blacklist.has(id) }));
  });
}

(async () => {
  const results = await Promise.all(candidates.map(checkUrl));
  const available = results.filter(r => r.status === 200 && !r.isBlacklisted);
  console.log('Available 100% Unique & Verified HTTP 200 candidates count:', available.length);
  available.forEach(a => console.log('  ✓', a.id));
})();
