const fs = require('fs');
const path = require('path');

const targetDir = path.join(process.cwd(), 'assets', 'images', 'reviews');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const files = [
  { src: 'C:\\Users\\HP\\.gemini\\antigravity-ide\\brain\\fb560c6a-1f60-4de6-9874-ddd214917890\\camille_laurent_review_1789787320263.jpg', dest: 'camille-laurent-review.jpg' },
  { src: 'C:\\Users\\HP\\.gemini\\antigravity-ide\\brain\\fb560c6a-1f60-4de6-9874-ddd214917890\\serena_chen_review_1789787358333.jpg', dest: 'serena-chen-review.jpg' },
  { src: 'C:\\Users\\HP\\.gemini\\antigravity-ide\\brain\\fb560c6a-1f60-4de6-9874-ddd214917890\\maya_almansoor_review_1789787508762.jpg', dest: 'maya-almansoor-review.jpg' },
  { src: 'C:\\Users\\HP\\.gemini\\antigravity-ide\\brain\\fb560c6a-1f60-4de6-9874-ddd214917890\\farah_osei_review_1789787537437.jpg', dest: 'farah-osei-review.jpg' },
  { src: 'C:\\Users\\HP\\.gemini\\antigravity-ide\\brain\\fb560c6a-1f60-4de6-9874-ddd214917890\\hana_yoshida_review_1789787569799.jpg', dest: 'hana-yoshida-review.jpg' }
];

files.forEach(f => {
  fs.copyFileSync(f.src, path.join(targetDir, f.dest));
  console.log('Copied ' + f.dest + ' (' + fs.statSync(path.join(targetDir, f.dest)).size + ' bytes)');
});
