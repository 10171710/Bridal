const https = require('https');
const fs = require('fs');

const testIds = [
  '1571875257727-256c39da42af', // Skincare
  '1434030216411-0b793f4b4173', // Budget/Planning
  '1544717302-de2939b7ef71', // Portfolio Testimonial 3 avatar
  '1517445312882-bc9910d016b7', // Dashboard Look 1
  '1524504388940-b1c1722653e1', // Reception glam
  '1508214751196-bcfd4ca60f91', 
  '1534528741775-53994a69daeb',
  '1522337360788-8b13dee7a37e',
  '1562322140-8baeececf3df',
  '1487412720507-e7ab37603c6f',
  '1515377905703-c4788e51af15',
  '1526947425960-945c6e72858f'
];

testIds.forEach(id => {
  const url = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=85`;
  https.request(url, { method: 'HEAD' }, (res) => {
    console.log(`${id}: HTTP ${res.statusCode}`);
  }).end();
});
