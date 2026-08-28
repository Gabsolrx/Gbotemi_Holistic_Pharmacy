const fs = require('fs');
let server = fs.readFileSync('server.ts', 'utf8');
server = server.replace(
  'model: "gemini-2.5-flash",',
  'model: "gemini-3.6-flash",'
);
fs.writeFileSync('server.ts', server);
