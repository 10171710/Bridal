const fs = require('fs');
const path = require('path');

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
console.log(`Found ${htmlFiles.length} HTML files:`);

let totalImgs = 0;
let totalPlaceholders = 0;
let emptyPlaceholders = 0;
let uniqueImgSrcs = new Set();

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Find all .ph elements
  const phMatches = content.match(/class="[^"]*\bph\b[^"]*"/g) || [];
  const phHasImgMatches = content.match(/class="[^"]*\bhas-img\b[^"]*"/g) || [];
  const imgMatches = content.match(/<img[^>]+src=["']([^"']+)["']/g) || [];
  
  // Check for .ph without has-img
  const rawPhs = phMatches.length - phHasImgMatches.length;
  
  totalPlaceholders += phMatches.length;
  emptyPlaceholders += rawPhs;
  totalImgs += imgMatches.length;
  
  imgMatches.forEach(m => {
    const srcMatch = m.match(/src=["']([^"']+)["']/);
    if (srcMatch && srcMatch[1]) {
      uniqueImgSrcs.add(srcMatch[1]);
    }
  });
  
  console.log(` - ${file.padEnd(22)}: ${imgMatches.length.toString().padStart(2)} imgs | ${phMatches.length.toString().padStart(2)} ph total | ${rawPhs} empty ph`);
});

console.log('\n--- Summary ---');
console.log(`Total HTML files: ${htmlFiles.length}`);
console.log(`Total <img> tags: ${totalImgs}`);
console.log(`Total empty .ph placeholders: ${emptyPlaceholders}`);
console.log(`Total unique image URLs across static HTML: ${uniqueImgSrcs.size}`);
