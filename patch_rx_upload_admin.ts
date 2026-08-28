import fs from 'fs';

// 1. Fix PrescriptionUpload.tsx
let uploadCode = fs.readFileSync('src/pages/PrescriptionUpload.tsx', 'utf8');

const targetUpload = `    try {
      // Create a dummy URL for the file to prevent the admin dashboard from crashing
      const fileUrl = 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=800&q=80'; 

      const { data: userResp } = await supabase.auth.getUser();
      
      const insertData = {
        first_name: data.firstName,
        last_name: data.lastName,
        contact_number: data.phone,
        email: data.email,
        delivery_address: data.address,
        customer_notes: data.notes,
        file_url: fileUrl,
        status: 'pending',
        user_id: userResp?.user?.id || null
      };`;

const replaceUpload = `    try {
      // Create a dummy URL for the file to prevent the admin dashboard from crashing
      const fileUrl = 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=800&q=80'; 

      const { data: userResp } = await supabase.auth.getUser();
      
      const guestData = {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        address: data.address,
        notes: data.notes
      };
      
      const insertData = {
        customer_notes: JSON.stringify(guestData),
        file_url: fileUrl,
        status: 'pending',
        user_id: userResp?.user?.id || null
      };`;

if (uploadCode.includes('first_name: data.firstName,')) {
    uploadCode = uploadCode.replace(targetUpload, replaceUpload);
    fs.writeFileSync('src/pages/PrescriptionUpload.tsx', uploadCode);
}


// 2. Fix AdminPrescriptions.tsx parsing
let adminCode = fs.readFileSync('src/pages/admin/Prescriptions.tsx', 'utf8');

const targetAdmin1 = `(rx.profiles?.first_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (rx.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()))`;
const replaceAdmin1 = `(rx.profiles?.first_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (rx.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (rx.parsed_notes?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()))`;

const targetAdmin2 = `const combinedData = (rxData || []).map(rx => ({
        ...rx,
        profiles: rx.user_id ? profilesMap[rx.user_id] : null
      }));`;
const replaceAdmin2 = `const combinedData = (rxData || []).map(rx => {
        let parsed = null;
        try {
          if (rx.customer_notes && rx.customer_notes.startsWith('{')) {
            parsed = JSON.parse(rx.customer_notes);
          }
        } catch(e) {}
        return {
          ...rx,
          parsed_notes: parsed,
          profiles: rx.user_id ? profilesMap[rx.user_id] : null
        };
      });`;

const targetAdmin3 = `<p className="text-xs text-slate-500 mt-1">{selectedRx.id} • {selectedRx.profiles?.first_name}</p>`;
const replaceAdmin3 = `<p className="text-xs text-slate-500 mt-1">{selectedRx.id} • {selectedRx.profiles?.first_name || selectedRx.parsed_notes?.firstName || 'Guest'}</p>`;

const targetAdmin4 = `<p className="font-medium text-sm text-slate-900">{selectedRx.profiles?.first_name} {selectedRx.profiles?.last_name}</p>`;
const replaceAdmin4 = `<p className="font-medium text-sm text-slate-900">{selectedRx.profiles?.first_name || selectedRx.parsed_notes?.firstName} {selectedRx.profiles?.last_name || selectedRx.parsed_notes?.lastName}</p>`;

const targetAdmin5 = `<p className="font-medium text-sm text-slate-900 break-all">{selectedRx.profiles?.email}</p>`;
const replaceAdmin5 = `<p className="font-medium text-sm text-slate-900 break-all">{selectedRx.profiles?.email || selectedRx.parsed_notes?.email}</p>`;

const targetAdmin6 = `{selectedRx.customer_notes || 'None'}`;
const replaceAdmin6 = `{selectedRx.parsed_notes ? (selectedRx.parsed_notes.notes || 'None') : (selectedRx.customer_notes || 'None')}`;

const targetAdmin7 = `<p className="font-medium text-slate-900">{rx.profiles?.first_name} {rx.profiles?.last_name}</p>
                      <p className="text-xs text-slate-500">{rx.profiles?.email}</p>`;
const replaceAdmin7 = `<p className="font-medium text-slate-900">{rx.profiles?.first_name || rx.parsed_notes?.firstName} {rx.profiles?.last_name || rx.parsed_notes?.lastName}</p>
                      <p className="text-xs text-slate-500">{rx.profiles?.email || rx.parsed_notes?.email}</p>`;

adminCode = adminCode.replace(targetAdmin1, replaceAdmin1);
adminCode = adminCode.replace(targetAdmin2, replaceAdmin2);
adminCode = adminCode.replace(targetAdmin3, replaceAdmin3);
adminCode = adminCode.replace(targetAdmin4, replaceAdmin4);
adminCode = adminCode.replace(targetAdmin5, replaceAdmin5);
adminCode = adminCode.replace(targetAdmin6, replaceAdmin6);
adminCode = adminCode.replace(targetAdmin7, replaceAdmin7);

fs.writeFileSync('src/pages/admin/Prescriptions.tsx', adminCode);
console.log('Admin Prescriptions JSON parsing added.');
