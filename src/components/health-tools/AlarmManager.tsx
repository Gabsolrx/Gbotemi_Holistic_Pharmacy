import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { isToday, addDays } from 'date-fns';

export default function AlarmManager() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Create audio element for the alarm
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
    audio.loop = true;
    audioRef.current = audio;
    
    const checkAlarms = () => {
      const saved = localStorage.getItem('gbotemi_refills');
      if (!saved) return;
      
      try {
        const reminders = JSON.parse(saved);
        const now = new Date();
        const hour = now.getHours();
        
        // Ring twice a day: 9 AM and 6 PM (18)
        if (hour === 9 || hour === 18) {
          // Prevent ringing multiple times in the same hour
          const lastRung = localStorage.getItem('gbotemi_last_alarm_hour');
          const currentHourStr = now.toDateString() + '-' + hour;
          
          if (lastRung === currentHourStr) return;
          
          let needsRefill = false;
          let medNames = [];
          
          for (const r of reminders) {
            // Check if refill is 2 days away or closer
            const refillDate = new Date(r.refillDate);
            const twoDaysBefore = new Date(refillDate);
            twoDaysBefore.setDate(refillDate.getDate() - 2);
            
            if (now >= twoDaysBefore && now <= refillDate) {
              needsRefill = true;
              medNames.push(r.medication);
            }
          }
          
          if (needsRefill) {
            localStorage.setItem('gbotemi_last_alarm_hour', currentHourStr);
            playAlarm(medNames.join(', '));
          }
        }
      } catch (e) {
        console.error('Failed to parse reminders for alarm');
      }
    };
    
    // Check every minute
    const interval = setInterval(checkAlarms, 60 * 1000);
    // Initial check
    setTimeout(checkAlarms, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const playAlarm = (meds: string) => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio autoplay blocked', e));
    }
    
    // Check if notification permission is granted
    if (Notification.permission === 'granted') {
      new Notification('Gbotemi Holistic Pharmacy', {
        body: `Time to refill your medications: ${meds}. Please visit us to restock!`,
        icon: '/favicon.ico'
      });
    }

    toast((t) => (
      <div className="flex flex-col gap-3">
        <span className="font-bold text-lg">💊 Refill Reminder!</span>
        <span>It's time to refill your medications: <b>{meds}</b> at Gbotemi Holistic pharmacy.</span>
        <button 
          onClick={() => {
            toast.dismiss(t.id);
            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
            }
          }}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          Stop Alarm
        </button>
      </div>
    ), { duration: Infinity });
  };

  return null;
}
