import fs from 'fs';
let code = fs.readFileSync('src/pages/PrescriptionUpload.tsx', 'utf8');

const target = `    // Simulate API delay for upload
    setTimeout(() => {
      setIsUploading(false);
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);`;

const replacement = `    try {
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
      };
      
      const { error } = await supabase.from('prescriptions').insert(insertData);
      
      if (error) {
        console.error("Failed to insert prescription:", error);
        toast.error('Failed to submit prescription');
        setIsUploading(false);
        return;
      }
      
      setIsUploading(false);
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setIsUploading(false);
      toast.error('Failed to submit prescription');
    }`;

if (code.includes('import { supabase }')) {
  // already imported
} else {
  code = "import { supabase } from '../lib/supabase';\n" + code;
}

code = code.replace(target, replacement);

fs.writeFileSync('src/pages/PrescriptionUpload.tsx', code);
console.log('Upload patched.');
