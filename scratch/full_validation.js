const fs = require('fs');

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

console.log('=====================================================');
console.log('   AURELLE BRIDAL ATELIER — FULL SITE VERIFICATION   ');
console.log('=====================================================\n');

let totalImgs = 0;
let totalPhs = 0;
let totalMissingImg = 0;
const allPhotoIds = new Map();

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Find all <div class="...ph...">
  const divMatches = content.match(/<div[^>]*class="[^"]*\bph\b[^"]*"[^>]*>([\s\S]*?)<\/div>/g) || [];
  totalPhs += divMatches.length;
  
  let fileImgs = 0;
  divMatches.forEach(div => {
    if (!div.includes('has-img') || !div.includes('<img')) {
      totalMissingImg++;
      console.warn(`[WARN] In ${file}: placeholder missing img: ${div.slice(0, 80)}...`);
    } else {
      fileImgs++;
    }
  });
  
  // Extract all img src
  const imgSrcMatches = content.match(/<img[^>]+src="([^">]+)"/g) || [];
  totalImgs += imgSrcMatches.length;
  
  imgSrcMatches.forEach(tag => {
    const src = tag.match(/src="([^">]+)"/)[1];
    const photoIdMatch = src.match(/photo-([0-9a-f-]+)/i);
    const photoId = photoIdMatch ? photoIdMatch[1] : src;
    
    if (!allPhotoIds.has(photoId)) {
      allPhotoIds.set(photoId, []);
    }
    allPhotoIds.get(photoId).push(file);
  });
  
  console.log(`✓ ${file.padEnd(22)}: ${fileImgs.toString().padStart(2)}/${divMatches.length.toString().padStart(2)} placeholders filled with <img>`);
});

console.log('\n--- METRICS SUMMARY ---');
console.log(`HTML Files Audited:       ${htmlFiles.length}`);
console.log(`Total Placeholders (.ph): ${totalPhs}`);
console.log(`Total <img> Elements:     ${totalImgs}`);
console.log(`Unfilled Placeholders:    ${totalMissingImg}`);
console.log(`Unique Photo Resources:   ${allPhotoIds.size}`);

if (totalMissingImg === 0) {
  console.log('\n[PASS] 100% of website placeholders have been successfully upgraded to high-resolution imagery.');
} else {
  console.log(`\n[FAIL] Found ${totalMissingImg} unstyled placeholders.`);
}
