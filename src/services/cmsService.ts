import { supabase } from '../lib/supabase';
import { uploadBase64Image } from '../utils/imageUpload';

const CMS_STORAGE_KEY = 'gbotemi-cms-config-v1';

export interface HeroSlide {
  id: number | string;
  title: string;
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
    announcementEnabled: boolean;
    supportEmail: string;
    supportPhone: string;
    deliveryFeeStandard?: number;
    deliveryFeeExpress?: number;
  };
}

const defaultHeroSlides: HeroSlide[] = [
  {
    id: 1,
    title: 'Your Trusted Partner for Genuine Medicines',
    description: 'Order quality healthcare products and medicines conveniently from a trusted pharmacy with fast delivery.',
    image: 'https://lwoyhhkbfmhklqrguuju.supabase.co/storage/v1/object/public/cms/hero_1787874735397_u5n2ac.jpeg',
    primaryCta: { text: 'Shop Healthcare Products', link: '/shop' },
    secondaryCta: { text: 'Talk to a Pharmacist', link: '/consultation' },
    styles: { titleColor: '#ffffff', titleSize: 'text-4xl md:text-5xl lg:text-6xl', titleFont: 'font-sans', descColor: '#e2e8f0' }
  },
  {
    id: 2,
    title: 'Health, Wellness & Vitality',
    description: 'Explore our premium range of vitamins, supplements, and natural wellness products for a healthier you.',
    image: 'https://lwoyhhkbfmhklqrguuju.supabase.co/storage/v1/object/public/cms/hero_1787874741258_xk8q7o.jpeg',
    primaryCta: { text: 'Explore Wellness', link: '/shop' },
    secondaryCta: { text: 'Shop Now', link: '/shop' },
    styles: { titleColor: '#ffffff', titleSize: 'text-4xl md:text-5xl lg:text-6xl', titleFont: 'font-sans', descColor: '#e2e8f0' }
  },
  {
    id: 3,
    title: 'Expert Pharmacist Consultation',
    description: 'Get professional health guidance and compassionate care from our qualified pharmacists from the comfort of your home.',
    image: 'https://lwoyhhkbfmhklqrguuju.supabase.co/storage/v1/object/public/cms/hero_1787874743059_qpxpao.jpeg',
    primaryCta: { text: 'Consult a Pharmacist', link: '/consultation' },
    secondaryCta: { text: 'Learn More', link: '/about' },
    styles: { titleColor: '#ffffff', titleSize: 'text-4xl md:text-5xl lg:text-6xl', titleFont: 'font-sans', descColor: '#e2e8f0' }
  },
  {
    id: 4,
    title: 'Seamless Prescription Assistance',
    description: 'Securely upload your prescriptions and let our expert team handle the rest with care and confidentiality.',
    image: 'https://lwoyhhkbfmhklqrguuju.supabase.co/storage/v1/object/public/cms/hero_1787874744209_rh4iuq.jpeg',
    primaryCta: { text: 'Upload Prescription', link: '/prescription' },
    secondaryCta: { text: 'Contact Us', link: '/contact' },
    styles: { titleColor: '#ffffff', titleSize: 'text-4xl md:text-5xl lg:text-6xl', titleFont: 'font-sans', descColor: '#e2e8f0' }
  },
  {
    id: 5,
    title: 'Family Health & Everyday Care',
    description: 'Discover our comprehensive range of everyday care products designed to keep your family happy and healthy.',
    image: 'https://lwoyhhkbfmhklqrguuju.supabase.co/storage/v1/object/public/cms/hero_1787874749093_9j0v1h.jpeg',
    primaryCta: { text: 'Shop Family Care', link: '/shop' },
    secondaryCta: { text: 'Explore Products', link: '/shop' },
    styles: { titleColor: '#ffffff', titleSize: 'text-4xl md:text-5xl lg:text-6xl', titleFont: 'font-sans', descColor: '#e2e8f0' }
  }
];

const defaultConfig: CmsConfig = {
  heroSlides: defaultHeroSlides,
  faq: [],
  featuredProductOrder: [],
  storeSettings: {
    announcementBar: 'Free delivery on orders above ₦10,000!',
    announcementEnabled: true,
    supportEmail: 'gbotemihpharmacy@gmail.com',
    supportPhone: '+234 802 966 0153',
    deliveryFeeStandard: 1500,
    deliveryFeeExpress: 3000
  }
};

export const cmsService = {
  getInitialConfig: (): CmsConfig => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(CMS_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.heroSlides && parsed.heroSlides.length > 0) {
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
        // Hot-fix legacy links dynamically
        let configStr = JSON.stringify(data.value);
        if (configStr.includes('/upload-prescription')) {
          configStr = configStr.replace(/\/upload-prescription/g, '/prescription');
          data.value = JSON.parse(configStr);
        }
        let parsedVal = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
        const remoteConfig = {
          heroSlides: parsedVal.heroSlides || localConfig.heroSlides,
          faq: parsedVal.faq || localConfig.faq,
          featuredProductOrder: parsedVal.featuredProductOrder || localConfig.featuredProductOrder,
          storeSettings: parsedVal.storeSettings || localConfig.storeSettings
        };
        
        // Cache immediately to localStorage for future instant loads
        try {
          localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(remoteConfig));
        } catch (e) {}

        setTimeout(() => cmsService.syncConfig(localConfig, remoteConfig), 1000);
        return remoteConfig;
      } else {
        setTimeout(() => cmsService.syncConfig(localConfig, null), 1000);
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
