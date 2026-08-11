import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export async function uploadImage(file: File) {
  if (!supabase) return null;

  const extension = file.name.split('.').pop() || 'jpg';
  const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
  const { error } = await supabase.storage.from('uploads').upload(path, file, {
    contentType: file.type,
    upsert: false
  });

  if (error) return null;

  const { data } = supabase.storage.from('uploads').getPublicUrl(path);
  return data.publicUrl;
}
