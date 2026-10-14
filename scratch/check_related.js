const fs = require('fs');

console.log('=== Checking Related Bridal Guides in blog-details.html ===');
const blogDetails = fs.readFileSync('blog-details.html', 'utf8');
const relatedMatch = blogDetails.match(/<h2>Related Bridal Guides<\/h2>[\s\S]*?<\/section>/);

if (relatedMatch) {
  const sectionHtml = relatedMatch[0];
  const articles = sectionHtml.match(/<article[\s\S]*?<\/article>/g) || [];
  console.log('Number of Related Cards found:', articles.length);
  articles.forEach((card, idx) => {
    const titleMatch = card.match(/<h3><a[^>]*>(.*?)<\/a><\/h3>/);
    const imgMatch = card.match(/<img\s+src="([^"]+)"/);
    const catMatch = card.match(/<i class="bi bi-tag"[^>]*><\/i>\s*([^<]+)<\/span>/);
    console.log(`Card ${idx+1}:`);
    console.log(`  Category: ${catMatch ? catMatch[1].trim() : 'N/A'}`);
    console.log(`  Title:    ${titleMatch ? titleMatch[1].trim() : 'N/A'}`);
    console.log(`  Image:    ${imgMatch ? imgMatch[1] : 'MISSING'}`);
    if (imgMatch && imgMatch[1].startsWith('assets/images/')) {
      const exists = fs.existsSync(imgMatch[1]);
      console.log(`  Local File Exists: ${exists ? 'YES ✓' : 'NO ✗'}`);
    }
  });
} else {
  console.error('Related section not found!');
}
