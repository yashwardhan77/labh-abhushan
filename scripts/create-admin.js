const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Helper to load env variables from .env.local
function loadEnv() {
  const dotenvPath = path.join(__dirname, '../.env.local');
  const env = {};
  if (fs.existsSync(dotenvPath)) {
    const content = fs.readFileSync(dotenvPath, 'utf8');
    content.split('\n').forEach(line => {
      // Remove comments
      const lineWithoutComments = line.split('#')[0].trim();
      if (!lineWithoutComments) return;

      const parts = lineWithoutComments.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        let val = parts.slice(1).join('=').trim();
        // Remove quotes if present
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.substring(1, val.length - 1);
        }
        if (val.startsWith("'") && val.endsWith("'")) {
          val = val.substring(1, val.length - 1);
        }
        env[key] = val;
      }
    });
  }
  return env;
}

async function main() {
  const env = loadEnv();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not defined in .env.local');
    process.exit(1);
  }

  // Get email and password from CLI args or use defaults
  const args = process.argv.slice(2);
  const email = args[0] || 'admin@labhabhushan.com';
  const password = args[1] || 'admin12345';

  console.log(`Connecting to Supabase at: ${supabaseUrl}`);
  console.log(`Creating Admin User: ${email}`);

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const { data, error } = await supabase.auth.admin.createUser({
    email: email.trim(),
    password: password,
    email_confirm: true // Confirm email automatically so you can log in immediately
  });

  if (error) {
    console.error('Failed to create admin user:', error.message);
    process.exit(1);
  }

  console.log('\n=============================================');
  console.log('✅ Admin User Created Successfully!');
  console.log(`Email:    ${data.user.email}`);
  console.log(`Password: ${password}`);
  console.log('=============================================\n');
  console.log('You can now log in at http://localhost:3000/admin/login');
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
