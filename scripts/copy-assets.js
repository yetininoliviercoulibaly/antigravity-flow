const fs = require('fs-extra');
const path = require('path');

const src = path.join(__dirname, '../src/templates');
const dest = path.join(__dirname, '../dist/src/templates');

fs.copy(src, dest)
  .then(() => console.log('Templates copied successfully!'))
  .catch(err => console.error(err));
