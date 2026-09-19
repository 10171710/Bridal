const fs = require('fs');
const path = require('path');

const img1 = 'C:/Users/HP/.gemini/antigravity-ide/brain/3a83a3aa-c80c-46c9-b73d-980d148d053b/.user_uploaded/media_1789794978722.png';
const img2 = 'C:/Users/HP/.gemini/antigravity-ide/brain/3a83a3aa-c80c-46c9-b73d-980d148d053b/.user_uploaded/media_1789795132037.jpg';
const prev12 = path.join(__dirname, '../assets/images/portfolio/portfolio-look-12.png');

console.log('img1 size:', fs.statSync(img1).size);
console.log('img2 size:', fs.statSync(img2).size);
console.log('prev12 size:', fs.statSync(prev12).size);
