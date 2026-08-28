import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

const insertBlock = `  app.post("/api/prescriptions", async (req, res) => {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      let supabaseUrl = process.env.VITE_SUPABASE_URL;
      if (supabaseUrl && supabaseUrl.includes('/rest/v1')) { 
         supabaseUrl = supabaseUrl.split('/rest/v1')[0]; 
      }
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      const supabaseAdmin = createClient(supabaseUrl, supabaseKey);
      
      const { error, data } = await supabaseAdmin.from('prescriptions').insert(req.body).select();
      if (error) {
        return res.status(400).json({ error: error.message });
      }
      res.json({ success: true, data });
    } catch (error: any) {
      console.error("Prescription API Error:", error);
      res.status(500).json({ error: "Failed to insert prescription", details: error.message });
    }
  });`;

if (!code.includes('/api/prescriptions')) {
  const insertIndex = code.indexOf('app.post("/api/upload"');
  code = code.substring(0, insertIndex) + insertBlock + "\n\n  " + code.substring(insertIndex);
  fs.writeFileSync('server.ts', code);
  console.log('Added /api/prescriptions route');
} else {
  console.log('Route already exists');
}
