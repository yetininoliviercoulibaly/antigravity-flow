const fs = require('fs-extra');
const path = require('path');

const templatesSrc = path.join(__dirname, '../src/templates');
const templatesDest = path.join(__dirname, '../dist/src/templates');
const localesSrc = path.join(__dirname, '../src/locales');
const localesDest = path.join(__dirname, '../dist/src/locales');

Promise.all([
  fs.copy(templatesSrc, templatesDest),
  fs.copy(localesSrc, localesDest)
])
  .then(() => console.log('Assets (templates & locales) copied successfully!'))
  .catch(err => console.error(err));
