const fs = require('fs');
let forgot = fs.readFileSync('src/pages/auth/ForgotPassword.tsx', 'utf8');

forgot = forgot.replace('to="/login"', 'to="/user-login"');

fs.writeFileSync('src/pages/auth/ForgotPassword.tsx', forgot);
