import fs from 'fs';
let code = fs.readFileSync('src/pages/PrescriptionUpload.tsx', 'utf8');

const target = `      const guestData = {
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

const replace = `      // Format the WhatsApp message
      const message = \`Hello, I would like to submit a prescription order.

*Patient Details:*
Name: \${data.firstName} \${data.lastName}
Phone: \${data.phone}
Email: \${data.email}
Delivery Address: \${data.address}
\${data.notes ? \`Notes: \${data.notes}\n\` : ''}
*Prescription Document:*
\${fileUrl}\`;

      // Get WhatsApp number from env or fallback
      let phoneNum = import.meta.env.VITE_WHATSAPP_NUMBER || '2348029660153';
      if (phoneNum.startsWith('0')) {
        phoneNum = '234' + phoneNum.substring(1);
      }
      
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = \`https://wa.me/\${phoneNum}?text=\${encodedMessage}\`;
      
      // Open WhatsApp in a new tab
      window.open(whatsappUrl, '_blank');`;

if (code.includes(target)) {
  code = code.replace(target, replace);
  fs.writeFileSync('src/pages/PrescriptionUpload.tsx', code);
  console.log('Successfully patched for WhatsApp redirect');
} else {
  console.log('Target block not found. Checking if slightly modified...');
}
