import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/Dashboard.tsx', 'utf8');

// Remove state
code = code.replace(/  const \[prescriptions, setPrescriptions\] = useState<any\[\]>\(\[\]\);\n/g, '');

// Remove fetch
code = code.replace(/        const \{ data: rx \} = await supabase\.from\('prescriptions'\)\.select\('\*'\);\n        if \(rx\) setPrescriptions\(rx\);\n/g, '');

// Remove computed pending
code = code.replace(/  const pendingRx = prescriptions\.filter\(r => r\.status === 'pending'\);\n/g, '');
code = code.replace(/  const pendingRx = prescriptions\.filter\(r => r\.status === 'pending' \|\| r\.status === 'Submitted'\);\n/g, '');
code = code.replace(/  const pendingRx = prescriptions\.filter\(r => \[\s*'pending',?\s*'Submitted'?\s*\].includes\(r\.status\)\);\n/g, '');
code = code.replace(/.*pendingRx.*/g, '');

// Remove rendering block
const blockRegex = /              <div className="p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors">\s*<div className="p-2 bg-red-100 text-red-700 rounded-lg shrink-0 mt-1">\s*<FileText size=\{18\} \/>\s*<\/div>\s*<div>\s*<h4 className="font-bold text-slate-900 text-sm">Prescription Reviews.*?<\/h4>\s*<p className="text-xs text-slate-500 mt-1">Patient uploaded prescriptions pending pharmacist approval\.<\/p>\s*<\/div>\s*<\/div>\s*/g;
code = code.replace(blockRegex, '');

fs.writeFileSync('src/pages/admin/Dashboard.tsx', code);
console.log('Patched admin dashboard');
