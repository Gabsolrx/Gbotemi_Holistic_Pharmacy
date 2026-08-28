const fs = require('fs');

let reminders = fs.readFileSync('src/components/health-tools/RefillReminders.tsx', 'utf8');

const requestPermission = `
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
`;

reminders = reminders.replace(
  "const getStatusText = (dateString: string) => {",
  requestPermission + "\n  const getStatusText = (dateString: string) => {"
);

const btn = `
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Refill Reminders</h2>
            <p className="text-gray-500 text-sm">Keep track of your medication refills locally</p>
          </div>
          <Button onClick={enableNotifications} className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
            <Bell size={16} className="mr-2" /> Enable Alarms
          </Button>
        </div>
`;

reminders = reminders.replace(
  /<div>\s*<h2 className="text-2xl font-bold text-gray-900">Refill Reminders<\/h2>\s*<p className="text-gray-500 text-sm">Keep track of your medication refills locally<\/p>\s*<\/div>/,
  btn
);

fs.writeFileSync('src/components/health-tools/RefillReminders.tsx', reminders);
