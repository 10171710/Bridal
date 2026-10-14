const fs = require('fs');
const path = require('path');

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
console.log('Found HTML files:', htmlFiles.length);

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const heroMatch = content.match(/<(?:section|main)[^>]*class="[^"]*(?:hero-au|page-hero|error-hero)[^"]*"[^>]*>/i);
  if (heroMatch) {
    console.log(`${file} -> ${heroMatch[0]}`);
  } else {
    console.log(`${file} -> No hero section (e.g. auth/dashboard/booking)`);
  }
});
