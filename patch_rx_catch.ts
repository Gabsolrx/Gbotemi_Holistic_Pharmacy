import fs from 'fs';
let code = fs.readFileSync('src/pages/PrescriptionUpload.tsx', 'utf8');

const target = `    } catch (err) {
      console.error(err);
      setIsUploading(false);
      toast.error('Failed to submit prescription');
    }`;

const replace = `    } catch (err: any) {
      console.error(err);
      setIsUploading(false);
      toast.error('Failed: ' + (err.message || 'Unknown error'));
    }`;

code = code.replace(target, replace);
fs.writeFileSync('src/pages/PrescriptionUpload.tsx', code);
console.log('Patched frontend error toast');
