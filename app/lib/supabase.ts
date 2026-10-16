import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Ortam değişkenleri tanımlı mı? (Tanımlı değilse üyelik formu kibar bir uyarı gösterir)
export const isSupabaseConfigured = Boolean(url && key);

// Değişkenler yokken bile derleme çökmesin diye geçici değerler verilir.
// Gerçek istekler sadece isSupabaseConfigured true iken yapılır.
export const supabase = createClient(
  url ?? 'http://localhost:54321',
  key ?? 'tanimsiz-anahtar'
);
