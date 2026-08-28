import { useState, useEffect, FormEvent } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Bell, Pill, Calendar, Trash2, Plus } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';

interface Reminder {
  id: string;
  medication: string;
  dosage: string;
  refillDate: string;
}

export default function RefillReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [medication, setMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [refillDate, setRefillDate] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('gbotemi_refills');
    if (saved) {
      try {
        setReminders(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse reminders');
      }
    }
  }, []);

  // Save to localStorage when reminders change
  useEffect(() => {
    localStorage.setItem('gbotemi_refills', JSON.stringify(reminders));
  }, [reminders]);

  const addReminder = (e: FormEvent) => {
    e.preventDefault();
    if (!medication || !refillDate) return;

    const newReminder: Reminder = {
      id: crypto.randomUUID(),
      medication,
      dosage,
      refillDate,
    };

    setReminders([...reminders, newReminder].sort((a, b) => new Date(a.refillDate).getTime() - new Date(b.refillDate).getTime()));
    setMedication('');
    setDosage('');
    setRefillDate('');
  };

  const removeReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const getStatusColor = (dateString: string) => {
    const date = new Date(dateString);
    if (isPast(date) && !isToday(date)) return 'text-red-600 bg-red-50 border-red-200';
    if (isToday(date)) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  
  const enableNotifications = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          alert('Notifications enabled! You will receive alarms two days before refill.');
        } else {
          alert('Please allow notifications in your browser settings to receive alarms.');
        }
      });
    } else {
      alert('Your browser does not support notifications.');
    }
  };

  const getStatusText = (dateString: string) => {
    const date = new Date(dateString);
    if (isPast(date) && !isToday(date)) return 'Overdue';
    if (isToday(date)) return 'Due Today';
    return 'Upcoming';
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
          <Bell size={24} />
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Refill Reminders</h2>
            <p className="text-gray-500 text-sm">Keep track of your medication refills locally</p>
          </div>
          <Button onClick={enableNotifications} className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
            <Bell size={16} className="mr-2" /> Enable Alarms
          </Button>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={addReminder} className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-100">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Plus size={18} /> Add New Reminder
            </h3>
            <Input 
              label="Medication Name" 
              placeholder="e.g. Amlodipine" 
              value={medication}
              onChange={(e) => setMedication(e.target.value)}
              required
            />
            <Input 
              label="Dosage / Notes (Optional)" 
              placeholder="e.g. 5mg daily" 
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
            />
            <Input 
              label="Next Refill Date" 
              type="date"
              value={refillDate}
              onChange={(e) => setRefillDate(e.target.value)}
              required
            />
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">Save Reminder</Button>
          </form>
        </div>

        <div className="lg:col-span-3">
          <h3 className="font-bold text-gray-900 mb-4">Your Active Reminders</h3>
          
          {reminders.length === 0 ? (
            <div className="text-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-xl">
              <Pill className="mx-auto text-gray-300 mb-3" size={40} />
              <h4 className="font-bold text-gray-900 mb-1">No reminders yet</h4>
              <p className="text-gray-500 text-sm max-w-sm mx-auto">
                Add your medications using the form to get started tracking your refill dates.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {reminders.map((reminder) => (
                <div key={reminder.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-gray-50 p-2 rounded-lg text-gray-400">
                      <Pill size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{reminder.medication}</h4>
                      {reminder.dosage && <p className="text-sm text-gray-500">{reminder.dosage}</p>}
                      <div className="flex items-center gap-2 mt-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">
                          {format(new Date(reminder.refillDate), 'MMM do, yyyy')}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${getStatusColor(reminder.refillDate)}`}>
                          {getStatusText(reminder.refillDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeReminder(reminder.id)}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove reminder"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
