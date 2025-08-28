import { Event, User, Membership, PurchasedTicket, Order } from './types';

// Generate demo data with future dates in 2026
export const generateDemoData = () => {
  const demoEvents: Event[] = [
    {
      id: 'event_1',
      title: 'Tech Conference 2026',
      description: 'The biggest technology conference of the year featuring industry leaders and innovative startups.',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
      location: 'San Francisco Convention Center',
      date: '2026-03-15',
      time: '09:00',
      organizer: 'TechCorp Events',
      category: 'conference',
      status: 'published' as const,
      tickets: [
        {
          id: 'ticket_1_1',
          eventId: 'event_1',
          type: 'standard' as const,
          name: 'Standard Pass',
          description: 'Access to all sessions and exhibition hall',
          price: 299,
          quantity: 500,
          sold: 127,
          benefits: ['All sessions', 'Exhibition access', 'Lunch included'],
          isAvailable: true
        },
        {
          id: 'ticket_1_2',
          eventId: 'event_1',
          type: 'vip' as const,
          name: 'VIP Pass',
          description: 'Premium experience with networking events',
          price: 599,
          quantity: 100,
          sold: 43,
          benefits: ['All sessions', 'VIP networking', 'Premium lunch', 'Meet & greet with speakers'],
          isAvailable: true
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'event_2',
      title: 'Summer Music Festival',
      description: 'Three days of amazing music with top artists from around the world.',
      imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop',
      location: 'Central Park, New York',
      date: '2026-07-20',
      time: '14:00',
      organizer: 'MusicLive Productions',
      category: 'concert',
      status: 'published' as const,
      tickets: [
        {
          id: 'ticket_2_1',
          eventId: 'event_2',
          type: 'standard' as const,
          name: 'General Admission',
          description: 'Access to all stages and food courts',
          price: 149,
          quantity: 2000,
          sold: 834,
          benefits: ['3-day access', 'Food court access'],
          isAvailable: true
        },
        {
          id: 'ticket_2_2',
          eventId: 'event_2',
          type: 'vip' as const,
          name: 'VIP Experience',
          description: 'Premium viewing areas and backstage access',
          price: 349,
          quantity: 200,
          sold: 156,
          benefits: ['VIP viewing area', 'Backstage tour', 'Artist meet & greet', 'Premium food'],
          isAvailable: true
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'event_3',
      title: 'Business Innovation Summit',
      description: 'Learn from successful entrepreneurs and business leaders about the future of innovation.',
      imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=400&fit=crop',
      location: 'Marina Bay Sands, Singapore',
      date: '2026-09-12',
      time: '10:00',
      organizer: 'Innovation Hub',
      category: 'workshop',
      status: 'published' as const,
      tickets: [
        {
          id: 'ticket_3_1',
          eventId: 'event_3',
          type: 'standard' as const,
          name: 'Attendee Pass',
          description: 'Full access to all sessions and workshops',
          price: 199,
          quantity: 300,
          sold: 89,
          benefits: ['All sessions', 'Workshop access', 'Digital resources'],
          isAvailable: true
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const demoUsers: User[] = [
    {
      id: 'admin_1',
      name: 'Admin User',
      email: 'admin@eventpro.com',
      phone: '+1-555-0000',
      membershipType: 'gold',
      membershipExpiry: '2026-12-31',
      createdAt: new Date().toISOString(),
      isGuest: false,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'user_1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1-555-0123',
      membershipType: 'gold',
      membershipExpiry: '2026-12-31',
      createdAt: new Date().toISOString(),
      isGuest: false,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'user_2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1-555-0124',
      membershipType: 'silver',
      membershipExpiry: '2026-08-15',
      createdAt: new Date().toISOString(),
      isGuest: false,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'user_3',
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      membershipType: 'none',
      createdAt: new Date().toISOString(),
      isGuest: false
    }
  ];

  const demoMemberships: Membership[] = [
    {
      id: 'membership_1',
      type: 'bronze',
      name: 'Bronze Membership',
      description: 'Basic membership with standard benefits and discounts.',
      price: 99,
      duration: 12,
      benefits: [
        '10% discount on all tickets',
        'Priority customer support',
        'Monthly newsletter with exclusive content'
      ],
      discountPercentage: 10,
      freeTicketsPerMonth: 0,
      priority: 1
    },
    {
      id: 'membership_2',
      type: 'silver',
      name: 'Silver Membership',
      description: 'Enhanced membership with additional perks and better discounts.',
      price: 199,
      duration: 12,
      benefits: [
        '20% discount on all tickets',
        '1 free standard ticket per month',
        'Priority booking access',
        'Dedicated customer support',
        'Exclusive member-only events'
      ],
      discountPercentage: 20,
      freeTicketsPerMonth: 1,
      priority: 2
    },
    {
      id: 'membership_3',
      type: 'gold',
      name: 'Gold Membership',
      description: 'Premium membership with the best benefits and maximum savings.',
      price: 399,
      duration: 12,
      benefits: [
        '30% discount on all tickets',
        '2 free tickets per month (any type)',
        'VIP access to special events',
        'Premium customer support with dedicated manager',
        'Backstage access when available',
        'Complimentary event merchandise',
        'Partner venue discounts'
      ],
      discountPercentage: 30,
      freeTicketsPerMonth: 2,
      priority: 3
    }
  ];

  const demoPurchasedTickets: PurchasedTicket[] = [
    {
      id: 'purchased_1',
      ticketId: 'ticket_1_1',
      eventId: 'event_1',
      userId: 'admin_1',
      qrCode: 'TKT-2026-001-ABCD1234',
      purchaseDate: new Date().toISOString(),
      status: 'valid',
      attendeeName: 'Admin User',
      attendeeEmail: 'admin@eventpro.com',
      attendeePhone: '+1-555-0000',
      ticketDetails: demoEvents[0].tickets[0],
      eventDetails: demoEvents[0]
    },
    {
      id: 'purchased_2',
      ticketId: 'ticket_2_2',
      eventId: 'event_2',
      userId: 'user_1',
      qrCode: 'TKT-2026-002-EFGH5678',
      purchaseDate: new Date().toISOString(),
      status: 'valid',
      attendeeName: 'John Doe',
      attendeeEmail: 'john.doe@example.com',
      attendeePhone: '+1-555-0123',
      ticketDetails: demoEvents[1].tickets[1],
      eventDetails: demoEvents[1]
    }
  ];

  const demoOrders: Order[] = [
    {
      id: 'order_1',
      userId: 'admin_1',
      items: [
        {
          ticketId: 'ticket_1_1',
          eventId: 'event_1',
          quantity: 1,
          price: 299,
          discountApplied: 89.7 // 30% gold member discount
        }
      ],
      total: 209.3,
      discount: 89.7,
      paymentStatus: 'completed',
      paymentMethod: 'paypal',
      createdAt: new Date().toISOString(),
      tickets: [demoPurchasedTickets[0]]
    },
    {
      id: 'order_2',
      userId: 'user_1',
      items: [
        {
          ticketId: 'ticket_2_2',
          eventId: 'event_2',
          quantity: 1,
          price: 349,
          discountApplied: 104.7 // 30% gold member discount
        }
      ],
      total: 244.3,
      discount: 104.7,
      paymentStatus: 'completed',
      paymentMethod: 'paypal',
      createdAt: new Date().toISOString(),
      tickets: [demoPurchasedTickets[1]]
    }
  ];

  return {
    events: demoEvents,
    users: demoUsers,
    memberships: demoMemberships,
    purchasedTickets: demoPurchasedTickets,
    orders: demoOrders
  };
};