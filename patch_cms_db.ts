import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.log("No supabase env vars");
  process.exit(1);
}

let properUrl = url;
if (properUrl.includes('/rest/v1')) properUrl = properUrl.split('/rest/v1')[0];

const supabase = createClient(properUrl, key);

async function run() {
  const { data, error } = await supabase.from('cms_settings').select('*').eq('key', 'app_config').maybeSingle();
  if (data && data.value) {
    let changed = false;
    const config = data.value;
    
    if (config.heroSlides) {
      config.heroSlides.forEach((slide: any) => {
        if (slide.primaryCta && slide.primaryCta.link === '/upload-prescription') {
          slide.primaryCta.link = '/prescription';
          changed = true;
        }
      });
    }
    
    if (changed) {
      const { error: updateErr } = await supabase.from('cms_settings').update({ value: config }).eq('key', 'app_config');
      console.log('CMS db updated:', updateErr ? updateErr.message : 'Success');
    } else {
      console.log('No /upload-prescription link found in CMS db');
    }
  } else {
    console.log('No CMS config in db or error:', error?.message);
  }
}
run();
