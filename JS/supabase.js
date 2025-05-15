import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vhswdfifhhcqmtpnhoso.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoc3dkZmlmaGhjcW10cG5ob3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4NTUzMDksImV4cCI6MjA2MDQzMTMwOX0.Q50xEMRQLTjuOKtn0f92GX5NKY9GgWWYVfHlmE5yhUs'

export const supabase = createClient(supabaseUrl, supabaseKey) 