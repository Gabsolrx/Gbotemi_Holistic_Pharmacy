import { useState, useEffect } from 'react';
import { LayoutTemplate, Save, Settings, Megaphone, Image as ImageIcon, GripVertical } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { cmsService, CmsConfig, HeroSlide } from '../../services/cmsService';
import { productService } from '../../services/productService';
import { ProductImageInput } from '../../components/admin/ProductImageInput';
import toast from 'react-hot-toast';

export default function AdminCMS() {
  const [config, setConfig] = useState<CmsConfig | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'hero' | 'homepage'>('general');
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await cmsService.getConfig();
      setConfig(data);
      
      const products = await productService.getProducts({ onlyActive: true });
      const featured = products.filter(p => p.featured);
      
      // Sort by saved order
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

  const handleHeroStyleChange = (index: number, field: string, value: string) => {
    if (!config) return;
    const newSlides = [...config.heroSlides];
    const currentStyles = newSlides[index].styles || {
      titleColor: '#0f172a',
      titleSize: 'text-4xl md:text-5xl lg:text-6xl',
      titleFont: 'font-sans',
      descColor: '#334155'
    };
    newSlides[index] = { 
      ...newSlides[index], 
      styles: { ...currentStyles, [field]: value } 
    };
    setConfig({ ...config, heroSlides: newSlides });
  };

  const handleSave = async () => {
    if (!config) return;
    setIsSaving(true);
    try {
      // Save product order
      const newConfig = {
        ...config,
        featuredProductOrder: featuredProducts.map(p => p.id)
      };
      await cmsService.saveConfig(newConfig);
      setConfig(newConfig);
      toast.success('CMS configuration updated successfully');
    } catch (e) {
      toast.error('Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  // Drag and Drop handlers
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
    e.preventDefault(); // necessary to allow dropping
  };

  if (!config) {
    return <div className="p-8 text-center text-slate-500">Loading CMS configuration...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Website Content CMS</h1>
          <p className="text-slate-500 mt-1">Edit homepage text, banners, and store settings.</p>
        </div>
        <Button onClick={handleSave} isLoading={isSaving} className="gap-2 shadow-sm">
          <Save size={18} /> Save Changes
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Col: Menu/Tabs */}
        <div className="md:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab('general')}
            className={`w-full text-left px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition-colors ${
              activeTab === 'general' ? 'bg-primary-50 text-primary-700' : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            <Settings size={18} /> General Settings
          </button>
          <button 
            onClick={() => setActiveTab('hero')}
            className={`w-full text-left px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition-colors ${
              activeTab === 'hero' ? 'bg-primary-50 text-primary-700' : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            <Megaphone size={18} /> Hero Banner
          </button>
          <button 
            onClick={() => setActiveTab('homepage')}
            className={`w-full text-left px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition-colors ${
              activeTab === 'homepage' ? 'bg-primary-50 text-primary-700' : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            <LayoutTemplate size={18} /> Homepage Content
          </button>
        </div>

        {/* Right Col: Form */}
        <div className="md:col-span-2 space-y-6">
          
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
                  
                  <Input 
                    label="Announcement Text" 
                    name="announcementBar" 
                    value={config.storeSettings.announcementBar}
                    onChange={handleChange}
                    placeholder="e.g. Free shipping on orders over $50!"
                    disabled={!config.storeSettings.announcementEnabled}
                  />
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

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                  <h2 className="font-bold text-slate-900">Delivery Settings</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Configure default delivery fees for the store checkout.</p>
                </div>
                <div className="p-6 space-y-5">
                  <Input 
                    label="Standard Delivery Fee (₦)" 
                    name="deliveryFeeStandard" 
                    type="number"
                    value={config.storeSettings.deliveryFeeStandard ?? 1500}
                    onChange={handleChange}
                  />
                  <Input 
                    label="Express Delivery Fee (₦)" 
                    name="deliveryFeeExpress" 
                    type="number"
                    value={config.storeSettings.deliveryFeeExpress ?? 3000}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'hero' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <h2 className="font-bold text-slate-900">Hero Banner Configuration</h2>
                <p className="text-xs text-slate-500 mt-0.5">Update the main image and text on the home page.</p>
              </div>
              <div className="p-6 space-y-6">
                {config.heroSlides.map((slide, index) => (
                  <div key={slide.id} className="space-y-5">
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">Background Image URL</label>
                      <ProductImageInput 
                        value={slide.image}
                        onChange={(newUrl) => handleHeroChange(index, 'image', newUrl)}
                      />
                      <p className="text-xs text-slate-500 mt-2">Recommended size: 1600px × 600px. High-resolution landscape image.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
                      <div className="md:col-span-2 space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Headline</label>
                        <textarea 
                          value={slide.title}
                          onChange={(e) => handleHeroChange(index, 'title', e.target.value)}
                          className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                          rows={2}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Headline Color</label>
                        <div className="flex gap-2 items-center">
                           <input 
                             type="color" 
                             value={slide.styles?.titleColor || '#0f172a'}
                             onChange={(e) => handleHeroStyleChange(index, 'titleColor', e.target.value)}
                             className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                           />
                           <input 
                             type="text"
                             value={slide.styles?.titleColor || '#0f172a'}
                             onChange={(e) => handleHeroStyleChange(index, 'titleColor', e.target.value)}
                             className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 uppercase font-mono"
                           />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Headline Font Family</label>
                        <select 
                          value={slide.styles?.titleFont || 'font-sans'}
                          onChange={(e) => handleHeroStyleChange(index, 'titleFont', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                        >
                          <option value="font-sans">Default Sans</option>
                          <option value="font-serif">Serif (Elegant)</option>
                          <option value="font-mono">Monospace</option>
                        </select>
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-2 pt-2">
                      <label className="block text-sm font-medium text-slate-700">Subheadline / Description</label>
                      <textarea 
                        value={slide.description}
                        onChange={(e) => handleHeroChange(index, 'description', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        rows={2}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">Subheadline Color</label>
                      <div className="flex gap-2 items-center">
                         <input 
                           type="color" 
                           value={slide.styles?.descColor || '#334155'}
                           onChange={(e) => handleHeroStyleChange(index, 'descColor', e.target.value)}
                           className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                         />
                         <input 
                           type="text"
                           value={slide.styles?.descColor || '#334155'}
                           onChange={(e) => handleHeroStyleChange(index, 'descColor', e.target.value)}
                           className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 uppercase font-mono"
                         />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Primary Button Text</label>
                        <input
                          type="text"
                          value={slide.primaryCta.text}
                          onChange={(e) => handleHeroChange(index, 'primaryCta', { ...slide.primaryCta, text: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                          placeholder="e.g. Shop Now"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Primary Button Link</label>
                        <input
                          type="text"
                          value={slide.primaryCta.link}
                          onChange={(e) => handleHeroChange(index, 'primaryCta', { ...slide.primaryCta, link: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                          placeholder="e.g. /shop"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Secondary Button Text</label>
                        <input
                          type="text"
                          value={slide.secondaryCta?.text || ''}
                          onChange={(e) => handleHeroChange(index, 'secondaryCta', { ...slide.secondaryCta, text: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                          placeholder="e.g. Learn More (Optional)"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Secondary Button Link</label>
                        <input
                          type="text"
                          value={slide.secondaryCta?.link || ''}
                          onChange={(e) => handleHeroChange(index, 'secondaryCta', { ...slide.secondaryCta, link: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                          placeholder="e.g. /about"
                        />
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
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
                        <div className="text-slate-400">
                          <GripVertical size={20} />
                        </div>
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
