import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { cmsService, CmsConfig, HeroSlide } from '../../services/cmsService';
import { productService } from '../../services/productService';
import { ProductImageInput } from '../../components/admin/ProductImageInput';
import toast from 'react-hot-toast';

export default function AdminCMS() {
  const [config, setConfig] = useState<CmsConfig | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'hero' | 'homepage'>('hero');
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await cmsService.getConfig();
      setConfig(data);
      
      const products = await productService.getProducts({ onlyActive: true });
      const featured = products.filter(p => p.featured);
      
      if (data.featuredProductOrder && data.featuredProductOrder.length > 0) {
        featured.sort((a, b) => {
          const idxA = data.featuredProductOrder!.indexOf(a.id);
          const idxB = data.featuredProductOrder!.indexOf(b.id);
          if (idxA === -1 && idxB === -1) return 0;
          if (idxA === -1) return 1;
          if (idxB === -1) return -1;
          return idxA - idxB;
        });
      }
      setFeaturedProducts(featured);
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!config) return;
    const { name, value, type, checked } = e.target;
    
    let parsedValue: any = value;
    if (type === 'checkbox') parsedValue = checked;
    else if (type === 'number') parsedValue = value === '' ? '' : Number(value);

    setConfig({
      ...config,
      storeSettings: {
        ...config.storeSettings,
        [name]: parsedValue
      }
    });
  };

  const handleHeroChange = (index: number, field: keyof HeroSlide, value: any) => {
    if (!config) return;
    const newSlides = [...config.heroSlides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    setConfig({ ...config, heroSlides: newSlides });
  };

  const handleSave = async () => {
    if (!config) return;
    setIsSaving(true);
    try {
      const sanitizedSlides = config.heroSlides.map(slide => {
        const parts = slide.title ? slide.title.split('\n') : [];
        const cleanFirst = (slide.headlineFirst || parts[0] || '').replace(/\.+$/, '').trim();
        const cleanSecond = (slide.headlineSecond || parts[1] || '').replace(/\.+$/, '').trim();
        return {
          ...slide,
          headlineFirst: cleanFirst,
          headlineSecond: cleanSecond,
          title: `${cleanFirst}\n${cleanSecond}`.trim(),
        };
      });

      const newConfig = {
        ...config,
        heroSlides: sanitizedSlides,
        featuredProductOrder: featuredProducts.map(p => p.id)
      };
      await cmsService.saveConfig(newConfig);
      setConfig(newConfig);
      toast.success('Hero banner and CMS updated globally in database');
    } catch (e) {
      toast.error('Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (sourceIndex === targetIndex) return;

    const newFeatured = [...featuredProducts];
    const [draggedItem] = newFeatured.splice(sourceIndex, 1);
    newFeatured.splice(targetIndex, 0, draggedItem);
    
    setFeaturedProducts(newFeatured);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  if (!config) {
    return <div className="p-8 text-center text-slate-500">Loading CMS configuration...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Website Content CMS</h1>
          <p className="text-slate-500 mt-1">Edit hero banner slides, announcements, and store settings.</p>
        </div>
        <Button onClick={handleSave} isLoading={isSaving} className="shadow-sm font-semibold">
          Save Changes
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Navigation Tabs (No Icons) */}
        <div className="md:col-span-1 space-y-2">
          <button 
            type="button"
            onClick={() => setActiveTab('hero')}
            className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'hero' ? 'bg-primary-50 text-primary-700 font-bold border border-primary-200' : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            Hero Banner (3 Slides)
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('general')}
            className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'general' ? 'bg-primary-50 text-primary-700 font-bold border border-primary-200' : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            General Settings
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('homepage')}
            className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'homepage' ? 'bg-primary-50 text-primary-700 font-bold border border-primary-200' : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            Homepage Content
          </button>
        </div>

        {/* Right Column: Form (No Icons) */}
        <div className="md:col-span-2 space-y-6">
          
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <p className="text-xs font-semibold text-[#064E3B] uppercase tracking-wide">
                  Global Hero Slider Synchronization
                </p>
                <p className="text-xs text-[#064E3B]/80 mt-1">
                  Changes saved here immediately sync to the Supabase database and update the live website hero carousel in real-time.
                </p>
              </div>

              {config.heroSlides.map((slide, index) => (
                <div key={slide.id || index} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-2.5 py-1 rounded-md">
                      Slide 0{index + 1}
                    </span>
                    <span className="text-xs text-slate-400">
                      ID: {slide.id}
                    </span>
                  </div>

                  {/* Label */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Slide Service Label</label>
                    <input
                      type="text"
                      value={slide.label || ''}
                      onChange={(e) => handleHeroChange(index, 'label', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm font-medium"
                      placeholder="e.g. WELCOME TO GBOTEMI"
                    />
                  </div>

                  {/* Headline */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Headline (Line 1 & Line 2)</label>
                    <textarea 
                      value={slide.title}
                      onChange={(e) => {
                        handleHeroChange(index, 'title', e.target.value);
                        const parts = e.target.value.split('\n');
                        handleHeroChange(index, 'headlineFirst', parts[0] || '');
                        handleHeroChange(index, 'headlineSecond', parts[1] || '');
                      }}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                      rows={2}
                      placeholder="Line 1&#10;Line 2"
                    />
                    <p className="text-[11px] text-slate-400">Put each headline line on a new row (e.g. "Your health" on row 1, "Our priority" on row 2 — without trailing full stops).</p>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Description</label>
                    <textarea 
                      value={slide.description}
                      onChange={(e) => handleHeroChange(index, 'description', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                      rows={2}
                    />
                  </div>

                  {/* Background Image */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Background Image</label>
                    <ProductImageInput 
                      value={slide.image}
                      onChange={(newUrl) => handleHeroChange(index, 'image', newUrl)}
                    />
                  </div>

                  {/* CTAs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase">Primary CTA Text</label>
                      <input
                        type="text"
                        value={slide.primaryCta?.text || ''}
                        onChange={(e) => handleHeroChange(index, 'primaryCta', { ...slide.primaryCta, text: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase">Primary CTA Link</label>
                      <input
                        type="text"
                        value={slide.primaryCta?.link || ''}
                        onChange={(e) => handleHeroChange(index, 'primaryCta', { ...slide.primaryCta, link: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase">Secondary CTA Text</label>
                      <input
                        type="text"
                        value={slide.secondaryCta?.text || ''}
                        onChange={(e) => handleHeroChange(index, 'secondaryCta', { ...slide.secondaryCta, text: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase">Secondary CTA Link</label>
                      <input
                        type="text"
                        value={slide.secondaryCta?.link || ''}
                        onChange={(e) => handleHeroChange(index, 'secondaryCta', { ...slide.secondaryCta, link: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                      />
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

          {activeTab === 'general' && (
            <>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                  <h2 className="font-bold text-slate-900">Announcement Bar</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Displays at the very top of the website.</p>
                </div>
                <div className="p-6 space-y-5">
                  <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                    <input 
                      type="checkbox" 
                      name="announcementEnabled"
                      checked={config.storeSettings.announcementEnabled}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="font-medium text-slate-700 text-sm">Enable Announcement Bar</span>
                  </label>
                  
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      Rotating Announcements (One per line)
                    </label>
                    <textarea
                      rows={4}
                      value={(config.storeSettings.announcements && config.storeSettings.announcements.length > 0
                        ? config.storeSettings.announcements
                        : [config.storeSettings.announcementBar || 'Free delivery on orders above ₦10,000! • Gbotemi Holistic Pharmacy']
                      ).join('\n')}
                      onChange={(e) => {
                        const lines = e.target.value.split('\n');
                        setConfig({
                          ...config,
                          storeSettings: {
                            ...config.storeSettings,
                            announcements: lines,
                            announcementBar: lines[0] || config.storeSettings.announcementBar,
                          }
                        });
                      }}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm font-sans leading-relaxed"
                      placeholder="Enter announcement messages, one per line"
                      disabled={!config.storeSettings.announcementEnabled}
                    />
                    <p className="text-[11px] text-slate-400">
                      These messages rotate automatically at intervals from left to right across the top announcement bar.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                  <h2 className="font-bold text-slate-900">Contact Information</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Used in the footer and contact pages.</p>
                </div>
                <div className="p-6 space-y-5">
                  <Input 
                    label="Support Email" 
                    name="supportEmail" 
                    type="email"
                    value={config.storeSettings.supportEmail}
                    onChange={handleChange}
                  />
                  <Input 
                    label="Support Phone" 
                    name="supportPhone" 
                    value={config.storeSettings.supportPhone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'homepage' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <h2 className="font-bold text-slate-900">Featured Products Order</h2>
                <p className="text-xs text-slate-500 mt-0.5">Drag and drop to rearrange the order of featured products on the homepage.</p>
              </div>
              <div className="p-6">
                {featuredProducts.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">No featured products found. Mark products as "Featured" in the Products page.</p>
                ) : (
                  <div className="space-y-2">
                    {featuredProducts.map((product, index) => (
                      <div 
                        key={product.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragOver={handleDragOver}
                        className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl cursor-grab active:cursor-grabbing hover:border-primary-300 hover:shadow-sm transition-all"
                      >
                        <span className="text-xs font-mono font-bold text-slate-400 w-6">
                          0{index + 1}
                        </span>
                        <img 
                          src={product.imageUrl || product.image_url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=100&h=100'} 
                          alt={product.name} 
                          className="w-10 h-10 rounded object-cover border border-slate-100" 
                        />
                        <div>
                          <p className="font-medium text-slate-900 text-sm">{product.name}</p>
                          <p className="text-xs text-slate-500">{product.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
