const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');

// Wrap Checkout
app = app.replace(
  '<Route path="checkout" element={<Checkout />} />',
  '<Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />'
);

// Wrap Consultation
app = app.replace(
  '<Route path="consultation" element={<Consultation />} />',
  '<Route path="consultation" element={<ProtectedRoute><Consultation /></ProtectedRoute>} />'
);

// Wrap Prescription
app = app.replace(
  '<Route path="prescription" element={<PrescriptionUpload />} />',
  '<Route path="prescription" element={<ProtectedRoute><PrescriptionUpload /></ProtectedRoute>} />'
);

fs.writeFileSync('src/App.tsx', app);
