import React from 'react';
import { useAuth } from './AuthProvider';
import { Navbar } from './layout/Navbar';
import { AdminDashboard } from './admin/AdminDashboard';
import { UserDashboard } from './user/UserDashboard';
import { PublicHomePage } from './public/PublicHomePage';
import { EventsPage } from './public/EventsPage';
import { OffersPage } from './public/OffersPage';
import { PackagesPage } from './public/PackagesPage';
import { AboutPage } from './public/AboutPage';
import { GalleryPage } from './public/GalleryPage';
import { ContactPage } from './public/ContactPage';
import { EventDetails } from './public/EventDetails';
import { CheckoutFlow } from './checkout/CheckoutFlow';
import { useKV } from '@github/spark/hooks';
import { useDemoData } from '../hooks/useDemoData';

export function Router() {
  const { role } = useAuth();
  const [currentView, setCurrentView] = useKV<string>("current-view", "home");
  const [selectedEventId, setSelectedEventId] = useKV<string | null>("selected-event", null);
  
  // Initialize demo data
  useDemoData();

  const navigate = (view: string, eventId?: string) => {
    setCurrentView(view);
    if (eventId) {
      setSelectedEventId(eventId);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'admin':
        return role === 'admin' ? <AdminDashboard /> : <PublicHomePage onNavigate={navigate} />;
      case 'dashboard':
        return role !== 'guest' ? <UserDashboard onNavigate={navigate} /> : <PublicHomePage onNavigate={navigate} />;
      case 'events':
        return <EventsPage onNavigate={navigate} />;
      case 'offers':
        return <OffersPage onNavigate={navigate} />;
      case 'packages':
        return <PackagesPage onNavigate={navigate} />;
      case 'about':
        return <AboutPage onNavigate={navigate} />;
      case 'gallery':
        return <GalleryPage onNavigate={navigate} />;
      case 'contact':
        return <ContactPage onNavigate={navigate} />;
      case 'event-details':
        return <EventDetails eventId={selectedEventId} onNavigate={navigate} />;
      case 'checkout':
        return <CheckoutFlow onNavigate={navigate} />;
      default:
        return <PublicHomePage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onNavigate={navigate} currentView={currentView} />
      <main>
        {renderContent()}
      </main>
    </div>
  );
}