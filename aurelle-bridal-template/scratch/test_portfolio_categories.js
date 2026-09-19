const fs = require('fs');

const portfolioHtml = fs.readFileSync('portfolio.html', 'utf8');

const categories = ['all', 'bridal', 'hair', 'mehendi', 'engagement', 'reception', 'destination'];

categories.forEach(cat => {
  if (cat === 'all') {
    const count = (portfolioHtml.match(/class="col-6 col-md-4 col-lg-3 portfolio-item/g) || []).length;
    console.log('Category ALL count:', count);
  } else {
    const reg = new RegExp('data-category="[^"]*\\b' + cat + '\\b[^"]*"', 'g');
    const count = (portfolioHtml.match(reg) || []).length;
    console.log('Category ' + cat.padEnd(12) + ' count:', count);
  }
});
