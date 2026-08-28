const fs = require('fs');

let protectedRoute = fs.readFileSync('src/components/auth/ProtectedRoute.tsx', 'utf8');
protectedRoute = protectedRoute.replace(/to="\/admin\/login"/g, 'to="/login"');
fs.writeFileSync('src/components/auth/ProtectedRoute.tsx', protectedRoute);

let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace("import AdminLogin from './pages/admin/AdminLogin';\n", "");
app = app.replace('<Route path="admin/login" element={<AdminLogin />} />\n', "");
fs.writeFileSync('src/App.tsx', app);

let login = fs.readFileSync('src/pages/auth/Login.tsx', 'utf8');
const loginLogic = `
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Welcome back!');
        // Check role
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
          if (profile?.role === 'admin' || profile?.role === 'super_admin') {
            navigate(location.state?.from?.pathname?.includes('admin') ? from : '/admin', { replace: true });
            return;
          }
        }
        navigate(from, { replace: true });
      }
`;
login = login.replace(/if \(error\) \{[\s\S]*?navigate\(from, \{ replace: true \}\);\s*\}/, loginLogic.trim());
fs.writeFileSync('src/pages/auth/Login.tsx', login);

