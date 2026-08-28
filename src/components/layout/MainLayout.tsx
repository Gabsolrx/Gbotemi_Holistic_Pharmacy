import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AlarmManager from '../health-tools/AlarmManager';
import { WhatsAppFAB } from '../ui/WhatsAppFAB';

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <AlarmManager />
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFAB />
    </div>
  );
}
