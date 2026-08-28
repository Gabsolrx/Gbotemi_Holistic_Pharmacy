import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

// Replace supabaseKey assignment in upload
code = code.replace(
  /const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;/,
  `const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;`
);

// Do it again for other endpoints
code = code.replace(
  /const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;/g,
  `const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;`
);

fs.writeFileSync('server.ts', code);
console.log('Patched keys');
