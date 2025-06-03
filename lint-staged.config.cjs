module.exports = {
  '*.{js,jsx,ts,tsx}': ['eslint --fix', 'eslint'],
  '*.{js,jsx,ts,tsx,json,yaml,css}': ['prettier --write'],
  '**/*.ts?(x)': () => 'npm run check-types',
};
