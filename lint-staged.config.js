module.exports = {
  '*.{ts,js}': ['npm run lint'],
  '*.md': ['npm run markdownlint'],
  'src/**/*.{ts,js}': ['npm run test'],
};
