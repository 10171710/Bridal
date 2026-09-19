const fs = require('fs');

['index.html', 'home-2.html'].forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  console.log(`\n=== ${file} SECTIONS ===`);
  const lines = content.split('\n');
  let currentSection = null;
  let sectionIndex = 0;
  let cards = [];
  
  lines.forEach((line, lineNum) => {
    if (line.includes('<section')) {
      sectionIndex++;
      currentSection = { index: sectionIndex, line: lineNum + 1, h2: '', cards: 0, items: [] };
    }
    if (currentSection) {
      if (line.includes('<h2')) {
        currentSection.h2 = line.replace(/<[^>]+>/g, '').trim();
      }
      if (line.includes('post-card') || line.includes('gallery-item') || line.includes('service-card') || line.includes('aesthetic-card') || line.includes('review-card') || line.includes('dispatch-card')) {
        currentSection.cards++;
        currentSection.items.push(line.trim().slice(0, 60));
      }
      if (line.includes('</section>')) {
        console.log(`Section ${currentSection.index} (Line ${currentSection.line}): "${currentSection.h2}" -> ${currentSection.cards} items`);
        currentSection = null;
      }
    }
  });
});
