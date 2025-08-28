import { useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { generateDemoData } from '../lib/demoData';
import { Event, User, Membership, PurchasedTicket, Order } from '../lib/types';

export function useDemoData() {
  const [events, setEvents] = useKV<Event[]>("events", []);
  const [users, setUsers] = useKV<User[]>("users", []);
  const [memberships, setMemberships] = useKV<Membership[]>("memberships", []);
  const [purchasedTickets, setPurchasedTickets] = useKV<PurchasedTicket[]>("purchased-tickets", []);
  const [orders, setOrders] = useKV<Order[]>("orders", []);

  useEffect(() => {
    const initializeData = () => {
      const demoData = generateDemoData();
      
      // Only initialize if data doesn't exist
      if (events.length === 0) {
        setEvents(demoData.events);
      }
      
      if (users.length === 0) {
        setUsers(demoData.users);
      }
      
      if (memberships.length === 0) {
        setMemberships(demoData.memberships);
      }
      
      if (purchasedTickets.length === 0) {
        setPurchasedTickets(demoData.purchasedTickets);
      }
      
      if (orders.length === 0) {
        setOrders(demoData.orders);
      }
    };

    initializeData();
  }, []); // Run only once on mount

  return {
    events,
    users,
    memberships,
    purchasedTickets,
    orders,
    setEvents,
    setUsers,
    setMemberships,
    setPurchasedTickets,
    setOrders
  };
}