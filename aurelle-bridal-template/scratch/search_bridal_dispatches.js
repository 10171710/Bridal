const https = require('https');
const fs = require('fs');

// Curated top-tier wedding/bridal photography IDs on Unsplash
const candidates = [
  {
    theme: 'updo-veil',
    id: 'photo-1519741497674-611481863552', // Gorgeous bride in lace dress with veil and updo in historic setting
    alt: 'Elegant destination bride in lace gown with cathedral veil and sculpted bridal updo'
  },
  {
    theme: 'updo-veil-alt',
    id: 'photo-1522337360788-8b13dee7a37e', // Bride with romantic updo and pearl accessories
    alt: 'Romantic bridal updo with silk ribbon and pearl veil accents'
  },
  {
    theme: 'humidity-hair',
    id: 'photo-1520854221256-17451cc331bf', // Bride with textured romantic braided hairstyle outdoors
    alt: 'Textured romantic bridal braid and chignon styled for outdoor destination ceremony'
  },
  {
    theme: 'humidity-hair-alt',
    id: 'photo-1511285560929-80b456fea0bc', // Bride with outdoor wind-proof textured hair
    alt: 'Outdoor bride with climate-resilient bridal waves and floral hair pins'
  },
  {
    theme: 'waterproof-makeup',
    id: 'photo-1583939003579-730e3918a45a', // Radiant bride in summer sunlight with glowing flawless makeup
    alt: 'Radiant bride in natural golden sunlight with waterproof glowing bridal makeup'
  },
  {
    theme: 'waterproof-makeup-alt',
    id: 'photo-1594744803329-e58b31de8bf5', // Close up glowing bridal makeup in warm lighting
    alt: 'Luminous summer bridal makeup with dewy skin and natural velvet lip finish'
  }
];

async function checkAndDownload(cand, filename) {
  const url = `https://images.unsplash.com/${cand.id}?auto=format&fit=crop&w=1200&h=900&q=90`;
  const dest = `assets/images/blog/${filename}`;
  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, (res2) => {
          const file = fs.createWriteStream(dest);
          res2.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`✓ Downloaded ${filename} (${fs.statSync(dest).size} bytes)`);
            resolve(true);
          });
        });
      } else if (res.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✓ Downloaded ${filename} (${fs.statSync(dest).size} bytes)`);
          resolve(true);
        });
      } else {
        console.log(`✗ Error status ${res.statusCode} for ${cand.id}`);
        resolve(false);
      }
    }).on('error', (e) => {
      console.log(`✗ Request error: ${e.message}`);
      resolve(false);
    });
  });
}

async function run() {
  await checkAndDownload(candidates[0], 'destination-bridal-updo-veil.jpg');
  await checkAndDownload(candidates[2], 'destination-humidity-proof-hair.jpg');
  await checkAndDownload(candidates[4], 'destination-waterproof-ceremony-makeup.jpg');
}

run();
