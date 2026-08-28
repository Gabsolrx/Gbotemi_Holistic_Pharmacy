import fs from 'fs';

// 1. Update Consultation.tsx to use WhatsApp
let consultCode = fs.readFileSync('src/pages/Consultation.tsx', 'utf8');

const oldSubmit = `  const onSubmit = async (data: ConsultationFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API request to book consultation
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };`;

const newSubmit = `  const onSubmit = async (data: ConsultationFormValues) => {
    setIsSubmitting(true);
    
    const message = \`Hello Gbotemi Holistic pharmacy, I would like to book a consultation.

*Patient Details:*
Name: \${data.firstName} \${data.lastName}
Phone: \${data.phone}
Email: \${data.email}

*Consultation Details:*
Date: \${data.date}
Time: \${data.time}
Medium: \${data.medium}
Type: \${data.type}
\${data.notes ? \`Notes: \${data.notes}\n\` : ''}\`;

    let phoneNum = import.meta.env.VITE_WHATSAPP_NUMBER || '2348029660153';
    if (phoneNum.startsWith('0')) {
      phoneNum = '234' + phoneNum.substring(1);
    }
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = \`https://wa.me/\${phoneNum}?text=\${encodedMessage}\`;
    
    window.open(whatsappUrl, '_blank');
    
    setIsSubmitting(false);
    setIsSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };`;

if (consultCode.includes("const onSubmit = async (data: ConsultationFormValues) => {")) {
    const startIndex = consultCode.indexOf("  const onSubmit = async (data: ConsultationFormValues) => {");
    const endIndex = consultCode.indexOf("  };", startIndex) + 4;
    consultCode = consultCode.substring(0, startIndex) + newSubmit + consultCode.substring(endIndex);
}

consultCode = consultCode.replace("Your telepharmacy consultation request has been successfully submitted. One of our pharmacists will contact you shortly to confirm your appointment slot.", "We've opened a new tab to continue your consultation booking via WhatsApp. If it didn't open automatically, please ensure pop-ups are allowed.");

fs.writeFileSync('src/pages/Consultation.tsx', consultCode);
console.log('Updated Consultation.tsx');

// 2. Remove Consultations from AdminLayout.tsx
let adminLayoutCode = fs.readFileSync('src/components/admin/AdminLayout.tsx', 'utf8');
adminLayoutCode = adminLayoutCode.replace(/.*\{ name: 'Consultations'.*\n/g, '');
fs.writeFileSync('src/components/admin/AdminLayout.tsx', adminLayoutCode);
console.log('Removed Consultations from AdminLayout.tsx');

// 3. Remove Consultations from App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(/import AdminConsultations from '.\/pages\/admin\/Consultations';\n/g, '');
appCode = appCode.replace(/.*<Route path="consultations" element={<AdminConsultations \/>} \/>.*\n/g, '');
fs.writeFileSync('src/App.tsx', appCode);
console.log('Removed AdminConsultations from App.tsx');

// 4. Remove from Admin Dashboard
let adminDashCode = fs.readFileSync('src/pages/admin/Dashboard.tsx', 'utf8');
adminDashCode = adminDashCode.replace(/  const \[consultations, setConsultations\] = useState<any\[\]>\(\[\]\);\n/g, '');
adminDashCode = adminDashCode.replace(/        const \{ data: cslts \} = await supabase\.from\('consultations'\)\.select\('\*'\);\n        if \(cslts\) setConsultations\(cslts\);\n/g, '');
adminDashCode = adminDashCode.replace(/  const pendingConsults = consultations\.filter\(c => c\.status === 'pending'\);\n/g, '');

const blockRegex = /              <div className="p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors">\s*<div className="p-2 bg-blue-100 text-blue-700 rounded-lg shrink-0 mt-1">\s*<MessageSquare size=\{18\} \/>\s*<\/div>\s*<div>\s*<h4 className="font-bold text-slate-900 text-sm">Consultation Requests.*?<\/h4>\s*<p className="text-xs text-slate-500 mt-1">Patients requesting pharmacist advice\.<\/p>\s*<\/div>\s*<\/div>\s*/g;
adminDashCode = adminDashCode.replace(blockRegex, '');
fs.writeFileSync('src/pages/admin/Dashboard.tsx', adminDashCode);
console.log('Cleaned up Admin Dashboard');

// 5. Delete unused page
if (fs.existsSync('src/pages/admin/Consultations.tsx')) {
  fs.unlinkSync('src/pages/admin/Consultations.tsx');
  console.log('Deleted src/pages/admin/Consultations.tsx');
}

// 6. Remove from supabase/schema.sql
let schemaCode = fs.readFileSync('supabase/schema.sql', 'utf8');
schemaCode = schemaCode.replace(/CREATE TYPE consultation_status AS ENUM \('pending', 'approved', 'rejected', 'completed'\);\n/g, '');
schemaCode = schemaCode.replace(/-- 7\. Consultations Table\nCREATE TABLE consultations \([\s\S]*?\);\n/g, '');
schemaCode = schemaCode.replace(/ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;\n/g, '');
schemaCode = schemaCode.replace(/CREATE POLICY "Users can view own consultations" ON consultations FOR SELECT USING \(auth\.uid\(\) = user_id OR is_admin\(\)\);\n/g, '');
schemaCode = schemaCode.replace(/CREATE POLICY "Users can insert own consultations" ON consultations FOR INSERT WITH CHECK \(auth\.uid\(\) = user_id\);\n/g, '');
schemaCode = schemaCode.replace(/CREATE POLICY "Admins can manage consultations" ON consultations FOR ALL USING \(is_admin\(\)\);\n/g, '');
fs.writeFileSync('supabase/schema.sql', schemaCode);

// 7. Remove from supabase/migrations/0001_initial_schema.sql
let migrationCode = fs.readFileSync('supabase/migrations/0001_initial_schema.sql', 'utf8');
migrationCode = migrationCode.replace(/-- CONSULTATIONS TABLE\nCREATE TABLE consultations \([\s\S]*?\);\n/g, '');
migrationCode = migrationCode.replace(/ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;\n/g, '');
migrationCode = migrationCode.replace(/-- Consultations: Users can view own consultations\. Admins\/Pharmacists can view all\.\nCREATE POLICY "Users can view own consultations" ON consultations FOR SELECT USING \(auth\.uid\(\) = customer_id\);\nCREATE POLICY "Users can insert own consultations" ON consultations FOR INSERT WITH CHECK \(auth\.uid\(\) = customer_id\);\n/g, '');
fs.writeFileSync('supabase/migrations/0001_initial_schema.sql', migrationCode);
console.log('Cleaned up supabase schemas');
