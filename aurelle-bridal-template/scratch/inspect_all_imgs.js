const fs = require('fs');
const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
htmlFiles.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  const regex = /<img[^>]+src=["']([^"']+)["'][^>]*alt=["']([^"']*)["']/g;
  let match;
  const imgs = [];
  while ((match = regex.exec(c)) !== null) {
    imgs.push({ src: match[1], alt: match[2] });
  }
  if (imgs.length > 0) {
    console.log(`=== ${f} (${imgs.length} imgs) ===`);
    imgs.forEach(img => console.log(`  [src] ${img.src} | [alt] ${img.alt}`));
  }
});
