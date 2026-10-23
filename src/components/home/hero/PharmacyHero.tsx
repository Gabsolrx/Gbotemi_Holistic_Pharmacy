import React from 'react';
import { motion } from 'motion/react';
import { HeroHeadline } from './HeroHeadline';
import { ImmersiveProductScene } from './ImmersiveProductScene';
import { BentoServiceCard } from './BentoServiceCard';
import { ShieldCheck, Truck, Clock, PhoneCall, Sparkles } from 'lucide-react';

export function PharmacyHero() {
  return (
    <section className="relative w-full bg-[#FAF8F0] overflow-hidden pt-4 pb-12 sm:pt-6 sm:pb-16 lg:py-10 border-b border-[#E6F4EC]/80">
      {/* Background Subtle Architectural Grid & Organic Radial Gradients */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(#087F5B 0.75px, transparent 0.75px), radial-gradient(#064E3B 0.75px, #FAF8F0 0.75px)`,
            backgroundSize: '36px 36px',
            backgroundPosition: '0 0, 18px 18px',
            opacity: 0.18
          }}
        />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#087F5B]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-[32rem] h-[32rem] bg-[#C5E86C]/15 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Asymmetrical Bento Grid Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          
          {/* Main Editorial Headline Panel (Spans 7 cols on desktop) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 bg-white/90 backdrop-blur-xl rounded-3xl border border-[#E6F4EC] shadow-sm flex flex-col justify-between overflow-hidden"
          >
            <HeroHeadline />
          </motion.div>

          {/* 3D Immersive Product Centerpiece Panel (Spans 5 cols on desktop) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 bg-gradient-to-b from-white/80 to-[#E6F4EC]/60 backdrop-blur-xl rounded-3xl border border-[#087F5B]/15 shadow-sm relative flex flex-col justify-between overflow-hidden p-2 sm:p-4 min-h-[380px] sm:min-h-[440px] lg:min-h-full"
          >
            {/* Centerpiece 3D Canvas */}
            <ImmersiveProductScene />

            {/* Bottom floating micro-summary inside 3D card */}
            <div className="relative z-20 px-4 py-3 bg-white/80 backdrop-blur-md rounded-2xl border border-emerald-900/10 flex items-center justify-between gap-3 mx-2 mb-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#087F5B] animate-ping" />
                <span className="font-semibold text-[#17372C]">Holistic Formulation</span>
              </div>
              <span className="text-[#65776D]">Lab-Tested • NAFDAC Approved</span>
            </div>
          </motion.div>

        </div>

        {/* Asymmetric 4-Panel Bento Grid Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-5 sm:mt-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <BentoServiceCard type="medicines" className="h-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28 }}
          >
            <BentoServiceCard type="wellness" className="h-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.36 }}
          >
            <BentoServiceCard type="consultation" className="h-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.44 }}
          >
            <BentoServiceCard type="prescription" className="h-full" />
          </motion.div>
        </div>

        {/* Live Service Guarantee Strip (Anti-Slop Clean Typography) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 sm:mt-8 pt-5 border-t border-[#087F5B]/10 flex items-center justify-between flex-wrap gap-4 text-xs text-[#65776D]"
        >
          <div className="flex items-center gap-2">
            <Truck size={15} className="text-[#087F5B]" />
            <span>Fast delivery in Osogbo, Osun State & Nationwide courier</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={15} className="text-[#087F5B]" />
            <span>Prescription verification in under 15 minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <PhoneCall size={15} className="text-[#087F5B]" />
            <span>Direct WhatsApp & Telepharmacy: <strong>+234 802 966 0153</strong></span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
