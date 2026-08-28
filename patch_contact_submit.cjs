const fs = require('fs');
let contact = fs.readFileSync('src/pages/Contact.tsx', 'utf8');

const newSubmit = `  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    // Direct email via mailto
    const mailtoLink = \`mailto:gbotemihpharmacy@gmail.com?subject=\${encodeURIComponent(data.subject)}&body=\${encodeURIComponent("From: " + data.name + " (" + data.email + ")\\n\\n" + data.message)}\`;
    window.location.href = mailtoLink;
    
    setIsSubmitting(false);
    setIsSuccess(true);
    reset();
  };`;

contact = contact.replace(/const onSubmit = async \([\s\S]*?\}, 1500\);\s*};/, newSubmit);
fs.writeFileSync('src/pages/Contact.tsx', contact);
