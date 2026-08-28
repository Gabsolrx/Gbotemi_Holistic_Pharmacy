import fs from 'fs';
let adminCode = fs.readFileSync('src/pages/admin/Prescriptions.tsx', 'utf8');

const targetAdmin1 = `        return {
          ...rx,
          parsed_notes: parsed,
          profiles: rx.customer_id ? profilesMap[rx.customer_id] : null
        };`;
const replaceAdmin1 = `        return {
          ...rx,
          parsed_notes: parsed,
          profiles: rx.user_id ? profilesMap[rx.user_id] : null
        };`;
adminCode = adminCode.replace(targetAdmin1, replaceAdmin1);

adminCode = adminCode.replace(/rx\.customer_id/g, 'rx.user_id');

const targetAdmin2 = `{selectedRx.first_name || selectedRx.profiles?.first_name} {selectedRx.last_name || selectedRx.profiles?.last_name}`;
const replaceAdmin2 = `{selectedRx.profiles?.first_name || selectedRx.parsed_notes?.firstName} {selectedRx.profiles?.last_name || selectedRx.parsed_notes?.lastName}`;
adminCode = adminCode.replace(new RegExp(targetAdmin2.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replaceAdmin2);

const targetAdmin3 = `{rx.first_name || rx.profiles?.first_name} {rx.last_name || rx.profiles?.last_name}`;
const replaceAdmin3 = `{rx.profiles?.first_name || rx.parsed_notes?.firstName} {rx.profiles?.last_name || rx.parsed_notes?.lastName}`;
adminCode = adminCode.replace(new RegExp(targetAdmin3.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replaceAdmin3);

const targetAdmin4 = `{selectedRx.contact_number || selectedRx.profiles?.phone}`;
const replaceAdmin4 = `{selectedRx.profiles?.phone || selectedRx.parsed_notes?.phone}`;
adminCode = adminCode.replace(new RegExp(targetAdmin4.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replaceAdmin4);

const targetAdmin5 = `{selectedRx.email || selectedRx.profiles?.email}`;
const replaceAdmin5 = `{selectedRx.profiles?.email || selectedRx.parsed_notes?.email}`;
adminCode = adminCode.replace(new RegExp(targetAdmin5.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replaceAdmin5);

const targetAdmin6 = `{selectedRx.notes || 'None'}`;
const replaceAdmin6 = `{selectedRx.parsed_notes ? (selectedRx.parsed_notes.notes || 'None') : (selectedRx.customer_notes || 'None')}`;
adminCode = adminCode.replace(new RegExp(targetAdmin6.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replaceAdmin6);

const targetAdmin7 = `{rx.notes || rx.customer_notes || 'No notes provided'}`;
const replaceAdmin7 = `{rx.customer_notes || 'No notes provided'}`;
adminCode = adminCode.replace(new RegExp(targetAdmin7.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replaceAdmin7);

const targetAdmin8 = `if (selectedRx.status === 'pending' || selectedRx.status === 'Submitted') {`;
const replaceAdmin8 = `if (selectedRx.status === 'pending') {`;
adminCode = adminCode.replace(new RegExp(targetAdmin8.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replaceAdmin8);

const targetAdmin9 = `{(selectedRx.status === 'pending' || selectedRx.status === 'Submitted') ? (`;
const replaceAdmin9 = `{selectedRx.status === 'pending' ? (`;
adminCode = adminCode.replace(new RegExp(targetAdmin9.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replaceAdmin9);

fs.writeFileSync('src/pages/admin/Prescriptions.tsx', adminCode);
console.log('Patched admin dashboard back');

