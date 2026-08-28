const fs = require('fs');
let login = fs.readFileSync('src/pages/auth/Login.tsx', 'utf8');

login = login.replace('to="/signup"', 'to="/user-signup"');

fs.writeFileSync('src/pages/auth/Login.tsx', login);
