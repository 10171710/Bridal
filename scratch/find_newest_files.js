const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getFiles(filePath, files);
    } else {
      files.push({ path: filePath, mtime: stat.mtime, size: stat.size });
    }
  }
  return files;
}

const dir = 'C:/Users/HP/.gemini/antigravity-ide/brain/3a83a3aa-c80c-46c9-b73d-980d148d053b';
const all = getFiles(dir);
all.sort((a, b) => b.mtime - a.mtime);

console.log('Top 15 most recently modified files in brain:');
all.slice(0, 15).forEach(f => {
  console.log(`${f.mtime.toISOString()} - ${(f.size/1024).toFixed(1)} KB - ${f.path}`);
});
