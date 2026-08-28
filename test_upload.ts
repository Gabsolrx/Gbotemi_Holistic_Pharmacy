import fetch from 'node-fetch';

async function test() {
  const payload = {
    customer_notes: JSON.stringify({ firstName: 'Test', lastName: 'User', phone: '1234567', email: 'test@example.com' }),
    file_url: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=800&q=80',
    status: 'pending',
    user_id: null
  };

  const res = await fetch('http://localhost:3000/api/prescriptions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  const data = await res.text();
  console.log('Status:', res.status);
  console.log('Response:', data);
}

test();
