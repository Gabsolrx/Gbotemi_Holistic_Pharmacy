import fs from 'fs';
let server = fs.readFileSync('server.ts', 'utf8');
server = server.replace(
  'console.log("CLIENT ERROR:", req.body);',
  'console.log("CLIENT ERROR:", req.body); fs.appendFileSync("client_errors.log", JSON.stringify(req.body) + "\\n");'
);
fs.writeFileSync('server.ts', server);
