import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add Navigate to react-router-dom imports
code = code.replace(/import \{ BrowserRouter, Routes, Route \} from 'react-router-dom';/, "import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';");

// If Navigate is already imported or differently:
if (!code.includes('Navigate } from')) {
    code = code.replace(/import \{.*?\} from 'react-router-dom';/, (match) => match.replace('}', ', Navigate }'));
}

// Add the redirect route just above prescription
const targetRoute = `<Route path="prescription" element={<ProtectedRoute><PrescriptionUpload /></ProtectedRoute>} />`;
const replaceRoute = `<Route path="upload-prescription" element={<Navigate to="/prescription" replace />} />\n          <Route path="prescription" element={<ProtectedRoute><PrescriptionUpload /></ProtectedRoute>} />`;

code = code.replace(targetRoute, replaceRoute);

fs.writeFileSync('src/App.tsx', code);
console.log('Redirect added');
