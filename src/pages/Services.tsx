import { Link } from 'react-router-dom';
import { Pill, Video, Stethoscope, HeartPulse, Activity, ArrowRight, ShieldCheck, Leaf } from 'lucide-react';

const services = [
  {
    id: 'telepharmacy',
    title: 'Telepharmacy Consultations',
    description: 'Connect directly with our holistic pharmacists from the comfort of your home. We offer WhatsApp, phone, and video consultations tailored to your schedule.',
    icon: <Video size={32} />,
    color: 'bg-blue-50 text-blue-600 border-blue-100',
    link: '/consultation',
    linkText: 'Book a Session'
  },
  {
    id: 'prescriptions',
    title: 'Prescription Management',
    description: 'Easily upload your prescriptions, track your refill schedules, and have your medications delivered directly to your door safely and securely.',
    icon: <Pill size={32} />,
    color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    link: '/prescription',
    linkText: 'Upload Prescription'
  },
  {
    id: 'health-tools',
    title: 'Health & Wellness Tools',
    description: 'Access our suite of free health tools including a BMI calculator, blood pressure monitor interpretations, and medication refill reminders.',
    icon: <Activity size={32} />,
    color: 'bg-rose-50 text-rose-600 border-rose-100',
    link: '/health-tools',
    linkText: 'Use Free Tools'
  },
  {
    id: 'chronic-care',
    title: 'Chronic Disease Management',
    description: 'Specialized ongoing care programs for managing hypertension, diabetes, and other chronic conditions through medication and lifestyle adjustments. Message us on WhatsApp for more details.',
    icon: <HeartPulse size={32} />,
    color: 'bg-red-50 text-red-600 border-red-100',
    link: 'https://wa.me/2348029660153?text=Hello%20Gbotemi%20Holistic%20Pharmacy,%20I%20would%20like%20to%20inquire%20about%20the%20Chronic%20Disease%20Management%20program.',
    linkText: 'Inquire Now'
  },
  {
    id: 'holistic-counseling',
    title: 'Holistic & Nutritional Counseling',
    description: 'Discover natural supplements and dietary changes that complement your traditional medications for a well-rounded approach to healing.',
    icon: <Leaf size={32} />,
    color: 'bg-green-50 text-green-600 border-green-100',
    link: '/consultation',
    linkText: 'Talk to an Expert'
  },
  {
    id: 'special-order',
    title: 'Special Order & Quality Assurance',
    description: 'Can\'t find a specific medication? Let us source it for you through our trusted network, ensuring 100% authenticity and safety.',
    icon: <ShieldCheck size={32} />,
    color: 'bg-amber-50 text-amber-600 border-amber-100',
    link: '/contact',
    linkText: 'Request an Item'
  }
];

export default function Services() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Our Services</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From digital prescriptions to holistic wellness plans, we offer comprehensive pharmacy services designed around your wellbeing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border ${service.color}`}>
                {service.icon}
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                {service.title}
              </h2>
              
              <p className="text-gray-600 mb-8 flex-grow leading-relaxed">
                {service.description}
              </p>
              
              {service.link.startsWith('mailto') || service.link.startsWith('http') ? (
              <a 
                href={service.link} 
                target={service.link.startsWith('http') ? "_blank" : undefined}
                rel={service.link.startsWith('http') ? "noopener noreferrer" : undefined}
                className="inline-flex items-center font-bold text-primary-600 hover:text-primary-800 transition-colors mt-auto group"
              >
                {service.linkText}
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            ) : (
              <Link 
                to={service.link} 
                className="inline-flex items-center font-bold text-primary-600 hover:text-primary-800 transition-colors mt-auto group"
              >
                {service.linkText}
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
            </div>
          ))}
        </div>
        
        {/* Banner */}
        <div className="mt-20 bg-primary-900 rounded-3xl p-8 md:p-12 text-center text-white border border-primary-800 relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-16 h-16 bg-primary-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Stethoscope size={32} className="text-primary-200" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Not sure what you need?</h2>
            <p className="text-primary-100 max-w-xl mx-auto mb-8 text-lg">
              Our holistic pharmacists are standing by to listen to your needs and guide you to the right services or products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/consultation" 
                className="px-8 py-4 bg-white text-primary-900 font-bold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Book a Consultation
              </Link>
              <Link 
                to="/contact" 
                className="px-8 py-4 bg-primary-800 text-white border border-primary-700 font-bold rounded-xl hover:bg-primary-700 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary-800 rounded-full opacity-50 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-primary-700 rounded-full opacity-50 blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}
