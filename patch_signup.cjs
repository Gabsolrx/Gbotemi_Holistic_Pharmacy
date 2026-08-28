const fs = require('fs');
let signup = fs.readFileSync('src/pages/auth/Signup.tsx', 'utf8');

signup = signup.replace('to="/login"', 'to="/user-login"');

fs.writeFileSync('src/pages/auth/Signup.tsx', signup);
