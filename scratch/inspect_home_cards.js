const fs = require('fs');

['index.html', 'home-2.html'].forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  console.log(`\n========================================`);
  console.log(`          ${file} GRIDS & CARDS         `);
  console.log(`========================================`);
  
  const sections = content.split(/<\/?section[^>]*>/);
  sections.forEach((sec, idx) => {
    const h2 = (sec.match(/<h2[^>]*>([\s\S]*?)<\/h2>/) || ['',''])[1].replace(/<[^>]+>/g, '').trim();
    const rows = sec.match(/<div class="[^"]*row[^"]*"[\s\S]*?<\/div>/g) || [];
    const postCards = (sec.match(/class="[^"]*post-card[^"]*"/g) || []).length;
    const galleryItems = (sec.match(/class="[^"]*gallery-item[^"]*"/g) || []).length;
    const aestheticCards = (sec.match(/class="[^"]*aesthetic-card[^"]*"/g) || []).length;
    const cards = (sec.match(/class="[^"]*card-au[^"]*"/g) || []).length;
    
    if (h2 || postCards || galleryItems || aestheticCards || cards) {
      console.log(`\n[Section ${idx}] H2: "${h2}"`);
      console.log(`  post-cards: ${postCards} | gallery-items: ${galleryItems} | aesthetic-cards: ${aestheticCards} | card-au: ${cards}`);
    }
  });
});
