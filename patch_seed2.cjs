const fs = require('fs');

let seed = fs.readFileSync('seed_supabase.ts', 'utf8');

seed = seed.replace(
  "const supabaseUrl = process.env.VITE_SUPABASE_URL;",
  "let supabaseUrl = process.env.VITE_SUPABASE_URL;\nif (supabaseUrl.includes('/rest/v1')) { supabaseUrl = supabaseUrl.split('/rest/v1')[0]; }"
);

fs.writeFileSync('seed_supabase.ts', seed);
