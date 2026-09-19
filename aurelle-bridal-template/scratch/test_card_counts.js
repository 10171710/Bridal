const fs = require('fs');

// Verify blog.html has 8 blog-item elements
const blogHtml = fs.readFileSync('blog.html', 'utf8');
const items = blogHtml.match(/class="[^"]*blog-item[^"]*"/g) || [];
console.log('blog.html .blog-item count:', items.length);

// Verify index.html has 6 post-card elements in journal
const indexHtml = fs.readFileSync('index.html', 'utf8');
const indexJournal = indexHtml.match(/<section[^>]*id="journal"[^>]*>([\s\S]*?)<\/section>/)[1];
const indexCards = indexJournal.match(/class="[^"]*post-card[^"]*"/g) || [];
console.log('index.html #journal post-card count:', indexCards.length);

// Verify home-2.html has 6 post-card elements in dispatch
const home2Html = fs.readFileSync('home-2.html', 'utf8');
const home2Dispatch = home2Html.match(/<section[^>]*id="dispatch"[^>]*>([\s\S]*?)<\/section>/)[1];
const home2Cards = home2Dispatch.match(/class="[^"]*post-card[^"]*"/g) || [];
console.log('home-2.html #dispatch post-card count:', home2Cards.length);
