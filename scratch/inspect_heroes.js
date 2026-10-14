const fs = require('fs');
const path = require('path');

const projectDir = path.resolve(__dirname, '..');
const htmlFiles = fs.readdirSync(projectDir).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
  const content = fs.readFileSync(path.join(projectDir, file), 'utf8');
  const heroMatch = content.match(/<section[^>]*class=["'][^"']*(hero|page-hero|hero-au)[^"']*["'][^>]*>/i);
  if (heroMatch) {
    console.log(`\n=== ${file} ===`);
    console.log(heroMatch[0]);
    // find first 500 chars of hero section
    const idx = content.indexOf(heroMatch[0]);
    console.log(content.substr(idx, 350));
  } else {
    // check if there's any header/hero
    const altHero = content.match(/<section[^>]*id=["']hero["'][^>]*>|<header[^>]*class=["'][^"']*hero[^"']*["'][^>]*>/i);
    if (altHero) {
      console.log(`\n=== ${file} (alt) ===`);
      console.log(altHero[0]);
    } else {
      console.log(`\n=== ${file} === (NO HERO SECTION DETECTED)`);
    }
  }
});
