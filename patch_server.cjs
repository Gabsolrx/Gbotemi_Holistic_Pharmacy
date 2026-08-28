const fs = require('fs');

let server = fs.readFileSync('server.ts', 'utf8');

server = server.replace(
  'model: "gemini-3.1-pro-preview",',
  'model: "gemini-2.5-flash",'
);

fs.writeFileSync('server.ts', server);
