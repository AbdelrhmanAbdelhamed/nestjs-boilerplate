module.exports = {
  '*.{ts,js}': ['npm run lint'],
  '*.md': ['npm run markdownlint'],
  '.*.spec.ts$': ['npm run test'],
};
