import fs from 'fs';

let code = fs.readFileSync('server.ts', 'utf8');

const signupEndpoint = `
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabaseUrl = process.env.VITE_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        return res.status(500).json({ error: "Missing Supabase admin credentials" });
      }

      // Fix URL if it has /rest/v1
      const cleanUrl = supabaseUrl.includes('/rest/v1') ? supabaseUrl.split('/rest/v1')[0] : supabaseUrl;
      const supabaseAdmin = createClient(cleanUrl, supabaseKey);

      const { email, password, firstName, lastName, phone } = req.body;

      // Admin create user to bypass rate limits
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm
        user_metadata: {
          first_name: firstName,
          last_name: lastName,
          phone: phone,
        }
      });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.json({ user: data.user });
    } catch (error: any) {
      console.error("Signup API Error:", error);
      res.status(500).json({ error: "Failed to create user", details: error.message });
    }
  });
`;

if (!code.includes('/api/auth/signup')) {
  code = code.replace('app.get("/api/health"', signupEndpoint + '\n  app.get("/api/health"');
  fs.writeFileSync('server.ts', code);
  console.log('Patched server.ts with /api/auth/signup');
} else {
  console.log('Already patched.');
}
