import fs from 'fs';
let server = fs.readFileSync('server.ts', 'utf8');
server = server.replace('// removed fs', '');
fs.writeFileSync('server.ts', server);
