import fs from 'fs';

const content = `import { supabase } from '../lib/supabase';
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
  };
}

const defaultHeroSlides: HeroSlide[] = [
  {
    id: 1,
    title: 'Genuine Medicines & Healthcare',
    description: 'Order quality healthcare products and medicines conveniently from a trusted pharmacy with fast delivery.',
    image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&q=80&w=1600&h=600',
    primaryCta: { text: 'Shop Healthcare Products', link: '/shop' },
    secondaryCta: { text: '', link: '' },
    styles: { titleColor: '#ffffff', titleSize: 'text-4xl md:text-5xl lg:text-6xl', titleFont: 'font-sans', descColor: '#e2e8f0' }
  },
  {
    id: 2,
    title: 'Health, Wellness & Vitality',
    description: 'Explore our premium range of vitamins, supplements, and natural wellness products for a healthier you.',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1600&h=600',
    primaryCta: { text: 'Explore Wellness', link: '/shop' },
    secondaryCta: { text: 'Shop Now', link: '/shop' },
    styles: { titleColor: '#ffffff', titleSize: 'text-4xl md:text-5xl lg:text-6xl', titleFont: 'font-sans', descColor: '#e2e8f0' }
  },
  {
    id: 3,
    title: 'Expert Pharmacist Consultation',
    description: 'Get professional health guidance and compassionate care from our qualified pharmacists from the comfort of your home.',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1600&h=600',
    primaryCta: { text: 'Consult a Pharmacist', link: '/consultation' },
    secondaryCta: { text: 'Learn More', link: '/about' },
    styles: { titleColor: '#ffffff', titleSize: 'text-4xl md:text-5xl lg:text-6xl', titleFont: 'font-sans', descColor: '#e2e8f0' }
  },
  {
    id: 4,
    title: 'Seamless Prescription Assistance',
    description: 'Securely upload your prescriptions and let our expert team handle the rest with care and confidentiality.',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=1600&h=600',
    primaryCta: { text: 'Upload Prescription', link: '/upload-prescription' },
    secondaryCta: { text: 'Contact Us', link: '/contact' },
    styles: { titleColor: '#ffffff', titleSize: 'text-4xl md:text-5xl lg:text-6xl', titleFont: 'font-sans', descColor: '#e2e8f0' }
  },
  {
    id: 5,
    title: 'Family Health & Everyday Care',
    description: 'Discover our comprehensive range of everyday care products designed to keep your family happy and healthy.',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=1600&h=600',
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
    supportPhone: '+234 800 000 0000'
  }
};

export const cmsService = {
  getConfig: async (): Promise<CmsConfig> => {
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
    } catch (e) {
      console.warn('Failed to parse CMS config', e);
    }

    try {
      const { data, error } = await supabase.from('cms_settings').select('*').limit(1).maybeSingle();
      if (!error && data) {
         const remoteConfig = {
           heroSlides: data.hero_slides || localConfig.heroSlides,
           faq: data.faq || localConfig.faq,
           featuredProductOrder: data.featured_product_order || localConfig.featuredProductOrder,
           storeSettings: data.store_settings || localConfig.storeSettings
         };
         
         // Background sync image uploads for local hero slides if they differ or have base64
         setTimeout(() => cmsService.syncConfig(localConfig, remoteConfig, data.id), 1000);
         
         return remoteConfig;
      } else {
         // Create initial remote config
         setTimeout(() => cmsService.syncConfig(localConfig, null, null), 1000);
      }
    } catch(err) {
       console.warn('Supabase CMS config fetch failed:', err);
    }

    return localConfig;
  },

  syncConfig: async (localConfig: CmsConfig, remoteConfig: CmsConfig | null, remoteId: string | null) => {
    try {
      let needsUpdate = false;
      const configToSync = remoteConfig ? { ...remoteConfig } : { ...localConfig };
      
      // Check for base64 images in hero slides
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
        const payload = {
          hero_slides: configToSync.heroSlides,
          faq: configToSync.faq,
          featured_product_order: configToSync.featuredProductOrder,
          store_settings: configToSync.storeSettings
        };
        
        if (remoteId) {
          await supabase.from('cms_settings').update(payload).eq('id', remoteId);
        } else {
          await supabase.from('cms_settings').insert([payload]);
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
      // 1. Process base64 images before saving
      for (let i = 0; i < newConfig.heroSlides.length; i++) {
        const slide = newConfig.heroSlides[i];
        if (slide.image && slide.image.startsWith('data:image/')) {
           slide.image = await uploadBase64Image(slide.image, 'cms', 'hero');
        }
      }

      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(newConfig));
      
      const payload = {
        hero_slides: newConfig.heroSlides,
        faq: newConfig.faq,
        featured_product_order: newConfig.featuredProductOrder,
        store_settings: newConfig.storeSettings
      };

      const { data } = await supabase.from('cms_settings').select('id').limit(1).maybeSingle();
      if (data && data.id) {
        await supabase.from('cms_settings').update(payload).eq('id', data.id);
      } else {
        await supabase.from('cms_settings').insert([payload]);
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
`;
fs.writeFileSync('src/services/cmsService.ts', content);
