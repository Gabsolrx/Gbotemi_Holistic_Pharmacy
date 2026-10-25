import { ShieldCheck, HeartPulse, Truck, Award, Users, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-100">
            <Award size={14} /> Certified Healthcare Provider
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
            Dedicated to Genuine Medicine & Holistic Wellbeing
          </h1>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Gbotemi Holistic Pharmacy is Nigeria's trusted digital community pharmacy, combining genuine NAFDAC-approved medications with personalized clinical telepharmacy and natural wellness counseling.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6">
              <ShieldCheck size={26} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">100% Genuine Care</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Every pharmaceutical product is strictly regulated, stored in climate-controlled conditions, and directly sourced from certified manufacturers.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-6">
              <HeartPulse size={26} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Holistic Healthcare</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              We look beyond symptoms, combining modern pharmacology with natural remedies, dietary guidance, and preventive lifestyle advice.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-6">
              <Truck size={26} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Fast Nationwide Transit</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Same-day courier delivery within Osun State and rapid, secured waybill dispatch across all 36 states in Nigeria.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 shadow-sm mb-16">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              Our Mission & Values
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-gray-600 leading-relaxed">
              <p>
                Founded with a deep commitment to community wellness, Gbotemi Holistic Pharmacy bridges the gap between patient and pharmacist. We believe healthcare should be compassionate, accessible, and uncompromising in quality.
              </p>
              <p>
                Located at No 59, Lokore Junction, Ifewara Road, Ile Ife, Osun State, our registered pharmacy operates both physically and digitally to ensure prompt delivery of essential medications, confidential doctor prescription fulfillment, and telehealth consultations.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Superintendent Pharmacist oversight',
                'Cold-chain storage for vaccines & insulin',
                'Confidential prescription verification',
                'Support for chronic disease management',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-gray-800">
                  <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 rounded-3xl p-8 sm:p-12 text-center text-white shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Prioritize Your Wellbeing?</h2>
          <p className="text-emerald-100 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Explore authentic medicines, upload your doctor's prescription, or book a consultation with our clinical pharmacists today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/shop"
              className="px-6 py-3 rounded-xl bg-white text-emerald-900 font-bold text-sm hover:bg-emerald-50 transition-colors shadow-md"
            >
              Browse Shop
            </Link>
            <Link
              to="/consultation"
              className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-sm transition-colors border border-emerald-500/30"
            >
              Consult Pharmacist
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
