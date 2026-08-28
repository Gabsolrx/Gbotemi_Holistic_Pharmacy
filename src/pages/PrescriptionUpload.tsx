import { supabase } from '../lib/supabase';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload, FileText, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import toast from 'react-hot-toast';
import { uploadProductImage } from '../utils/imageUpload';

const uploadSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  address: z.string().min(5, 'Delivery address is required'),
  notes: z.string().optional(),
});

type UploadFormValues = z.infer<typeof uploadSchema>;

export default function PrescriptionUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
  });

  const onSubmit = async (data: UploadFormValues) => {
    if (!file) {
      toast.error('Please upload a valid prescription image or PDF.');
      return;
    }

    setIsUploading(true);
    
    try {
      let fileUrl = '';
      if (file) {
        const uploadResult = await uploadProductImage(file);
        fileUrl = uploadResult.url;
      } 

      const { data: userResp } = await supabase.auth.getUser();
      
      // Format the WhatsApp message
      const message = `Hello Gbotemi Holistic Pharmacy, I would like to submit a prescription order.

*Patient Details:*
Name: ${data.firstName} ${data.lastName}
Phone: ${data.phone}
Email: ${data.email}
Delivery Address: ${data.address}
${data.notes ? `Notes: ${data.notes}
` : ''}
*Prescription Document:*
${fileUrl}`;

      // Get WhatsApp number from env or fallback
      let phoneNum = import.meta.env.VITE_WHATSAPP_NUMBER || '2348029660153';
      if (phoneNum.startsWith('0')) {
        phoneNum = '234' + phoneNum.substring(1);
      }
      
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${phoneNum}?text=${encodedMessage}`;
      
      // Open WhatsApp in a new tab
      window.open(whatsappUrl, '_blank');
      
      setIsUploading(false);
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      setIsUploading(false);
      toast.error('Failed: ' + (err.message || 'Unknown error'));
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-slate-50 min-h-[70vh] py-12 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-12 max-w-xl w-full text-center">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Prescription Received!</h1>
          <p className="text-gray-600 mb-8 text-lg">
            Our pharmacists are reviewing your prescription. We will contact you shortly with the availability and pricing.
          </p>
          <div className="space-y-4">
            <Button size="lg" className="w-full" onClick={() => navigate('/shop')}>
              Continue Shopping
            </Button>
            
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8 md:py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Upload Your Prescription</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Skip the queue. Upload your doctor's prescription here and our licensed pharmacists will prepare your order for pickup or delivery.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
          {/* Form Side */}
          <div className="p-6 md:p-10 md:w-2/3">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* File Upload Area */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Prescription File (Image or PDF) *</label>
                <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                  file ? 'border-primary-500 bg-primary-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'
                } relative`}>
                  <input 
                    type="file" 
                    accept="image/*,.pdf" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  {file ? (
                    <div className="flex flex-col items-center">
                      <FileText className="text-primary-600 mb-3" size={40} />
                      <span className="text-sm font-bold text-primary-900">{file.name}</span>
                      <span className="text-xs text-primary-600 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      <p className="text-xs text-gray-500 mt-4 underline">Click to change file</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                        <Upload className="text-gray-400" size={28} />
                      </div>
                      <span className="text-sm font-bold text-gray-900">Click to upload or drag and drop</span>
                      <span className="text-xs text-gray-500 mt-1">PNG, JPG, or PDF (max. 10MB)</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="font-bold text-gray-900 mb-4">Patient Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="First Name" placeholder="e.g. Ade" {...register('firstName')} error={errors.firstName?.message} />
                  <Input label="Last Name" placeholder="e.g. Ojo" {...register('lastName')} error={errors.lastName?.message} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <Input label="Email Address" type="email" placeholder="you@example.com" {...register('email')} error={errors.email?.message} />
                  <Input label="Phone Number" placeholder="e.g. 08012345678" {...register('phone')} error={errors.phone?.message} />
                </div>
                <div className="mt-4">
                  <Input label="Delivery Address" placeholder="Street name and house number" {...register('address')} error={errors.address?.message} />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-900 mb-1">Additional Notes (Optional)</label>
                  <textarea 
                    {...register('notes')}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
                    rows={3}
                    placeholder="Any special instructions for the pharmacist?"
                  ></textarea>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full gap-2" isLoading={isUploading}>
                Submit Prescription <ArrowRight size={18} />
              </Button>
            </form>
          </div>

          {/* Info Side */}
          <div className="bg-primary-900 text-white p-6 md:p-10 md:w-1/3 flex flex-col justify-center">
            <h3 className="text-xl font-bold mb-6">How it works</h3>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary-800 flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <h4 className="font-bold mb-1">Upload</h4>
                  <p className="text-primary-100 text-sm leading-relaxed">Snap a clear photo of your valid doctor's prescription and upload it here.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary-800 flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <h4 className="font-bold mb-1">Verification</h4>
                  <p className="text-primary-100 text-sm leading-relaxed">Our licensed pharmacists will review the details to ensure authenticity.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary-800 flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <h4 className="font-bold mb-1">Confirmation</h4>
                  <p className="text-primary-100 text-sm leading-relaxed">We will send you a secure checkout link with the total price and delivery estimate.</p>
                </div>
              </div>
            </div>

            <div className="mt-12 bg-primary-800 rounded-xl p-5 border border-primary-700">
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="text-accent-mustard" />
                <h4 className="font-bold">100% Confidential</h4>
              </div>
              <p className="text-sm text-primary-100">Your medical data is encrypted and strictly handled by certified healthcare professionals.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
