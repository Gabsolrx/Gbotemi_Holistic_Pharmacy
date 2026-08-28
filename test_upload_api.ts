import fetch from 'node-fetch';

async function test() {
  const payload = {
    dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
    bucketName: 'prescriptions',
    fileName: 'test.png'
  };

  const res = await fetch('http://localhost:3000/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  const data = await res.text();
  console.log('Status:', res.status);
  console.log('Response:', data);
}

test();
