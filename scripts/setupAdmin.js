// scripts/setupAdmin.js
// 
// SECURITY NOTICE: 
// This script creates the initial Admin user with the requested default password.
// This script is intended to be run ONCE from a secure backend environment or local terminal
// using the SUPABASE_SERVICE_ROLE_KEY, which can bypass Row Level Security.
// 
// NEVER expose your SUPABASE_SERVICE_ROLE_KEY in the frontend environment (Vite).
// NEVER run this script in the browser.

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables (ensure this is run locally where .env has service_role_key)
dotenv.config();

let SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (SUPABASE_URL && SUPABASE_URL.includes('/rest/v1')) {
  SUPABASE_URL = SUPABASE_URL.split('/rest/v1')[0];
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.");
  console.error("Ensure you are running this securely with administrative privileges.");
  process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  }
});

async function setupAdmin() {
  const adminEmail = 'admin@gbotemi.com';
  // Use the requested default password. 
  // It is injected at runtime and not hardcoded in the frontend.
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'Asiwaju@2';

  console.log(`Setting up initial Admin account for: ${adminEmail}`);

  try {
    // 1. Create the user using Supabase Admin Auth API
    const { data: user, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Auto-confirm for the admin
      user_metadata: {
        role: 'super_admin',
        first_name: 'System',
        last_name: 'Admin'
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('Admin user already exists. Skipping creation.');
      } else {
        throw authError;
      }
    } else {
      console.log('✅ Admin auth record created successfully.');
      
      // 2. Insert into profiles table securely
      if (user?.user) {
        const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
          id: user.user.id,
          email: adminEmail,
          first_name: 'System',
          last_name: 'Admin',
          role: 'super_admin',
          created_at: new Date().toISOString()
        });

        if (profileError) throw profileError;
        console.log('✅ Admin profile record synchronized.');
      }
    }

    console.log('\n======================================================');
    console.log('🎉 Setup Complete!');
    console.log('You can now log in at /admin/login using:');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('IMPORTANT: Please instruct the admin to change this password immediately after the first login.');
    console.log('======================================================\n');

  } catch (err) {
    console.error('❌ Failed to setup admin user:', err);
  }
}

setupAdmin();
