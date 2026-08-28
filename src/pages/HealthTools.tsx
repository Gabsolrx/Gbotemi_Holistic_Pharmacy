import { useState } from 'react';
import { Activity, HeartPulse, Bell } from 'lucide-react';
import BMICalculator from '../components/health-tools/BMICalculator';
import BPChecker from '../components/health-tools/BPChecker';
import RefillReminders from '../components/health-tools/RefillReminders';

export default function HealthTools() {
  const [activeTab, setActiveTab] = useState<'bmi' | 'bp' | 'refill'>('bmi');

  return (
    <div className="bg-slate-50 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Health & Wellness Tools</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Free, easy-to-use tools to help you monitor your health metrics and keep track of your medication schedule.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 w-fit mx-auto">
          <button
            onClick={() => setActiveTab('bmi')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'bmi' 
                ? 'bg-primary-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Activity size={18} />
            <span className="hidden sm:inline">BMI Calculator</span>
            <span className="sm:hidden">BMI</span>
          </button>
          
          <button
            onClick={() => setActiveTab('bp')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'bp' 
                ? 'bg-rose-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <HeartPulse size={18} />
            <span className="hidden sm:inline">Blood Pressure</span>
            <span className="sm:hidden">BP</span>
          </button>
          
          <button
            onClick={() => setActiveTab('refill')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'refill' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Bell size={18} />
            <span className="hidden sm:inline">Refill Reminders</span>
            <span className="sm:hidden">Refills</span>
          </button>
        </div>

        {/* Active Tool Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'bmi' && <BMICalculator />}
          {activeTab === 'bp' && <BPChecker />}
          {activeTab === 'refill' && <RefillReminders />}
        </div>
      </div>
    </div>
  );
}
