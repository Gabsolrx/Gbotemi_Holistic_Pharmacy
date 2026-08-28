import fs from 'fs';

let code = fs.readFileSync('src/pages/auth/Signup.tsx', 'utf8');

const oldSubmit = `    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            phone: data.phone,
          }
        }
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Account created successfully!');
        navigate('/account');
      }
    } catch (error: any) {`;

const newSubmit = `    try {
      // Create user via server API to bypass client-side rate limits
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      
      if (!res.ok || result.error) {
        toast.error(result.error || 'Failed to create account');
        setIsLoading(false);
        return;
      }

      // Automatically sign in the user now that the account is created
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      if (error) {
        toast.error('Account created, but automatic sign-in failed. Please log in.');
        navigate('/login');
      } else {
        toast.success('Account created successfully!');
        navigate('/account');
      }
    } catch (error: any) {`;

if (code.includes('await supabase.auth.signUp')) {
  code = code.replace(oldSubmit, newSubmit);
  fs.writeFileSync('src/pages/auth/Signup.tsx', code);
  console.log('Patched Signup.tsx');
} else {
  console.log('Signup.tsx not matched or already patched.');
}
