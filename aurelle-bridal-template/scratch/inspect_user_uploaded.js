const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/HP/.gemini/antigravity-ide/brain/3a83a3aa-c80c-46c9-b73d-980d148d053b/.user_uploaded';
const files = fs.readdirSync(dir).map(f => {
  const full = path.join(dir, f);
  const stat = fs.statSync(full);
  return { name: f, full, size: stat.size, mtime: stat.mtime };
});

files.sort((a, b) => a.mtime - b.mtime);
console.log('All files in .user_uploaded:');
files.forEach(f => console.log(`${f.mtime.toISOString()} - ${(f.size/1024).toFixed(1)} KB - ${f.name}`));
