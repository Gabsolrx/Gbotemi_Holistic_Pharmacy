import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

    const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    // Direct email via mailto
    const mailtoLink = `mailto:gbotemihpharmacy@gmail.com?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent("From: " + data.name + " (" + data.email + ")\n\n" + data.message)}`;
    window.location.href = mailtoLink;
    
    setIsSubmitting(false);
    setIsSuccess(true);
    reset();
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Whether you have a question about our products, need medical advice, or want to give feedback, we're here to listen.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Contact Info Cards */}
          <div className="lg:w-1/3 flex flex-col gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Our Location</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Gbotemi Holistic Pharmacy<br />
                  123 Main Street<br />
                  Ile Ife, Osun State, Nigeria
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Call or WhatsApp</h3>
                <p className="text-sm text-gray-600 mb-2">Mon-Sat, 8:00 AM - 8:00 PM</p>
                <a href={`tel:${(import.meta.env.VITE_WHATSAPP_NUMBER || '2348029660153').replace(/[\s+-]/g, '').replace(/^0/, '234')}`} className="font-medium text-primary-700 hover:text-primary-800 transition-colors">
                  +{import.meta.env.VITE_WHATSAPP_NUMBER || '234 802 966 0153'}
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Email Us</h3>
                <p className="text-sm text-gray-600 mb-2">We typically reply within 24 hours.</p>
                <a href="mailto:gbotemihpharmacy@gmail.com" className="font-medium text-primary-700 hover:text-primary-800 transition-colors">
                  gbotemihpharmacy@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:w-2/3 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Send us a Message</h2>
            
            {isSuccess ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600 mb-6">Thank you for reaching out. A member of our team will get back to you shortly.</p>
                <Button onClick={() => setIsSuccess(false)} variant="outline">
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input label="Your Name" placeholder="e.g. Ade Ojo" {...register('name')} error={errors.name?.message} />
                  <Input label="Email Address" type="email" placeholder="you@example.com" {...register('email')} error={errors.email?.message} />
                </div>
                
                <Input label="Subject" placeholder="How can we help you?" {...register('subject')} error={errors.subject?.message} />
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">Your Message</label>
                  <textarea 
                    {...register('message')}
                    className={`w-full px-4 py-3 bg-gray-50 border ${errors.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-primary-500'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:bg-white transition-colors`}
                    rows={6}
                    placeholder="Write your message here..."
                  ></textarea>
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                </div>

                <Button type="submit" size="lg" className="w-full gap-2" isLoading={isSubmitting}>
                  Send Message <Send size={18} />
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
