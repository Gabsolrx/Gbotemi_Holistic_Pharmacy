import fs from 'fs';
let code = fs.readFileSync('src/services/cmsService.ts', 'utf8');

// replace getConfig
const newGetConfig = `  getConfig: async (): Promise<CmsConfig> => {
    let localConfig = defaultConfig;
    try {
      const stored = localStorage.getItem(CMS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.heroSlides && parsed.heroSlides.length < defaultHeroSlides.length) {
          const mergedSlides = [...defaultHeroSlides];
          parsed.heroSlides.forEach((slide: any, index: number) => {
            mergedSlides[index] = slide;
          });
          parsed.heroSlides = mergedSlides;
        }
        localConfig = { ...defaultConfig, ...parsed };
      }
    } catch (e) {}

    try {
      const { data, error } = await supabase.from('cms_settings').select('value').eq('key', 'app_config').maybeSingle();
      if (!error && data && data.value) {
         let parsedVal = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
         const remoteConfig = {
           heroSlides: parsedVal.heroSlides || localConfig.heroSlides,
           faq: parsedVal.faq || localConfig.faq,
           featuredProductOrder: parsedVal.featuredProductOrder || localConfig.featuredProductOrder,
           storeSettings: parsedVal.storeSettings || localConfig.storeSettings
         };
         
         setTimeout(() => cmsService.syncConfig(localConfig, remoteConfig), 1000);
         return remoteConfig;
      } else {
         setTimeout(() => cmsService.syncConfig(localConfig, null), 1000);
      }
    } catch(err) {}

    return localConfig;
  },`;

// replace syncConfig
const newSyncConfig = `  syncConfig: async (localConfig: CmsConfig, remoteConfig: CmsConfig | null) => {
    try {
      let needsUpdate = false;
      const configToSync = remoteConfig ? { ...remoteConfig } : { ...localConfig };
      
      for (let i = 0; i < configToSync.heroSlides.length; i++) {
        const slide = configToSync.heroSlides[i];
        if (slide.image && slide.image.startsWith('data:image/')) {
           const newUrl = await uploadBase64Image(slide.image, 'cms', 'hero');
           if (newUrl !== slide.image) {
             slide.image = newUrl;
             needsUpdate = true;
           }
        }
      }
      
      if (!remoteConfig || needsUpdate) {
        const { data } = await supabase.from('cms_settings').select('id').eq('key', 'app_config').maybeSingle();
        const strValue = JSON.stringify(configToSync);
        if (data && data.id) {
          await supabase.from('cms_settings').update({ value: strValue }).eq('id', data.id);
        } else {
          await supabase.from('cms_settings').insert([{ key: 'app_config', value: strValue }]);
        }
        
        localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(configToSync));
        if (typeof window !== 'undefined') window.dispatchEvent(new Event('cms-updated'));
      }
    } catch(err) {
      console.error('Failed background sync of CMS config:', err);
    }
  },`;

// replace saveConfig
const newSaveConfig = `  saveConfig: async (newConfig: CmsConfig): Promise<void> => {
    try {
      for (let i = 0; i < newConfig.heroSlides.length; i++) {
        const slide = newConfig.heroSlides[i];
        if (slide.image && slide.image.startsWith('data:image/')) {
           slide.image = await uploadBase64Image(slide.image, 'cms', 'hero');
        }
      }

      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(newConfig));
      
      const { data } = await supabase.from('cms_settings').select('id').eq('key', 'app_config').maybeSingle();
      const strValue = JSON.stringify(newConfig);
      
      if (data && data.id) {
        await supabase.from('cms_settings').update({ value: strValue }).eq('id', data.id);
      } else {
        await supabase.from('cms_settings').insert([{ key: 'app_config', value: strValue }]);
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('cms-updated'));
      }
    } catch (e) {
      console.error('Failed to save CMS config', e);
      throw e;
    }
  }`;

// Regex to replace methods
code = code.replace(/getConfig:\s*async\s*\(\):\s*Promise<CmsConfig>\s*=>\s*\{[\s\S]*?syncConfig:/, newGetConfig + '\n\n' + '  syncConfig:');
code = code.replace(/syncConfig:\s*async\s*\([\s\S]*?saveConfig:/, newSyncConfig + '\n\n' + '  saveConfig:');
code = code.replace(/saveConfig:\s*async\s*\([\s\S]*?\}\s*\};\s*$/m, newSaveConfig + '\n};\n');

fs.writeFileSync('src/services/cmsService.ts', code);
