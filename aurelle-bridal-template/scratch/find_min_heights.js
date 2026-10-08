const fs = require('fs');
const css = fs.readFileSync('assets/css/style.css', 'utf8');
const lines = css.split('\n');

lines.forEach((line, idx) => {
  if (/h[1-6]\b|min-height|gap|margin-bottom/i.test(line)) {
    if (/min-height|margin-bottom:\s*(?:[1-9]|0\.[6-9])/i.test(line)) {
      console.log(`Line ${idx+1}: ${line.trim()}`);
    }
  }
});
