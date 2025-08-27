import React from 'react';
import { useAuth } from './AuthProvider';
import { Navbar } from './layout/Navbar';
import { AdminDashboard } from './admin/AdminDashboard';
import { UserDashboard } from './user/UserDashboard';
import { PublicHomePage } from './public/PublicHomePage';
import { EventDetails } from './public/EventDetails';
import { CheckoutFlow } from './checkout/CheckoutFlow';
import { useKV } from '@github/spark/hooks';

export function Router() {
  const { role } = useAuth();
  const [currentView, setCurrentView] = useKV<string>("current-view", "home");
  const [selectedEventId, setSelectedEventId] = useKV<string | null>("selected-event", null);

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