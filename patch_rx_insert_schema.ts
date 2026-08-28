import fs from 'fs';

// Patch Upload form
let uploadCode = fs.readFileSync('src/pages/PrescriptionUpload.tsx', 'utf8');

const targetUpload = `      const insertData = {
        customer_notes: JSON.stringify(guestData),
        file_url: fileUrl,
        status: 'pending',
        user_id: userResp?.user?.id || null
      };`;

const replaceUpload = `      const insertData = {
        first_name: data.firstName || 'Guest',
        last_name: data.lastName || 'User',
        contact_number: data.phone || 'N/A',
        email: data.email || 'N/A',
        delivery_address: data.address || '',
        notes: data.notes || '',
        file_url: fileUrl,
        status: 'Submitted',
        customer_id: userResp?.user?.id || null
      };`;

if (uploadCode.includes(targetUpload)) {
  uploadCode = uploadCode.replace(targetUpload, replaceUpload);
  fs.writeFileSync('src/pages/PrescriptionUpload.tsx', uploadCode);
  console.log('Patched upload insert payload');
} else {
  console.log('Upload target not found!');
}

// Patch Admin Dashboard
let adminCode = fs.readFileSync('src/pages/admin/Prescriptions.tsx', 'utf8');

const targetAdmin1 = `        return {
          ...rx,
          parsed_notes: parsed,
          profiles: rx.user_id ? profilesMap[rx.user_id] : null
        };`;

const replaceAdmin1 = `        return {
          ...rx,
          parsed_notes: parsed,
          profiles: rx.customer_id ? profilesMap[rx.customer_id] : null
        };`;
adminCode = adminCode.replace(targetAdmin1, replaceAdmin1);

adminCode = adminCode.replace(/rx\.user_id/g, 'rx.customer_id');

const targetAdmin2 = `{selectedRx.profiles?.first_name || selectedRx.parsed_notes?.firstName} {selectedRx.profiles?.last_name || selectedRx.parsed_notes?.lastName}`;
const replaceAdmin2 = `{selectedRx.first_name || selectedRx.profiles?.first_name} {selectedRx.last_name || selectedRx.profiles?.last_name}`;
adminCode = adminCode.replace(targetAdmin2, replaceAdmin2);

const targetAdmin3 = `{rx.profiles?.first_name || rx.parsed_notes?.firstName} {rx.profiles?.last_name || rx.parsed_notes?.lastName}`;
const replaceAdmin3 = `{rx.first_name || rx.profiles?.first_name} {rx.last_name || rx.profiles?.last_name}`;
adminCode = adminCode.replace(targetAdmin3, replaceAdmin3);

const targetAdmin4 = `{selectedRx.profiles?.phone || selectedRx.parsed_notes?.phone}`;
const replaceAdmin4 = `{selectedRx.contact_number || selectedRx.profiles?.phone}`;
adminCode = adminCode.replace(targetAdmin4, replaceAdmin4);

const targetAdmin5 = `{selectedRx.profiles?.email || selectedRx.parsed_notes?.email}`;
const replaceAdmin5 = `{selectedRx.email || selectedRx.profiles?.email}`;
adminCode = adminCode.replace(targetAdmin5, replaceAdmin5);

const targetAdmin6 = `{selectedRx.parsed_notes ? (selectedRx.parsed_notes.notes || 'None') : (selectedRx.customer_notes || 'None')}`;
const replaceAdmin6 = `{selectedRx.notes || 'None'}`;
adminCode = adminCode.replace(targetAdmin6, replaceAdmin6);

const targetAdmin7 = `{rx.customer_notes || 'No notes provided'}`;
const replaceAdmin7 = `{rx.notes || rx.customer_notes || 'No notes provided'}`;
adminCode = adminCode.replace(targetAdmin7, replaceAdmin7);

const targetAdmin8 = `if (selectedRx.status === 'pending') {`;
const replaceAdmin8 = `if (selectedRx.status === 'pending' || selectedRx.status === 'Submitted') {`;
adminCode = adminCode.replace(targetAdmin8, replaceAdmin8);

const targetAdmin9 = `{selectedRx.status === 'pending' ? (`;
const replaceAdmin9 = `{(selectedRx.status === 'pending' || selectedRx.status === 'Submitted') ? (`;
adminCode = adminCode.replace(targetAdmin9, replaceAdmin9);

fs.writeFileSync('src/pages/admin/Prescriptions.tsx', adminCode);
console.log('Patched admin dashboard');

