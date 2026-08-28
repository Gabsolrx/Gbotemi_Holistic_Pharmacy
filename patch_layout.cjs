const fs = require('fs');

let layout = fs.readFileSync('src/components/layout/MainLayout.tsx', 'utf8');

layout = layout.replace(
  "import Footer from './Footer';",
  "import Footer from './Footer';\nimport AlarmManager from '../health-tools/AlarmManager';"
);

layout = layout.replace(
  "<Outlet />",
  "<AlarmManager />\n        <Outlet />"
);

fs.writeFileSync('src/components/layout/MainLayout.tsx', layout);
