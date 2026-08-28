import fs from 'fs';
let code = fs.readFileSync('src/services/cmsService.ts', 'utf8');

const target = `    try {
      const stored = localStorage.getItem(CMS_STORAGE_KEY);`;

const replace = `    try {
      const stored = localStorage.getItem(CMS_STORAGE_KEY);
      if (stored) {
         let text = stored;
         text = text.replace(/\\/upload-prescription/g, '/prescription');
         localStorage.setItem(CMS_STORAGE_KEY, text);
      }`;

if (code.includes(target) && !code.includes('text.replace(')) {
  code = code.replace(target, replace);
}

const target2 = `if (!error && data && data.value) {`;
const replace2 = `if (!error && data && data.value) {
        // Hot-fix legacy links dynamically
        let configStr = JSON.stringify(data.value);
        if (configStr.includes('/upload-prescription')) {
          configStr = configStr.replace(/\\/upload-prescription/g, '/prescription');
          data.value = JSON.parse(configStr);
        }`;

if (code.includes(target2) && !code.includes('configStr.replace')) {
  code = code.replace(target2, replace2);
}

fs.writeFileSync('src/services/cmsService.ts', code);
console.log('CMS service patched with override');
