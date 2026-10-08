const fs = require('fs');

const files = ['index.html', 'home-2.html', 'blog.html', 'blog-details.html'];
let allGood = true;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const hasOldBtnSm = /class="[^"]*post-foot[^"]*"[^>]*>\s*<a[^>]*btn-sm/g.test(content);
  const readMoreMatches = [...content.matchAll(/data-i18n="cta\.readMore"/g)];
  console.log(`${file}: ${readMoreMatches.length} Read More CTAs found. Old btn-sm present: ${hasOldBtnSm}`);
  if (hasOldBtnSm) allGood = false;
}

const jsFile = 'assets/js/blog-details.js';
const jsContent = fs.readFileSync(jsFile, 'utf8');
const jsOldBtnSm = jsContent.includes('btn-sm');
console.log(`${jsFile}: Old btn-sm present: ${jsOldBtnSm}`);

console.log('All CTAs verified clean:', allGood && !jsOldBtnSm);
