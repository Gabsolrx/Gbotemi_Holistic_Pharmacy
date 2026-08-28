import fs from 'fs';
let code = fs.readFileSync('src/pages/account/Dashboard.tsx', 'utf8');

const target = `<div className="border border-gray-100 rounded-xl p-6 bg-slate-50 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500 mb-1">Active Prescriptions</div>
              <div className="text-3xl font-bold text-gray-900">0</div>
            </div>
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <FileText size={24} />
            </div>
          </div>`;

code = code.replace(target, '');
fs.writeFileSync('src/pages/account/Dashboard.tsx', code);
console.log('Removed Prescriptions stat from account dashboard');
