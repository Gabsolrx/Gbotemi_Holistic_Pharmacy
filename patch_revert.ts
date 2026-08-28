import fs from 'fs';

// Patch Upload form
let uploadCode = fs.readFileSync('src/pages/PrescriptionUpload.tsx', 'utf8');

const targetUpload = `      const insertData = {
        first_name: data.firstName || 'Guest',
        last_name: data.lastName || 'User',
        contact_number: data.phone || 'N/A',
        email: data.email || 'N/A',
        delivery_address: data.address || '',
        notes: data.notes || '',
        file_url: fileUrl,
        status: 'Submitted',
        customer_id: userResp?.user?.id || null
      };
      
      // Call our new API route to bypass RLS so guests can upload
      const response = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(insertData)
      });
      
      if (!response.ok) {
        const errData = await response.json();
        console.error("Failed to insert prescription:", errData);
        toast.error('Failed to submit prescription');
        setIsUploading(false);
        return;
      }`;

const replaceUpload = `      const guestData = {
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
      };
      
      if (userResp?.user?.id) {
        // Logged in user: use client-side Supabase to use their auth session
        const { error } = await supabase.from('prescriptions').insert(insertData);
        if (error) {
          console.error("Failed to insert prescription client-side:", error);
          toast.error('Failed: ' + error.message);
          setIsUploading(false);
          return;
        }
      } else {
        // Guest user: try backend API to bypass RLS
        const response = await fetch('/api/prescriptions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(insertData)
        });
        
        if (!response.ok) {
          const errData = await response.json();
          console.error("Failed to insert prescription server-side:", errData);
          toast.error('Please log in to upload a prescription.');
          setIsUploading(false);
          return;
        }
      }`;

if (uploadCode.includes(targetUpload)) {
  uploadCode = uploadCode.replace(targetUpload, replaceUpload);
  fs.writeFileSync('src/pages/PrescriptionUpload.tsx', uploadCode);
  console.log('Patched upload form back to original schema');
} else {
  console.log('Upload form target not found');
}
