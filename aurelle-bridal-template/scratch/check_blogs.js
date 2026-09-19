const fs = require('fs');

function extractArticles(file) {
  const html = fs.readFileSync(file, 'utf8');
  const regex = /href="blog-details\.html\?slug=([^"]+)"/g;
  const slugs = [];
  let m;
  while ((m = regex.exec(html)) !== null) {
    if (!slugs.includes(m[1])) {
      slugs.push(m[1]);
    }
  }
  return { file, slugs, count: slugs.length };
}

console.log('Home 1:', extractArticles('index.html'));
console.log('Home 2:', extractArticles('home-2.html'));
console.log('Blog Page:', extractArticles('blog.html'));
