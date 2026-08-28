import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calendar, Clock, Video, User, CheckCircle2, ArrowRight, Phone, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import toast from 'react-hot-toast';

const consultationSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  medium: z.string().min(1, 'Please select a consultation medium'),
  date: z.string().min(1, 'Please select a preferred date'),
  time: z.string().min(1, 'Please select a preferred time'),
  type: z.string().min(1, 'Please select a consultation type'),
  notes: z.string().optional(),
});

type ConsultationFormValues = z.infer<typeof consultationSchema>;

export default function Consultation() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationSchema),
  });

  const onSubmit = async (data: ConsultationFormValues) => {
    setIsSubmitting(true);
    
    const message = `Hello Gbotemi Holistic pharmacy, I would like to book a consultation.

*Patient Details:*
Name: ${data.firstName} ${data.lastName}
Phone: ${data.phone}
Email: ${data.email}

*Consultation Details:*
Date: ${data.date}
Time: ${data.time}
Medium: ${data.medium}
Type: ${data.type}
${data.notes ? `Notes: ${data.notes}
` : ''}`;

    let phoneNum = import.meta.env.VITE_WHATSAPP_NUMBER || '2348029660153';
    if (phoneNum.startsWith('0')) {
      phoneNum = '234' + phoneNum.substring(1);
    }
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNum}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    setIsSubmitting(false);
    setIsSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isSuccess) {
    return (
      <div className="bg-slate-50 min-h-[70vh] py-12 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-12 max-w-xl w-full text-center">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Request Received!</h1>
          <p className="text-gray-600 mb-8 text-lg">
            We've opened a new tab to continue your consultation booking via WhatsApp. If it didn't open automatically, please ensure pop-ups are allowed.
          </p>
          <Button size="lg" className="w-full" onClick={() => setIsSuccess(false)}>
            Book Another Session
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8 md:py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Telepharmacy Consultation</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with our licensed holistic pharmacists from the comfort of your home. Book a virtual session for medication reviews, wellness advice, and personalized care.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Booking Form */}
          <div className="lg:w-2/3 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Book an Appointment</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="First Name" placeholder="e.g. Ade" {...register('firstName')} error={errors.firstName?.message} />
                <Input label="Last Name" placeholder="e.g. Ojo" {...register('lastName')} error={errors.lastName?.message} />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Email Address" type="email" placeholder="you@example.com" {...register('email')} error={errors.email?.message} />
                <Input label="Phone Number" placeholder="e.g. 08012345678" {...register('phone')} error={errors.phone?.message} />
              </div>

              <div className="border-t border-gray-100 pt-6 mt-6">
                <h3 className="font-bold text-gray-900 mb-6">Appointment Details</h3>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-900 mb-3">How would you like to connect? *</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center text-center transition-all ${watch('medium') === 'whatsapp' ? 'border-[#25D366] bg-[#25D366]/5 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" value="whatsapp" {...register('medium')} className="sr-only" />
                      <MessageCircle className={`mb-2 ${watch('medium') === 'whatsapp' ? 'text-[#25D366]' : 'text-gray-400'}`} size={28} />
                      <span className="font-bold text-gray-900 text-sm mb-1">WhatsApp</span>
                      <span className="text-xs text-gray-500">Chat, Voice or Video</span>
                    </label>
                    <label className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center text-center transition-all ${watch('medium') === 'phone' ? 'border-primary-500 bg-primary-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" value="phone" {...register('medium')} className="sr-only" />
                      <Phone className={`mb-2 ${watch('medium') === 'phone' ? 'text-primary-600' : 'text-gray-400'}`} size={28} />
                      <span className="font-bold text-gray-900 text-sm mb-1">Phone Call</span>
                      <span className="text-xs text-gray-500">Direct voice call</span>
                    </label>
                    <label className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center text-center transition-all ${watch('medium') === 'video' ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" value="video" {...register('medium')} className="sr-only" />
                      <Video className={`mb-2 ${watch('medium') === 'video' ? 'text-blue-600' : 'text-gray-400'}`} size={28} />
                      <span className="font-bold text-gray-900 text-sm mb-1">Video Call</span>
                      <span className="text-xs text-gray-500">Face-to-face virtual</span>
                    </label>
                  </div>
                  {errors.medium && <p className="text-red-500 text-xs mt-2">{errors.medium.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Preferred Date *</label>
                    <div className="relative">
                      <input 
                        type="date" 
                        {...register('date')}
                        className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${errors.date ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-primary-500'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:bg-white transition-colors`}
                      />
                      <Calendar size={18} className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
                    </div>
                    {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Preferred Time *</label>
                    <div className="relative">
                      <select 
                        {...register('time')}
                        className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${errors.time ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-primary-500'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:bg-white transition-colors appearance-none`}
                      >
                        <option value="">Select a time slot</option>
                        <option value="morning">Morning (9:00 AM - 12:00 PM)</option>
                        <option value="afternoon">Afternoon (1:00 PM - 4:00 PM)</option>
                        <option value="evening">Evening (4:00 PM - 7:00 PM)</option>
                      </select>
                      <Clock size={18} className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
                    </div>
                    {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time.message}</p>}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-900 mb-1">Consultation Type *</label>
                  <select 
                    {...register('type')}
                    className={`w-full px-4 py-3 bg-gray-50 border ${errors.type ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-primary-500'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:bg-white transition-colors`}
                  >
                    <option value="">What do you need help with?</option>
                    <option value="general">General Wellness Advice</option>
                    <option value="prescription">Prescription Review & Refills</option>
                    <option value="chronic">Chronic Condition Management</option>
                    <option value="nutrition">Holistic & Nutritional Support</option>
                  </select>
                  {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">Briefly describe your symptoms or goals (Optional)</label>
                  <textarea 
                    {...register('notes')}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
                    rows={4}
                    placeholder="Provide any context that will help the pharmacist prepare for your session..."
                  ></textarea>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full gap-2" isLoading={isSubmitting}>
                Request Consultation <ArrowRight size={18} />
              </Button>
            </form>
          </div>

          {/* Info Side */}
          <div className="lg:w-1/3 space-y-6">
            <div className="bg-primary-900 text-white rounded-3xl p-8 border border-primary-700 shadow-sm">
              <h3 className="text-xl font-bold mb-6">Why Telepharmacy?</h3>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-800 flex items-center justify-center flex-shrink-0">
                    <Video size={20} className="text-primary-200" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Convenience</h4>
                    <p className="text-primary-100 text-sm">Consult with a pharmacist via WhatsApp Video or Audio call from anywhere.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-800 flex items-center justify-center flex-shrink-0">
                    <User size={20} className="text-primary-200" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Expert Advice</h4>
                    <p className="text-primary-100 text-sm">Get personalized medication counseling and holistic wellness plans.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
              <h3 className="font-bold text-gray-900 mb-2">Need Immediate Help?</h3>
              <p className="text-sm text-gray-600 mb-6">Skip the booking and reach out to us directly during our operating hours.</p>
              <a 
                href={`https://wa.me/${(import.meta.env.VITE_WHATSAPP_NUMBER || '2348029660153').replace(/[\s+-]/g, '').replace(/^0/, '234')}?text=Hello%20Gbotemi%20Holistic%20Pharmacy,%20I%20need%20immediate%20assistance.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button variant="outline" className="w-full border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white gap-2 transition-colors">
                  Chat on WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
