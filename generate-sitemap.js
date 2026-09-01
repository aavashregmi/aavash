const fs = require('fs');
const path = require('path');

const domain = 'https://aavashregmi.com.np';
const today = new Date().toISOString().split('T')[0];

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${domain}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;

fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemapContent.trim());
console.log('Sitemap updated automatically with date:', today);