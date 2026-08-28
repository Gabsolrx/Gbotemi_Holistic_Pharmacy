import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/console\.error\("Prescription API Error:", error\);/, 'console.error("Prescription API Error:", error); fs.appendFileSync("server_errors.log", "Prescription API Error: " + error.message + "\\n");');
code = code.replace(/console\.error\("Upload Error:", error\);/, 'console.error("Upload Error:", error); fs.appendFileSync("server_errors.log", "Upload Error: " + error.message + "\\n");');

fs.writeFileSync('server.ts', code);
console.log('Added logging to server');
