import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importTarget = "import Profile from './pages/account/Profile';";
const importReplacement = "import Profile from './pages/account/Profile';\nimport Wishlist from './pages/account/Wishlist';";

const routeTarget = `<Route path="profile" element={<Profile />} />`;
const routeReplacement = `<Route path="profile" element={<Profile />} />\n            <Route path="wishlist" element={<Wishlist />} />`;

code = code.replace(importTarget, importReplacement);
code = code.replace(routeTarget, routeReplacement);

fs.writeFileSync('src/App.tsx', code);
console.log('App patched with Wishlist!');
