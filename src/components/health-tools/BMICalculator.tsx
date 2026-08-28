import { useState, FormEvent } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Activity, Info } from 'lucide-react';

export default function BMICalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState<{ bmi: string; category: string; color: string; advice: string } | null>(null);

  const calculateBMI = (e: FormEvent) => {
    e.preventDefault();
    
    const w = parseFloat(weight);
    const h = parseFloat(height); // height is now in meters

    if (!w || !h || w <= 0 || h <= 0) return;

    const bmi = w / (h * h);
    
    let category = '';
    let color = '';
    let advice = '';

    if (bmi < 18.5) {
      category = 'Underweight';
      color = 'text-blue-600';
      advice = 'You may need to gain some weight. Consult with a healthcare provider for a balanced nutritional plan.';
    } else if (bmi >= 18.5 && bmi < 25.0) {
      category = 'Normal / Healthy';
      color = 'text-green-600';
      advice = 'Great job! Maintain your healthy lifestyle with regular exercise and a balanced diet.';
    } else if (bmi >= 25.0 && bmi < 30.0) {
      category = 'Overweight';
      color = 'text-yellow-600';
      advice = 'You may benefit from a slight weight reduction. Focus on portion control and regular physical activity.';
    } else if (bmi >= 30.0 && bmi < 35.0) {
      category = 'Obesity Class 1';
      color = 'text-orange-500';
      advice = 'It is recommended to seek guidance from a healthcare provider to develop a safe and effective weight loss plan.';
    } else if (bmi >= 35.0 && bmi < 40.0) {
      category = 'Obesity Class 2';
      color = 'text-red-500';
      advice = 'It is highly recommended to seek guidance from a healthcare provider to develop a safe and effective weight loss plan.';
    } else {
      category = 'Obesity Class 3';
      color = 'text-red-700';
      advice = 'Please seek immediate guidance from a healthcare professional to manage your weight and health risks.';
    }

    setResult({ bmi: bmi.toFixed(1), category, color, advice });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Activity size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">BMI Calculator</h2>
              <p className="text-gray-500 text-sm">Calculate your Body Mass Index (Metric)</p>
            </div>
          </div>
          
          <form onSubmit={calculateBMI} className="space-y-5 mb-8">
            <Input 
              label="Height (m)" 
              type="number" 
              step="0.01"
              placeholder="e.g. 1.75" 
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              required
              min="0.5"
              max="3.0"
            />
            <Input 
              label="Weight (kg)" 
              type="number"
              step="0.1" 
              placeholder="e.g. 70" 
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
              min="10"
              max="500"
            />
            <Button type="submit" className="w-full">Calculate BMI</Button>
          </form>

          <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 flex flex-col justify-center min-h-[200px]">
            {result ? (
              <div className="text-center animate-in fade-in zoom-in duration-300">
                <div className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-2">Your Result</div>
                <div className={`text-5xl font-bold mb-2 ${result.color}`}>
                  {result.bmi}
                </div>
                <div className={`text-xl font-bold mb-4 ${result.color}`}>
                  {result.category}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {result.advice}
                </p>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <Activity className="mx-auto mb-3 opacity-50" size={32} />
                <p>Enter your height and weight to see your result.</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 bg-gray-50 rounded-xl p-6 border border-gray-100 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Info size={18} className="text-primary-600" />
              How it works
            </h3>
            <p className="text-sm text-gray-700 mb-2">
              <strong>The formula for BMI (Body Mass Index) is:</strong><br/>
              BMI = Weight (kg) ÷ Height (m)²
            </p>
            <div className="text-sm text-gray-600 space-y-1 mb-4">
              <p>In words:</p>
              <ol className="list-decimal list-inside pl-2 space-y-1">
                <li>Weight in kilograms</li>
                <li>Height in meters, then square it</li>
                <li>Divide weight by height²</li>
              </ol>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200 text-sm text-gray-700 shadow-sm">
              <p className="font-medium mb-1">Example:</p>
              <p>If someone weighs 70kg and is 1.75m tall:</p>
              <p className="font-mono mt-2 text-xs sm:text-sm bg-gray-50 p-2 border border-gray-100 rounded text-gray-800">BMI = 70 / (1.75 × 1.75) = 70 / 3.06 = 22.9</p>
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">BMI Categories - WHO Standard</h3>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm text-left text-gray-600 bg-white">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">BMI Range</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-blue-600">Underweight</td>
                    <td className="px-4 py-2.5">Less than 18.5</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-green-600">Normal / Healthy</td>
                    <td className="px-4 py-2.5">18.5 - 24.9</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-yellow-600">Overweight</td>
                    <td className="px-4 py-2.5">25.0 - 29.9</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-orange-500">Obesity Class 1</td>
                    <td className="px-4 py-2.5">30.0 - 34.9</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-red-500">Obesity Class 2</td>
                    <td className="px-4 py-2.5">35.0 - 39.9</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-red-700">Obesity Class 3</td>
                    <td className="px-4 py-2.5">40.0 and above</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="text-xs text-gray-700 italic mt-4 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <strong>Disclaimer:</strong> BMI is a screening tool only. It does not diagnose body fat or health. Consult a doctor or dietitian for personal assessment.
          </div>
        </div>
      </div>
    </div>
  );
}
