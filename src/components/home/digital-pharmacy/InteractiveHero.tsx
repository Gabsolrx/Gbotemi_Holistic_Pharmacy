import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Stethoscope, ShieldCheck, UserCheck, PackageCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { DigitalPharmacyInterface } from './DigitalPharmacyInterface';

export function InteractiveHero() {
  return (
    <section className="relative w-full bg-[#FAF8F0] overflow-hidden pt-6 pb-12 sm:pt-8 sm:pb-16 lg:py-12 border-b border-emerald-900/10">
      {/* Background Architectural Grid Pattern & Warm Radial Glows */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(#087F5B 0.75px, transparent 0.75px), radial-gradient(#064E3B 0.75px, #FAF8F0 0.75px)`,
            backgroundSize: '36px 36px',
            backgroundPosition: '0 0, 18px 18px',
            opacity: 0.2,
          }}
        />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#087F5B]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-[32rem] h-[32rem] bg-[#C5E86C]/15 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Asymmetrical Split Layout: Left ~45% | Right ~55% */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: ~45% Width (5 cols out of 12 on lg desktop) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col justify-center"
          >
            {/* Top Pill / Trust Emblem */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-emerald-900/10 shadow-2xs w-fit mb-4 sm:mb-6">
              <span className="w-2 h-2 rounded-full bg-[#087F5B] animate-pulse" />
              <span className="text-xs font-semibold text-[#064E3B] tracking-wide uppercase">
                GBOTEMI HOLISTIC PHARMACY
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-[3.15rem] font-bold text-[#17231E] leading-[1.15] tracking-tight">
              Your{' '}
              <span className="bg-gradient-to-r from-[#087F5B] to-[#064E3B] bg-clip-text text-transparent">
                Trusted Pharmacy
              </span>
              , Just a Click Away.
            </h1>

            {/* Supporting Text */}
            <p className="mt-4 sm:mt-5 text-sm sm:text-base text-[#65776D] leading-relaxed max-w-lg font-normal">
              Shop genuine medicines and wellness essentials, access professional pharmacist guidance, and get the healthcare support you need, all in one convenient place.
            </p>

            {/* Two Primary Action Buttons */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4">
              {/* Primary CTA */}
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#087F5B] hover:bg-[#064E3B] text-white font-semibold text-sm shadow-md shadow-emerald-950/15 hover:shadow-lg hover:shadow-emerald-950/25 transition-all duration-200 group active:scale-98"
              >
                <span>Explore Products</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>

              {/* Secondary CTA */}
              <Link
                to="/consultation"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-[#FAF8F0] text-[#087F5B] border border-[#087F5B]/30 hover:border-[#087F5B] font-semibold text-sm transition-all duration-200 shadow-2xs active:scale-98"
              >
                <Stethoscope size={16} className="text-[#087F5B]" />
                <span>Talk to a Pharmacist</span>
              </Link>
            </div>

            {/* Compact Trust Row Under Buttons */}
            <div className="mt-8 pt-6 border-t border-emerald-900/10 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 text-xs text-[#17231E]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#DDF5E8] flex items-center justify-center text-[#087F5B] shrink-0">
                  <ShieldCheck size={14} />
                </div>
                <span className="font-medium text-[#17231E]">Genuine healthcare products</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#DDF5E8] flex items-center justify-center text-[#087F5B] shrink-0">
                  <UserCheck size={14} />
                </div>
                <span className="font-medium text-[#17231E]">Professional pharmacist support</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#DDF5E8] flex items-center justify-center text-[#087F5B] shrink-0">
                  <PackageCheck size={14} />
                </div>
                <span className="font-medium text-[#17231E]">Convenient ordering</span>
              </div>
            </div>

          </motion.div>

          {/* Right Column: ~55% Width (7 cols out of 12 on lg desktop) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 w-full"
          >
            <DigitalPharmacyInterface />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
