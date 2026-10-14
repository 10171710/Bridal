const fs = require('fs');
const path = require('path');

const projectDir = path.resolve(__dirname, '..');
console.log('Scanning directory:', projectDir);

const htmlFiles = fs.readdirSync(projectDir).filter(f => f.endsWith('.html'));

console.log('HTML files found:', htmlFiles.length, htmlFiles);

let allImageUrls = [];
let fileStats = {};

htmlFiles.forEach(file => {
  const filePath = path.join(projectDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Find all img tags
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/g;
  let match;
  let fileImages = [];
  while ((match = imgRegex.exec(content)) !== null) {
    const fullImgTag = match[0];
    const src = match[1];
    
    // Extract alt
    const altMatch = fullImgTag.match(/alt=["']([^"']*)["']/);
    const alt = altMatch ? altMatch[1] : null;
    
    // Extract photo ID if unsplash
    const photoIdMatch = src.match(/photo-([a-zA-Z0-9\-]+)/);
    const photoId = photoIdMatch ? photoIdMatch[1] : null;

    fileImages.push({
      src,
      alt,
      photoId,
      fullImgTag
    });

    if (photoId) {
      allImageUrls.push({
        file,
        photoId,
        src,
        alt
      });
    }
  }

  // Find all .ph elements
  const phRegex = /<div[^>]*class=["'][^"']*?\bph\b[^"']*?["'][^>]*>/g;
  let phMatches = [];
  let phMatch;
  while ((phMatch = phRegex.exec(content)) !== null) {
    phMatches.push(phMatch[0]);
  }

  // Check how many .ph have .has-img
  const hasImgCount = phMatches.filter(p => p.includes('has-img')).length;
  const noImgCount = phMatches.filter(p => !p.includes('has-img')).length;

  fileStats[file] = {
    totalImgs: fileImages.length,
    totalPh: phMatches.length,
    hasImgPh: hasImgCount,
    noImgPh: noImgCount,
    phNoImgTags: phMatches.filter(p => !p.includes('has-img'))
  };
});

console.log('\n================ FILE SUMMARY ================');
Object.keys(fileStats).forEach(f => {
  const s = fileStats[f];
  console.log(`${f}: Imgs = ${s.totalImgs}, .ph = ${s.totalPh} (has-img: ${s.hasImgPh}, placeholder-only: ${s.noImgPh})`);
  if (s.noImgPh > 0) {
    console.log(`  WARNING: ${f} has ${s.noImgPh} placeholders without images:`, s.phNoImgTags);
  }
});

// Check uniqueness of photoIds
console.log('\n================ IMAGE UNIQUENESS ANALYSIS ================');
let photoCounts = {};
allImageUrls.forEach(item => {
  if (!photoCounts[item.photoId]) {
    photoCounts[item.photoId] = [];
  }
  photoCounts[item.photoId].push(item);
});

let duplicates = 0;
let allowedShared = 0;
Object.keys(photoCounts).forEach(id => {
  const occurrences = photoCounts[id];
  if (occurrences.length > 1) {
    // Check if it's the same author avatar or blog sidebar thumbnail
    const files = occurrences.map(o => o.file);
    const alts = occurrences.map(o => o.alt);
    console.log(`Photo ID photo-${id} used ${occurrences.length} times across:`, files, alts);
    duplicates++;
  }
});

console.log(`\nTotal unique photo IDs across all pages: ${Object.keys(photoCounts).length}`);
console.log(`Shared/Repeated photo IDs count: ${duplicates}`);
