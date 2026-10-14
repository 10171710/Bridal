const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const prev12Path = path.join(root, 'assets/images/portfolio/portfolio-look-12.png');
const look11Path = path.join(root, 'assets/images/portfolio/portfolio-look-11.png');
const look12Path = path.join(root, 'assets/images/portfolio/portfolio-look-12.png');

const userImg2 = 'C:/Users/HP/.gemini/antigravity-ide/brain/3a83a3aa-c80c-46c9-b73d-980d148d053b/.user_uploaded/media_1789795132037.jpg';

// Step 1: Copy previous 12th card image to 11th
fs.copyFileSync(prev12Path, look11Path);
console.log('Copied 12th card image to 11th:', fs.statSync(look11Path).size, 'bytes');

// Step 2: Copy user's 2nd uploaded picture to 12th
fs.copyFileSync(userImg2, look12Path);
console.log('Copied 2nd uploaded picture to 12th:', fs.statSync(look12Path).size, 'bytes');
