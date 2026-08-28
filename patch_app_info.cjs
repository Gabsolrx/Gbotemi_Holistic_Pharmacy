const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(
  "import About from './pages/About';",
  "import About from './pages/About';\nimport InfoPage from './pages/InfoPage';"
);

app = app.replace(
  '<Route path="about" element={<About />} />',
  '<Route path="about" element={<About />} />\n          <Route path="delivery-information" element={<InfoPage />} />\n          <Route path="faq" element={<InfoPage />} />\n          <Route path="privacy-policy" element={<InfoPage />} />\n          <Route path="terms" element={<InfoPage />} />\n          <Route path="refund-policy" element={<InfoPage />} />'
);

fs.writeFileSync('src/App.tsx', app);
