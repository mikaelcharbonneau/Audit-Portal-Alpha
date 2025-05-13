import { createClient } from '@supabase/supabase-js'

// Get environment variables or provide defaults for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://osovotilbxkrurqbbrxx.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zb3ZvdGlsYnhrcnVycWJicnh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDIyNDksImV4cCI6MjA2MjY3ODI0OX0.oCH9U2z4GpIOoLZpxJ0Li124idiWrV6nbbOKdO6NMtE'

// Debug info
console.log('Supabase URL available:', !!supabaseUrl);
console.log('Supabase Key available:', !!supabaseKey);

export const supabase = createClient(supabaseUrl, supabaseKey)
