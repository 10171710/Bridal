const fs = require('fs');
const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const used = new Set();
htmlFiles.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  const m = c.match(/assets\/images\/[^"'`\s>]+/g) || [];
  m.forEach(img => used.add(img));
});
console.log('Total local image references used:', used.size);
[...used].sort().forEach(u => console.log(' ', u));
