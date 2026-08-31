import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jjyhflithfnndkoqbff.supabase.co';

const supabaseKey =
  'sb_publishable_aULuv65v5MtUnCRPEZ75kA_yxgX5Ji2';

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);
