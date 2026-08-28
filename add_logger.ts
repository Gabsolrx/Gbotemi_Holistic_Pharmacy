import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');
const script = `<script>window.onerror = function(msg, src, lineno, colno, error) { fetch('/api/log', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({msg, lineno, colno, stack: error?.stack}) }) }; window.onunhandledrejection = function(e) { fetch('/api/log', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({msg: e.reason?.message, stack: e.reason?.stack}) }) };</script>`;
if (!html.includes('/api/log')) {
  html = html.replace('<head>', '<head>' + script);
  fs.writeFileSync('index.html', html);
}
let server = fs.readFileSync('server.ts', 'utf8');
if (!server.includes('/api/log')) {
  server = server.replace('app.get("/api/health"', 'app.post("/api/log", (req, res) => { console.log("CLIENT ERROR:", req.body); res.send("ok"); });\n  app.get("/api/health"');
  fs.writeFileSync('server.ts', server);
}
