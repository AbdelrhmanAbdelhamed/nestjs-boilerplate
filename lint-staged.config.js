module.exports = {
  '*.{ts,js}': ['npm run lint', 'npm run test -- --findRelatedTests'],
  '*.md': ['npm run markdownlint'],
};
