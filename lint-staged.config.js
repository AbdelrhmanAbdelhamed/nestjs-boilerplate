module.exports = {
  '*.{ts,js}': ['npm run lint', 'npm run test -- --bail --findRelatedTests'],
  '*.md': ['npm run markdownlint'],
};
