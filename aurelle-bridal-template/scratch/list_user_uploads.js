const fs = require('fs');
const path = require('path');

const userUploadedDir = 'C:/Users/HP/.gemini/antigravity-ide/brain/3a83a3aa-c80c-46c9-b73d-980d148d053b/.user_uploaded';
if (fs.existsSync(userUploadedDir)) {
  const files = fs.readdirSync(userUploadedDir);
  console.log('.user_uploaded files:');
  files.forEach(f => {
    const p = path.join(userUploadedDir, f);
    const stat = fs.statSync(p);
    console.log(`- ${f} (${(stat.size/1024).toFixed(1)} KB) - mtime: ${stat.mtime.toISOString()}`);
  });
}

const tempMediaDir = 'C:/Users/HP/.gemini/antigravity-ide/brain/3a83a3aa-c80c-46c9-b73d-980d148d053b/.tempmediaStorage';
if (fs.existsSync(tempMediaDir)) {
  const files = fs.readdirSync(tempMediaDir);
  console.log('.tempmediaStorage files:');
  files.forEach(f => {
    const p = path.join(tempMediaDir, f);
    const stat = fs.statSync(p);
    console.log(`- ${f} (${(stat.size/1024).toFixed(1)} KB) - mtime: ${stat.mtime.toISOString()}`);
  });
}
