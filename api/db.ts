import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://osovotilbxkrurqbbrxx.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zb3ZvdGlsYnhrcnVycWJicnh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDIyNDksImV4cCI6MjA2MjY3ODI0OX0.oCH9U2z4GpIOoLZpxJ0Li124idiWrV6nbbOKdO6NMtE';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);