async function run() {
  const url = process.env.VITE_SUPABASE_URL || '';
  const res = await fetch(url, { headers: { 'apikey': process.env.VITE_SUPABASE_ANON_KEY || '' } });
  const text = await res.text();
  console.log(text.substring(0, 500));
}
run();
