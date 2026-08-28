const fs = require('fs');

let contact = fs.readFileSync('src/pages/Contact.tsx', 'utf8');
contact = contact.replace(/support@gbotemi\.com/g, 'gbotemihpharmacy@gmail.com');

// Also update the form submission email to go there via mailto or whatever API they use.
// Usually forms just print to console in this template unless there is an API. 
// If it's react-hook-form, we can change the submit handler to use mailto if it's currently a dummy.
// Let's see what the submit handler does.
fs.writeFileSync('src/pages/Contact.tsx', contact);

let cms = fs.readFileSync('src/services/cmsService.ts', 'utf8');
cms = cms.replace(/care@gbotemi\.com/g, 'gbotemihpharmacy@gmail.com');
fs.writeFileSync('src/services/cmsService.ts', cms);

let services = fs.readFileSync('src/pages/Services.tsx', 'utf8');
services = services.replace(/support@gbotemi\.com/g, 'gbotemihpharmacy@gmail.com');
services = services.replace(/care@gbotemi\.com/g, 'gbotemihpharmacy@gmail.com');
fs.writeFileSync('src/pages/Services.tsx', services);
