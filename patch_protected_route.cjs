const fs = require('fs');
let route = fs.readFileSync('src/components/auth/ProtectedRoute.tsx', 'utf8');

route = route.replace(
  'return <Navigate to="/login" state={{ from: location }} replace />;',
  'return <Navigate to="/login" state={{ from: location }} replace />;'
);

// Actually let's just replace the whole file since it's short.
