const fs = require('fs');
const path = require('path');

function search(dir, maxDepth = 4, depth = 0) {
  if (depth > maxDepth) return [];
  let files = [];
  try {
    const list = fs.readdirSync(dir);
    for (const f of list) {
      const full = path.join(dir, f);
      try {
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          files = files.concat(search(full, maxDepth, depth + 1));
        } else if (/\.(png|jpg|jpeg|webp)$/i.test(f)) {
          files.push({ full, mtime: stat.mtime, size: stat.size });
        }
      } catch (e) {}
    }
  } catch (e) {}
  return files;
}

const res = search('C:/Users/HP/.gemini/antigravity-ide');
res.sort((a, b) => b.mtime - a.mtime);
console.log('Top 20 most recent images:');
res.slice(0, 20).forEach(r => console.log(`${r.mtime.toISOString()} - ${(r.size/1024).toFixed(1)} KB - ${r.full}`));
