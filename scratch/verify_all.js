const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

// 1. Check all 12 portfolio images
console.log('--- Portfolio Local Assets Check ---');
for (let i = 1; i <= 12; i++) {
  const filePath = path.join(root, `assets/images/portfolio/portfolio-look-${i}.png`);
  if (!fs.existsSync(filePath)) {
    console.error(`MISSING: portfolio-look-${i}.png`);
  } else {
    const stats = fs.statSync(filePath);
    console.log(`✓ Look ${i}: ${(stats.size / 1024).toFixed(1)} KB`);
  }
}

// 2. Check all HTML files for image references and duplicate photo IDs
console.log('\n--- Duplicate Photo ID & Uniqueness Audit ---');
const htmlFiles = fs.readdirSync(root).filter(f => f.endsWith('.html'));
const photoUsage = {};

for (const file of htmlFiles) {
  const content = fs.readFileSync(path.join(root, file), 'utf8');
  const matches = content.match(/photo-[a-zA-Z0-9-]+/g) || [];
  for (const m of matches) {
    if (!photoUsage[m]) photoUsage[m] = [];
    photoUsage[m].push(file);
  }
}

let dups = 0;
for (const [id, files] of Object.entries(photoUsage)) {
  const uniqueFiles = [...new Set(files)];
  if (uniqueFiles.length > 1) {
    console.log(`Shared photo across files: ${id} in [${uniqueFiles.join(', ')}]`);
    dups++;
  }
}
console.log(`Total cross-file photo IDs shared: ${dups}`);

// 3. Check portfolio.html specifically
console.log('\n--- portfolio.html Audit ---');
const portfolioHtml = fs.readFileSync(path.join(root, 'portfolio.html'), 'utf8');
const buttonCardCount = (portfolioHtml.match(/<button[^>]*class="[^"]*portfolio-card[^"]*"/g) || []).length;
const divCardCount = (portfolioHtml.match(/<div[^>]*class="[^"]*portfolio-card[^"]*"/g) || []).length;
const lightboxCount = (portfolioHtml.match(/data-lightbox/g) || []).length;
const zoomCount = (portfolioHtml.match(/portfolio-zoom|bi-zoom-in/g) || []).length;

console.log(`button.portfolio-card count: ${buttonCardCount} (expected 0)`);
console.log(`div.portfolio-card count: ${divCardCount} (expected 12)`);
console.log(`data-lightbox count in portfolio.html: ${lightboxCount} (expected 0)`);
console.log(`zoom icon / overlay count in portfolio.html: ${zoomCount} (expected 0)`);

if (buttonCardCount === 0 && divCardCount === 12 && lightboxCount === 0 && zoomCount === 0) {
  console.log('\n🌟 ALL CHECKS PASSED PERFECTLY!');
} else {
  console.error('\n⚠️ SOME CHECKS FAILED!');
}
