const fs = require('fs');

const content = `import { useState, FormEvent } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { HeartPulse, Info } from 'lucide-react';

export default function BPChecker() {
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [result, setResult] = useState<{ category: string; color: string; advice: string } | null>(null);

  const checkBP = (e: FormEvent) => {
    e.preventDefault();
    const sys = parseInt(systolic, 10);
    const dia = parseInt(diastolic, 10);
    if (!sys || !dia || sys <= 0 || dia <= 0) return;

    let category = '';
    let color = '';
    let advice = '';

    if (sys >= 180 || dia >= 120) {
      category = 'Hypertensive Crisis';
      color = 'text-red-700 bg-red-50 border-red-300';
      advice = 'SEEK EMERGENCY MEDICAL CARE IMMEDIATELY.';
    } else if ((sys >= 160 && sys <= 179) || (dia >= 100 && dia <= 109)) {
      category = 'Hypertension Stage 2';
      color = 'text-red-600 bg-red-50 border-red-200';
      advice = 'You are in Stage 2 hypertension. Please consult your doctor for medical advice and potential treatment plans.';
    } else if ((sys >= 140 && sys <= 159) || (dia >= 90 && dia <= 99)) {
      category = 'Hypertension Stage 1';
      color = 'text-orange-600 bg-orange-50 border-orange-200';
      advice = 'You are in Stage 1 hypertension. It is recommended to monitor your BP regularly and consult your healthcare provider.';
    } else if ((sys > 120 && sys <= 139) || (dia > 80 && dia <= 89)) {
      category = 'Pre hypertensive / Elevated';
      color = 'text-yellow-600 bg-yellow-50 border-yellow-200';
      advice = 'Your blood pressure is slightly elevated. Consider lifestyle changes like reducing sodium intake and managing stress.';
    } else if (sys <= 120 && dia <= 80) {
      category = 'Normal';
      color = 'text-green-600 bg-green-50 border-green-200';
      advice = 'Your blood pressure is in the healthy range. Keep up the good work with a balanced diet and regular exercise.';
    }

    setResult({ category, color, advice });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center flex-shrink-0">
          <HeartPulse size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Blood Pressure Info</h2>
          <p className="text-gray-500 text-sm">Understand your readings (mmHg)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <form onSubmit={checkBP} className="space-y-5">
          <Input 
            label="Systolic (Upper number)" 
            type="number" 
            placeholder="e.g. 120" 
            value={systolic}
            onChange={(e) => setSystolic(e.target.value)}
            required
            min="50"
            max="250"
          />
          <Input 
            label="Diastolic (Lower number)" 
            type="number" 
            placeholder="e.g. 80" 
            value={diastolic}
            onChange={(e) => setDiastolic(e.target.value)}
            required
            min="30"
            max="150"
          />
          <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 text-white">Check Reading</Button>
        </form>

        <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 flex flex-col justify-center min-h-[200px]">
          {result ? (
            <div className={\`text-center p-6 rounded-xl border animate-in fade-in duration-300 \${result.color}\`}>
              <HeartPulse className="mx-auto mb-3 opacity-80" size={32} />
              <div className="text-sm font-medium uppercase tracking-wider mb-1 opacity-80">Category</div>
              <div className="text-xl font-bold mb-3">{result.category}</div>
              <p className="text-sm leading-relaxed font-medium">
                {result.advice}
              </p>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <HeartPulse className="mx-auto mb-3 opacity-50" size={32} />
              <p>Enter your systolic and diastolic numbers to understand your reading.</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col sm:flex-row gap-4 items-start">
        <div className="mt-1 flex-shrink-0 text-blue-600">
          <Info size={24} />
        </div>
        <div>
          <h4 className="font-bold text-blue-900 mb-2">Medical Disclaimer</h4>
          <p className="text-blue-800 text-sm leading-relaxed mb-2">
            The blood pressure information and drug categories provided on this website are for educational purposes only. They do not constitute medical advice, diagnosis, or treatment. 
          </p>
          <p className="text-blue-800 text-sm leading-relaxed mb-2">
            Blood pressure should be measured by a qualified healthcare professional on at least 2 separate occasions. 
          </p>
          <p className="text-blue-800 text-sm leading-relaxed font-medium">
            Always consult your doctor, pharmacist, or healthcare provider before starting, stopping, or changing any medication.
          </p>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/health-tools/BPChecker.tsx', content);
