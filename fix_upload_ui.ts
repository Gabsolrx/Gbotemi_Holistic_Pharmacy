import fs from 'fs';
let code = fs.readFileSync('src/pages/PrescriptionUpload.tsx', 'utf8');

const target = `<Button variant="outline" size="lg" className="w-full" onClick={() => navigate('/account/prescriptions')}>
              View My Prescriptions
            </Button>`;
const replace = ``;

code = code.replace(target, replace);
fs.writeFileSync('src/pages/PrescriptionUpload.tsx', code);
