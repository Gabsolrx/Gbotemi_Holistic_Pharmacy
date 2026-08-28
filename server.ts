import fs from "fs";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // API Routes will go here

    


  app.post("/api/upload", async (req, res) => {
    try {
      const { dataUrl, bucketName, fileName } = req.body;
      
      if (!dataUrl || !bucketName || !fileName) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      const { createClient } = await import("@supabase/supabase-js");
      let supabaseUrl = process.env.VITE_SUPABASE_URL;
      if (supabaseUrl && supabaseUrl.includes('/rest/v1')) { 
        supabaseUrl = supabaseUrl.split('/rest/v1')[0]; 
      }
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Convert base64 to buffer
      const matches = dataUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: "Invalid base64 format" });
      }
      
      const contentType = matches[1];
      const buffer = Buffer.from(matches[2], 'base64');
      
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, buffer, {
          contentType,
          upsert: true
        });
        
      if (error) {
        throw error;
      }
      
      const { data: publicData } = supabase.storage.from(bucketName).getPublicUrl(fileName);
      
      res.json({ url: publicData.publicUrl });
    } catch (error: any) {
      console.error("Upload Error:", error); fs.appendFileSync("server_errors.log", "Upload Error: " + error.message + "\n");
      res.status(500).json({ error: "Failed to upload image", details: error.message });
    }
  });

  app.post("/api/log", (req, res) => { console.log("CLIENT ERROR:", req.body); fs.appendFileSync("client_errors.log", JSON.stringify(req.body) + "\n"); res.send("ok"); });
  
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabaseUrl = process.env.VITE_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
      
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

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      
      const { GoogleGenAI } = await import("@google/genai");
      
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      
      let contents = [];
      if (history && Array.isArray(history)) {
        contents = history.map((msg: any) => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }));
      }
      contents.push({ role: 'user', parts: [{ text: message }] });

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: contents,
        config: {
          systemInstruction: "You are a helpful, professional, and empathetic AI assistant for Gbotemi Holistic Pharmacy. You can answer general health questions, explain our holistic services, and guide users to features like the BMI calculator, Blood Pressure tracker, or prescription uploads. Do not provide definitive medical diagnoses.",
        }
      });

      res.json({ response: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Failed to generate response", details: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
