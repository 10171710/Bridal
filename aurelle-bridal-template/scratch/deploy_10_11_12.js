const fs = require('fs');
const path = require('path');

const src10 = 'C:/Users/HP/.gemini/antigravity-ide/brain/3a83a3aa-c80c-46c9-b73d-980d148d053b/cand_photo-1617627143750-d86bc21e42bb.jpg';
const dest10 = path.join(__dirname, '../assets/images/portfolio/portfolio-look-10.png');

const src11 = 'C:/Users/HP/.gemini/antigravity-ide/brain/3a83a3aa-c80c-46c9-b73d-980d148d053b/portfolio_look_11_test.jpg';
const dest11 = path.join(__dirname, '../assets/images/portfolio/portfolio-look-11.png');

const src12 = 'C:/Users/HP/.gemini/antigravity-ide/brain/3a83a3aa-c80c-46c9-b73d-980d148d053b/portfolio_look_12_test.jpg';
const dest12 = path.join(__dirname, '../assets/images/portfolio/portfolio-look-12.png');

fs.copyFileSync(src10, dest10);
fs.copyFileSync(src11, dest11);
fs.copyFileSync(src12, dest12);

console.log('Saved look 10:', (fs.statSync(dest10).size / 1024).toFixed(1), 'KB');
console.log('Saved look 11:', (fs.statSync(dest11).size / 1024).toFixed(1), 'KB');
console.log('Saved look 12:', (fs.statSync(dest12).size / 1024).toFixed(1), 'KB');
