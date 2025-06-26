import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dpxanwgkmomeviolujjp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRweGFud2drbW9tZXZpb2x1ampwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2ODg4MzcsImV4cCI6MjA2NjI2NDgzN30.6Sqo6yjOSc1hlCWywqC3DMmwXhg7K6AQUYWFtwd1LEs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
