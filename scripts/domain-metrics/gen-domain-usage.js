const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const docsDir = path.join(__dirname, '../../docs');
const blogsDir = path.join(__dirname, '../../blogs/blog');
const featureAnnouncementsDir = path.join(
  __dirname,
  '../../blogs/feature-announcements',
);
const srcDir = path.join(__dirname, '../../src');

const oldDomains = [
  'wavemaker.com',
  'wavemakeronline.com',
  'onwavemaker.com',
  'wavemakerdoamin.com',
  'wavemakerdomain.com',
  'wavemakerdocumentationapp.com',
  'my-wme.com',
];

// Regex to match any of the old domains, potentially with subdomains
const domainRegex = new RegExp(
  `[a-zA-Z0-9.-]+\\.(?:${oldDomains.map((d) => d.replace('.', '\\.')).join('|')})`,
  'gi',
);
// Also match the domains itself if not part of a larger subdomain string
const exactDomainRegex = new RegExp(
  `(?:${oldDomains.map((d) => d.replace('.', '\\.')).join('|')})`,
  'gi',
);

const results = {
  occurrences: [],
  summary: {
    totalOccurrences: 0,
    byDomain: {},
    byAuthor: {},
    byFile: {},
  },
};

const relevantExtensions = [
  '.md',
  '.mdx',
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.css',
];

function walk(dir) {
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else {
      const ext = path.extname(file);
      if (relevantExtensions.includes(ext)) {
        try {
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          let content = fileContents;
          let author = 'Unknown';

          if (ext === '.md' || ext === '.mdx') {
            const { data, content: markdownContent } = matter(fileContents);
            content = markdownContent;
            author =
              (data.last_update && data.last_update.author) ||
              data.author ||
              'Unknown';
          } else {
            author = 'Codebase';
          }

          const relativePath = path.relative(
            path.join(__dirname, '../../'),
            fullPath,
          );

          // Search for domains in the content
          const matches = content.match(domainRegex) || [];
          const exactMatches = content.match(exactDomainRegex) || [];

          const allMatches = [...new Set([...matches, ...exactMatches])];

          if (allMatches.length > 0) {
            allMatches.forEach((domain) => {
              const d = domain.toLowerCase();
              results.occurrences.push({
                domain: d,
                author,
                file: relativePath,
              });

              // Update summary
              results.summary.totalOccurrences++;
              results.summary.byDomain[d] =
                (results.summary.byDomain[d] || 0) + 1;
              results.summary.byAuthor[author] =
                (results.summary.byAuthor[author] || 0) + 1;
              results.summary.byFile[relativePath] =
                (results.summary.byFile[relativePath] || 0) + 1;
            });
          }
        } catch (err) {
          console.error(`Error parsing ${fullPath}:`, err);
        }
      }
    }
  });
}

console.log('Scanning for old domain usage...');
walk(docsDir);
walk(blogsDir);
walk(featureAnnouncementsDir);
walk(srcDir);

const outputPath = path.join(__dirname, 'domain-usage.json');
fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

console.log(`Done! Found ${results.summary.totalOccurrences} occurrences.`);
console.log(`Results saved to ${outputPath}`);
