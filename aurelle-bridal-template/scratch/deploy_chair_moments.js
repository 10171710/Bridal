const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../assets/images/chair');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const u1 = 'C:/Users/HP/.gemini/antigravity-ide/brain/3a83a3aa-c80c-46c9-b73d-980d148d053b/.user_uploaded/media_1789795794513.jpg';
const u2 = 'C:/Users/HP/.gemini/antigravity-ide/brain/3a83a3aa-c80c-46c9-b73d-980d148d053b/.user_uploaded/media_1789795848212.jpg';
const u3 = 'C:/Users/HP/.gemini/antigravity-ide/brain/3a83a3aa-c80c-46c9-b73d-980d148d053b/.user_uploaded/media_1789796100729.png';
const u4 = 'C:/Users/HP/.gemini/antigravity-ide/brain/3a83a3aa-c80c-46c9-b73d-980d148d053b/.user_uploaded/media_1789796140763.jpg';

const d1 = path.join(targetDir, 'chair-moment-1.png');
const d2 = path.join(targetDir, 'chair-moment-2.png');
const d3 = path.join(targetDir, 'chair-moment-3.png');
const d4 = path.join(targetDir, 'chair-moment-4.png');

fs.copyFileSync(u1, d1);
fs.copyFileSync(u2, d2);
fs.copyFileSync(u3, d3);
fs.copyFileSync(u4, d4);

console.log('Saved chair-moment-1.png:', (fs.statSync(d1).size/1024).toFixed(1), 'KB');
console.log('Saved chair-moment-2.png:', (fs.statSync(d2).size/1024).toFixed(1), 'KB');
console.log('Saved chair-moment-3.png:', (fs.statSync(d3).size/1024).toFixed(1), 'KB');
console.log('Saved chair-moment-4.png:', (fs.statSync(d4).size/1024).toFixed(1), 'KB');
