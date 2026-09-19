const fs = require('fs');

['index.html', 'portfolio.html'].forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  console.log(`\n=== ${file} ===`);
  lines.forEach((line, i) => {
    if (/\bclass="[^"]*\bph\b[^"]*"/.test(line)) {
      if (!line.includes('has-img')) {
        console.log(`Line ${i + 1}: ${line.trim()}`);
      }
    }
  });
});
