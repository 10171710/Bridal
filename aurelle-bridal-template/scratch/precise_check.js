const fs = require('fs');

['index.html', 'portfolio.html'].forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  console.log(`\n=== ${file} ===`);
  lines.forEach((line, i) => {
    // Check if line has class="..." with word 'ph'
    const match = line.match(/\bclass="([^"]*)"/);
    if (match) {
      const classList = match[1].split(/\s+/);
      if (classList.includes('ph') && !classList.includes('has-img')) {
        console.log(`Line ${i + 1}: ${line.trim()}`);
      }
    }
  });
});
