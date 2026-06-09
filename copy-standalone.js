const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  let entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    let srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy public directory
if (fs.existsSync('public')) {
  copyDir('public', '.next/standalone/public');
}

// Copy static files
if (fs.existsSync('.next/static')) {
  copyDir('.next/static', '.next/standalone/.next/static');
}

console.log('Static assets copied to standalone folder successfully.');
