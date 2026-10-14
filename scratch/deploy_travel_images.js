const fs = require('fs');
const path = require('path');

const srcDir = 'C:/Users/HP/.gemini/antigravity-ide/brain/07cbcb3f-468a-40e9-893c-95bd07df0457';
const destDir = 'assets/images/blog';

const mapping = [
  {
    prefix: 'destination_bridal_updo_veil_',
    dest: 'destination-bridal-updo-veil.jpg'
  },
  {
    prefix: 'destination_humidity_proof_hair_',
    dest: 'destination-humidity-proof-hair.jpg'
  },
  {
    prefix: 'destination_waterproof_makeup_',
    dest: 'destination-waterproof-ceremony-makeup.jpg'
  }
];

const brainFiles = fs.readdirSync(srcDir);

mapping.forEach(item => {
  const matched = brainFiles.find(f => f.startsWith(item.prefix) && f.endsWith('.jpg'));
  if (matched) {
    const srcPath = path.join(srcDir, matched);
    const destPath = path.join(destDir, item.dest);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${matched} -> ${destPath} (${fs.statSync(destPath).size} bytes)`);
  } else {
    console.error(`Could not find file matching ${item.prefix}`);
  }
});
