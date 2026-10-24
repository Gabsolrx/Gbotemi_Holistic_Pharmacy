import { supabase } from '../lib/supabase';
import { uploadBase64Image } from '../utils/imageUpload';

const CMS_STORAGE_KEY = 'gbotemi-cms-config-v2';

export interface HeroSlide {
  id: number | string;
  label?: string;
  title: string;
  headlineFirst?: string;
  headlineSecond?: string;
  description: string;
  image: string;
  primaryCta: { text: string; link: string };
  secondaryCta: { text: string; link: string };
  styles?: {
    titleColor: string;
    titleSize: string;
    titleFont: string;
    descColor: string;
  };
}

export interface CmsConfig {
  heroSlides: HeroSlide[];
  faq: { question: string; answer: string }[];
  featuredProductOrder?: string[];
  storeSettings: {
    announcementBar: string;
    announcements?: string[];
    announcementEnabled: boolean;
    supportEmail: string;
    supportPhone: string;
  };
}

const stripDot = (text?: string): string => {
  if (!text) return '';
  return text.replace(/\.+$/, '').trim();
};

export const defaultHeroSlides: HeroSlide[] = [
  {
    id: 1,
    label: 'WELCOME TO GBOTEMI',
    title: 'Your health\nOur priority',
    headlineFirst: 'Your health',
    headlineSecond: 'Our priority',
    description: 'Everyday healthcare, with care you deserve.',
    image: 'https://lwoyhhkbfmhklqrguuju.supabase.co/storage/v1/object/public/cms/hero_1787874735397_u5n2ac.jpeg',
    primaryCta: { text: 'Explore Pharmacy →', link: '/shop' },
    secondaryCta: { text: 'Shop Wellness', link: '/shop?category=Wellness' },
    styles: { titleColor: '#17231E', titleSize: 'text-4xl md:text-5xl lg:text-6xl', titleFont: 'font-sans', descColor: '#65776D' }
  },
  {
    id: 2,
    label: 'PRESCRIPTION MADE SIMPLE',
    title: 'Skip the hassle\nStart online',
    headlineFirst: 'Skip the hassle',
    headlineSecond: 'Start online',
    description: 'Send your prescription from anywhere.',
    image: 'https://lwoyhhkbfmhklqrguuju.supabase.co/storage/v1/object/public/cms/hero_1787874744209_rh4iuq.jpeg',
    primaryCta: { text: 'Get Started →', link: '/prescription' },
    secondaryCta: { text: 'How It Works', link: '/prescription' },
    styles: { titleColor: '#17231E', titleSize: 'text-4xl md:text-5xl lg:text-6xl', titleFont: 'font-sans', descColor: '#65776D' }
  },
  {
    id: 3,
    label: 'CARE BEYOND MEDICINES',
    title: 'Your wellness\nOur priority',
    headlineFirst: 'Your wellness',
    headlineSecond: 'Our priority',
    description: 'Discover wellness essentials and trusted guidance.',
    image: 'https://lwoyhhkbfmhklqrguuju.supabase.co/storage/v1/object/public/cms/hero_consultation_1792847297611.jpeg',
    primaryCta: { text: 'Explore Wellness →', link: '/shop?category=Wellness' },
    secondaryCta: { text: 'Talk to a Pharmacist', link: '/consultation' },
    styles: { titleColor: '#17231E', titleSize: 'text-4xl md:text-5xl lg:text-6xl', titleFont: 'font-sans', descColor: '#65776D' }
  }
];

export const defaultAnnouncements: string[] = [
  'Free delivery on orders above ₦10,000! • Gbotemi Holistic Pharmacy',
  'Upload your prescription online for rapid verification & doorstep dispatch • Gbotemi Care',
  'Need medication advice? Speak directly with our licensed pharmacist • Gbotemi Holistic',
  '100% Genuine, NAFDAC-certified medications & wellness essentials • Gbotemi Pharmacy',
];

export const defaultConfig: CmsConfig = {
  heroSlides: defaultHeroSlides,
  faq: [],
  featuredProductOrder: [],
  storeSettings: {
    announcementBar: defaultAnnouncements[0],
    announcements: defaultAnnouncements,
    announcementEnabled: true,
    supportEmail: 'gbotemihpharmacy@gmail.com',
    supportPhone: '+234 802 966 0153'
  }
};

export const cmsService = {
  getInitialConfig: (): CmsConfig => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(CMS_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.heroSlides && parsed.heroSlides.length === 3 && parsed.heroSlides[0].label) {
            // Normalize headlines without dots
            parsed.heroSlides = parsed.heroSlides.map((s: HeroSlide) => ({
              ...s,
              title: s.title ? s.title.split('\n').map(stripDot).join('\n') : s.title,
              headlineFirst: stripDot(s.headlineFirst),
              headlineSecond: stripDot(s.headlineSecond),
            }));
            return { ...defaultConfig, ...parsed };
          }
        }
      }
    } catch (e) {}
    return defaultConfig;
  },

  getConfig: async (): Promise<CmsConfig> => {
    let localConfig = cmsService.getInitialConfig();

    try {
      const { data, error } = await supabase.from('cms_settings').select('value').eq('key', 'app_config').maybeSingle();
      if (!error && data && data.value) {
        let parsedVal = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
        
        let remoteSlides = parsedVal.heroSlides;
        if (!remoteSlides || remoteSlides.length !== 3 || !remoteSlides[0].label) {
          remoteSlides = defaultHeroSlides;
        } else {
          // Normalize away any trailing periods from remote headlines
          remoteSlides = remoteSlides.map((s: HeroSlide) => ({
            ...s,
            title: s.title ? s.title.split('\n').map(stripDot).join('\n') : s.title,
            headlineFirst: stripDot(s.headlineFirst),
            headlineSecond: stripDot(s.headlineSecond),
          }));
        }

        const remoteConfig: CmsConfig = {
          heroSlides: remoteSlides,
          faq: parsedVal.faq || localConfig.faq,
          featuredProductOrder: parsedVal.featuredProductOrder || localConfig.featuredProductOrder,
          storeSettings: {
            announcementBar: parsedVal.storeSettings?.announcementBar || localConfig.storeSettings.announcementBar,
            announcements: parsedVal.storeSettings?.announcements || defaultAnnouncements,
            announcementEnabled: parsedVal.storeSettings?.announcementEnabled ?? localConfig.storeSettings.announcementEnabled,
            supportEmail: parsedVal.storeSettings?.supportEmail || localConfig.storeSettings.supportEmail,
            supportPhone: parsedVal.storeSettings?.supportPhone || localConfig.storeSettings.supportPhone
          }
        };
        
        try {
          localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(remoteConfig));
        } catch (e) {}

        // Keep remote synchronized with clean normalized headlines
        cmsService.saveConfig(remoteConfig).catch(() => {});

        return remoteConfig;
      } else {
        cmsService.saveConfig(defaultConfig).catch(() => {});
      }
    } catch(err) {}

    return localConfig;
  },

  syncConfig: async (localConfig: CmsConfig, remoteConfig: CmsConfig | null) => {
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
  },

  saveConfig: async (newConfig: CmsConfig): Promise<void> => {
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
  }
};
