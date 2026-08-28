import fs from 'fs';

let cmsCode = fs.readFileSync('src/services/cmsService.ts', 'utf8');
cmsCode = cmsCode.replace(/link: '\/upload-prescription'/g, "link: '/prescription'");
fs.writeFileSync('src/services/cmsService.ts', cmsCode);

let servicesCode = fs.readFileSync('src/pages/Services.tsx', 'utf8');
servicesCode = servicesCode.replace(/link: '\/upload-prescription'/g, "link: '/prescription'");
fs.writeFileSync('src/pages/Services.tsx', servicesCode);

console.log('Links patched!');
