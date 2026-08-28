import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/Prescriptions.tsx', 'utf8');

const target = `<img src={selectedRx.file_url} alt="Prescription Upload" className="max-w-full max-h-[600px] object-contain" />`;
const replace = `{selectedRx.file_url?.toLowerCase().includes('.pdf') ? (
                  <iframe src={selectedRx.file_url} className="w-full h-[600px] rounded-xl" title="Prescription PDF" />
                ) : (
                  <img src={selectedRx.file_url} alt="Prescription Upload" className="max-w-full max-h-[600px] object-contain" />
                )}`;

if (code.includes(target)) {
  code = code.replace(target, replace);
  fs.writeFileSync('src/pages/admin/Prescriptions.tsx', code);
  console.log('Patched Admin Prescriptions for PDF');
} else {
  console.log('Target not found in Admin Prescriptions');
}
