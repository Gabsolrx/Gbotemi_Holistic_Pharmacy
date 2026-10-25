import { useState } from 'react';
import { Phone, Video, MessageSquare, Clock, ShieldCheck, CheckCircle2, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Consultation() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    consultationType: 'whatsapp',
    preferredDate: '',
    preferredTime: '',
    topic: '',
    medications: '',
    notes: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      toast.error('Please enter your full name and phone number');
      return;
    }

    // Direct WhatsApp booking option
    const cleanPhone = formData.phone.replace(/[\s+-]/g, '');
    const message = encodeURIComponent(
      `Hello Gbotemi Holistic Pharmacy, I would like to book a Pharmacist Consultation:\n` +
      `*Name:* ${formData.fullName}\n` +
      `*Phone:* ${formData.phone}\n` +
      `*Consultation Mode:* ${formData.consultationType.toUpperCase()}\n` +
      `*Topic:* ${formData.topic || 'General Health Guidance'}\n` +
      `*Current Medications:* ${formData.medications || 'None'}\n` +
      `*Preferred Date/Time:* ${formData.preferredDate || 'Earliest available'} ${formData.preferredTime}\n` +
      `*Notes:* ${formData.notes || 'None'}`
    );

    // Open WhatsApp
    const waUrl = `https://wa.me/2348029660153?text=${message}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    
    setIsSubmitted(true);
    toast.success('Consultation request forwarded to WhatsApp!');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-100">
            <ShieldCheck size={14} /> Telepharmacy & Holistic Care
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            Consult a Licensed Pharmacist Online
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Get personalized advice on drug dosages, interactions, chronic disease management, and natural wellness supplements from certified clinical pharmacists.
          </p>
        </div>

        {/* Feature Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <MessageSquare size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">WhatsApp or Chat</h4>
              <p className="text-[11px] text-gray-500">Quick answers within minutes</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Phone size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">Voice Phone Call</h4>
              <p className="text-[11px] text-gray-500">Direct one-on-one call</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Video size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">Video Consultation</h4>
              <p className="text-[11px] text-gray-500">Comprehensive holistic review</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-6 sm:p-10">
          {isSubmitted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Consultation Request Dispatched!</h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
                Your consultation request has been opened in WhatsApp. Our clinical pharmacist will confirm your schedule and initiate the consultation shortly.
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm transition-colors cursor-pointer"
              >
                Book Another Consultation
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. John Doe"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Phone Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 0802 966 0153"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Preferred Consultation Mode
                  </label>
                  <select
                    value={formData.consultationType}
                    onChange={(e) => setFormData({ ...formData, consultationType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm cursor-pointer bg-white"
                  >
                    <option value="whatsapp">WhatsApp Chat</option>
                    <option value="phone">Phone Call</option>
                    <option value="video">Video Call (Google Meet / WhatsApp)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Consultation Topic
                  </label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm cursor-pointer bg-white"
                  >
                    <option value="General Health Guidance">General Health & Medication Advice</option>
                    <option value="Prescription & Dosage Review">Prescription & Dosage Review</option>
                    <option value="Chronic Disease Management">Hypertension / Diabetes Care</option>
                    <option value="Fertility & Reproductive Health">Fertility & Reproductive Health</option>
                    <option value="Holistic Supplements & Nutrition">Holistic Supplements & Nutrition</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Current Medications or Symptoms (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Describe your symptoms, dosage questions, or any medications you are currently taking..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  <span>Start Consultation with Pharmacist</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 font-medium text-center">
                <Clock size={14} className="text-emerald-600" />
                <span>On-duty pharmacists are available 8:00 AM - 9:00 PM Daily (WAT)</span>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
