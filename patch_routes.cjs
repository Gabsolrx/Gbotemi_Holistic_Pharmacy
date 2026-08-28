const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// Import AdminLogin
app = app.replace(
  "import Login from './pages/auth/Login';",
  "import Login from './pages/auth/Login';\nimport AdminLogin from './pages/admin/AdminLogin';"
);

// Route changes
app = app.replace(
  '<Route path="login" element={<Login />} />',
  '<Route path="login" element={<AdminLogin />} />\n          <Route path="user-login" element={<Login />} />'
);

app = app.replace(
  '<Route path="signup" element={<Signup />} />',
  '<Route path="user-signup" element={<Signup />} />'
);

fs.writeFileSync('src/App.tsx', app);
