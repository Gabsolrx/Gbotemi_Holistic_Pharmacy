const fs = require('fs');

let seed = fs.readFileSync('seed_supabase.ts', 'utf8');

seed = seed.replace(
  "import { supabase } from './src/lib/supabase';",
  "import 'dotenv/config';\nimport { createClient } from '@supabase/supabase-js';\n\nconst supabaseUrl = process.env.VITE_SUPABASE_URL;\nconst supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;\nconst supabase = createClient(supabaseUrl, supabaseKey);"
);

fs.writeFileSync('seed_supabase.ts', seed);
