import fs from 'fs';
let uploadCode = fs.readFileSync('src/pages/PrescriptionUpload.tsx', 'utf8');

const target = `      const guestData = {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        address: data.address,
        notes: data.notes
      };
      
      const guestData = {`;

const replace = `      const guestData = {`;
uploadCode = uploadCode.replace(target, replace);
fs.writeFileSync('src/pages/PrescriptionUpload.tsx', uploadCode);
console.log('Fixed guestData duplicate');
