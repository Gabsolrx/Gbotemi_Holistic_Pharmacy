import fs from 'fs';
let code = fs.readFileSync('src/pages/PrescriptionUpload.tsx', 'utf8');

const target = `const { error } = await supabase.from('prescriptions').insert(insertData);
      
      if (error) {
        console.error("Failed to insert prescription:", error);
        toast.error('Failed to submit prescription');
        setIsUploading(false);
        return;
      }`;

const replace = `// Call our new API route to bypass RLS so guests can upload
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

code = code.replace(target, replace);
fs.writeFileSync('src/pages/PrescriptionUpload.tsx', code);
console.log('Patched prescription upload to use API');
