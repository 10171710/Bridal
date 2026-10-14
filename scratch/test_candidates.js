const https = require('https');

const candidates = [
  // Replacement for 1512290900672-1f5be63dc940 (Skin prep / skincare products on marble vanity)
  '1556228722-d0b5f1589485',
  '1522337360788-8b13dee7a37e',
  '1571875257727-256c39da42af',
  '1598440947619-2c35fc9aa908',
  
  // Replacement for 1554415707-9e4466a9b9a6 (Planning / Budget / Notebook & florals)
  '1517842645767-c639042777db',
  '1434030216411-0b793f4b4173',
  '1455390582262-044cdead277a',
  '1506784983877-45594efa4cbe',

  // Replacement for 1580894732484-902996d987e9 (Testimonial avatar / elegant woman)
  '1544005313-94ddf0286df2',
  '1534528741775-53994a69daeb',
  '1508214751196-bcfd4ca60f91',
  '1544717302-de2939b7ef71',
  '1531746020798-e6953c6e8e04',
  '1524504388940-b1c1722653e1',
  '1507003211169-0a1dd7228f2d',
  '1494790108377-be9c29b29330',

  // Replacement for 1588510841487-1224f899bd1e (Dashboard Look 1: Dewy Royal Gold bridal glam)
  '1522337094846-8a818192de1f',
  '1560066984-138dadb4c035',
  '1526045612212-70caf35c14df',
  '1516975080664-ed2fc6a32937',
  '1595476108010-b4d1f102b1b1',
  '1583391733956-3750e0ff4e8b',
  '1515934751635-c81c6bc9a2d8',

  // Replacement for 1546804784-896d0d517245 (Signature Aesthetics: Reception & Sangeet Transformation)
  '1519741497674-611481863552',
  '1509967419530-da38b4704bc6',
  '1511795409834-ef04bbd61622',
  '1520854221256-17451cc331bf',
  '1506152983158-b4a74a01c721'
];

console.log('Testing candidates...');
candidates.forEach(id => {
  const url = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=85`;
  https.request(url, { method: 'HEAD' }, (res) => {
    if (res.statusCode === 200) {
      console.log(`[VALID 200] photo-${id}`);
    } else {
      console.log(`[INVALID ${res.statusCode}] photo-${id}`);
    }
  }).end();
});
