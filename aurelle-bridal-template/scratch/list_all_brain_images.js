const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(walk(full));
    } else if (/\.(png|jpg|jpeg|webp)$/i.test(file)) {
      results.push({ path: full, mtime: stat.mtime, size: stat.size, name: file });
    }
  }
  return results;
}

const allImages = walk('C:/Users/HP/.gemini/antigravity-ide/brain/3a83a3aa-c80c-46c9-b73d-980d148d053b');
allImages.sort((a, b) => b.mtime - a.mtime);

console.log(`Found ${allImages.length} images. Showing newest 10:`);
allImages.slice(0, 10).forEach(img => {
  console.log(`${img.mtime.toISOString()} | ${(img.size/1024).toFixed(1)} KB | ${img.path}`);
});
