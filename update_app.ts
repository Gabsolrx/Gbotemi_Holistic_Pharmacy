import fs from 'fs';

// 1. Update PrescriptionUpload.tsx
let uploadCode = fs.readFileSync('src/pages/PrescriptionUpload.tsx', 'utf8');
const oldMessage = 'Hello, I would like to submit a prescription order.';
const newMessage = 'Hello Gbotemi Holistic Pharmacy, I would like to submit a prescription order.';
if (uploadCode.includes(oldMessage)) {
  uploadCode = uploadCode.replace(oldMessage, newMessage);
  fs.writeFileSync('src/pages/PrescriptionUpload.tsx', uploadCode);
  console.log('Updated WhatsApp message.');
}

// 2. Update AdminLayout.tsx
let adminLayoutCode = fs.readFileSync('src/components/admin/AdminLayout.tsx', 'utf8');
adminLayoutCode = adminLayoutCode.replace(/.*\{ name: 'Prescriptions'.*\n/g, '');
fs.writeFileSync('src/components/admin/AdminLayout.tsx', adminLayoutCode);
console.log('Removed Prescriptions from AdminLayout.');

// 3. Update AccountLayout.tsx
let accountLayoutCode = fs.readFileSync('src/components/account/AccountLayout.tsx', 'utf8');
accountLayoutCode = accountLayoutCode.replace(/.*\{ name: 'Prescriptions'.*\n/g, '');
fs.writeFileSync('src/components/account/AccountLayout.tsx', accountLayoutCode);
console.log('Removed Prescriptions from AccountLayout.');

// 4. Update App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(/import AdminPrescriptions from '.\/pages\/admin\/Prescriptions';\n/g, '');
appCode = appCode.replace(/import Prescriptions from '.\/pages\/account\/Prescriptions';\n/g, '');
appCode = appCode.replace(/.*<Route path="prescriptions" element={<AdminPrescriptions \/>} \/>.*\n/g, '');
appCode = appCode.replace(/.*<Route path="prescriptions" element={<Prescriptions \/>} \/>.*\n/g, '');
fs.writeFileSync('src/App.tsx', appCode);
console.log('Removed Prescriptions routes from App.tsx.');

// 5. Update server.ts
let serverCode = fs.readFileSync('server.ts', 'utf8');
const rxEndpointRegex = /app\.post\("\/api\/prescriptions", async \(req, res\) => \{[\s\S]*?\}\);/g;
serverCode = serverCode.replace(rxEndpointRegex, '');
fs.writeFileSync('server.ts', serverCode);
console.log('Removed /api/prescriptions from server.ts.');

// 6. Delete unused pages
if (fs.existsSync('src/pages/admin/Prescriptions.tsx')) fs.unlinkSync('src/pages/admin/Prescriptions.tsx');
if (fs.existsSync('src/pages/account/Prescriptions.tsx')) fs.unlinkSync('src/pages/account/Prescriptions.tsx');
console.log('Deleted unused pages.');

// 7. Remove from supabase/schema.sql
let schemaCode = fs.readFileSync('supabase/schema.sql', 'utf8');
schemaCode = schemaCode.replace(/CREATE TYPE prescription_status AS ENUM \('pending', 'approved', 'rejected', 'clarification_needed'\);\n/g, '');
schemaCode = schemaCode.replace(/-- 6\. Prescriptions Table\nCREATE TABLE prescriptions \([\s\S]*?\);\n/g, '');
schemaCode = schemaCode.replace(/ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;\n/g, '');
schemaCode = schemaCode.replace(/CREATE POLICY "Users can view own prescriptions" ON prescriptions FOR SELECT USING \(auth\.uid\(\) = user_id OR is_admin\(\)\);\n/g, '');
schemaCode = schemaCode.replace(/CREATE POLICY "Users can insert own prescriptions" ON prescriptions FOR INSERT WITH CHECK \(auth\.uid\(\) = user_id\);\n/g, '');
schemaCode = schemaCode.replace(/CREATE POLICY "Admins can manage prescriptions" ON prescriptions FOR ALL USING \(is_admin\(\)\);\n/g, '');
fs.writeFileSync('supabase/schema.sql', schemaCode);

// 8. Remove from supabase/migrations/0001_initial_schema.sql
let migrationCode = fs.readFileSync('supabase/migrations/0001_initial_schema.sql', 'utf8');
migrationCode = migrationCode.replace(/-- PRESCRIPTIONS TABLE\nCREATE TABLE prescriptions \([\s\S]*?\);\n/g, '');
migrationCode = migrationCode.replace(/ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;\n/g, '');
migrationCode = migrationCode.replace(/-- Prescriptions: Users can view own prescriptions\. Admins\/Pharmacists can view all\.\nCREATE POLICY "Users can view own prescriptions" ON prescriptions FOR SELECT USING \(auth\.uid\(\) = customer_id\);\nCREATE POLICY "Users can insert own prescriptions" ON prescriptions FOR INSERT WITH CHECK \(auth\.uid\(\) = customer_id\);\n/g, '');
fs.writeFileSync('supabase/migrations/0001_initial_schema.sql', migrationCode);
console.log('Cleaned up supabase schema files.');

