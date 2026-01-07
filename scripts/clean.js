const fs = require('fs-extra');
const path = require('path');

const distPath = path.join(__dirname, '../dist');

fs.remove(distPath)
  .then(() => console.log('Cleaned dist directory'))
  .catch(err => console.error(err));
