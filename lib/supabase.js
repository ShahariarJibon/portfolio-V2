import { createClient } from "@supabase/supabase-js";

let client = null;

export function getSupabase() {
  if (client) return client;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase credentials missing");
  }
  client = createClient(supabaseUrl, supabaseKey);
  return client;
}
