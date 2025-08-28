import { Event, Ticket, User, Membership, MembershipBenefit } from './types';

export const demoEvents: Event[] = [
  {
    id: 'event_1',
    title: 'Tech Conference 2026',
    description: 'Join industry leaders for the biggest tech conference of the year. Discover cutting-edge technologies, network with professionals, and gain insights into the future of technology.',
    imageUrl: '/api/placeholder/600/400',
    location: 'Convention Center, San Francisco',
    date: '2026-06-15',
    time: '09:00',
    organizer: 'TechEvents Inc.',
    category: 'Technology',
    status: 'published',
    tickets: [
      {
        id: 'ticket_1_1',
        eventId: 'event_1',
        type: 'standard',
        name: 'General Admission',
        description: 'Access to all sessions and networking areas',
        price: 299,
        quantity: 500,
        sold: 230,
        benefits: ['All sessions access', 'Networking lunch', 'Conference materials'],
        isAvailable: true
      },
      {
        id: 'ticket_1_2',
        eventId: 'event_1',
        type: 'vip',
        name: 'VIP Pass',
        description: 'Premium experience with exclusive perks',
        price: 599,
        originalPrice: 699,
        quantity: 100,
        sold: 45,
        benefits: ['All sessions access', 'VIP lounge access', 'Meet & greet with speakers', 'Premium swag bag'],
        isAvailable: true
      },
      {
        id: 'ticket_1_3',
        eventId: 'event_1',
        type: 'special',
        name: 'Workshop Bundle',
        description: 'Includes hands-on workshops and masterclasses',
        price: 899,
        quantity: 50,
        sold: 20,
        benefits: ['All VIP benefits', 'Hands-on workshops', 'One-on-one mentoring session', 'Certificate of completion'],
        isAvailable: true
      }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  },
  {
    id: 'event_2',
    title: 'Music Festival Summer Vibes',
    description: 'Experience three days of incredible music with top artists from around the world. Food trucks, art installations, and unforgettable performances await.',
    imageUrl: '/api/placeholder/600/400',
    location: 'Central Park, New York',
    date: '2026-07-20',
    time: '14:00',
    organizer: 'Summer Music Events',
    category: 'Music',
    status: 'published',
    tickets: [
      {
        id: 'ticket_2_1',
        eventId: 'event_2',
        type: 'standard',
        name: 'General Access',
        description: '3-day festival pass with basic amenities',
        price: 199,
        quantity: 1000,
        sold: 650,
        benefits: ['3-day access', 'Basic facilities', 'Free water stations'],
        isAvailable: true
      },
      {
        id: 'ticket_2_2',
        eventId: 'event_2',
        type: 'vip',
        name: 'VIP Experience',
        description: 'Enhanced festival experience with premium perks',
        price: 399,
        quantity: 200,
        sold: 120,
        benefits: ['VIP viewing areas', 'Complimentary drinks', 'VIP restrooms', 'Express entry'],
        isAvailable: true
      }
    ],
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-15T16:45:00Z'
  },
  {
    id: 'event_3',
    title: 'Business Leadership Summit',
    description: 'Transform your leadership skills with insights from Fortune 500 CEOs and industry veterans. Interactive workshops and networking opportunities included.',
    imageUrl: '/api/placeholder/600/400',
    location: 'Business Center, Chicago',
    date: '2026-08-10',
    time: '08:00',
    organizer: 'Leadership Corp',
    category: 'Business',
    status: 'published',
    tickets: [
      {
        id: 'ticket_3_1',
        eventId: 'event_3',
        type: 'standard',
        name: 'Professional Pass',
        description: 'Essential summit access for professionals',
        price: 499,
        quantity: 300,
        sold: 180,
        benefits: ['All keynote sessions', 'Networking lunch', 'Digital resources'],
        isAvailable: true
      },
      {
        id: 'ticket_3_2',
        eventId: 'event_3',
        type: 'vip',
        name: 'Executive Package',
        description: 'Premium experience for senior professionals',
        price: 799,
        quantity: 100,
        sold: 60,
        benefits: ['Executive lounge access', 'Private networking dinner', '1-on-1 coaching session', 'Premium materials'],
        isAvailable: true
      }
    ],
    createdAt: '2024-02-10T11:00:00Z',
    updatedAt: '2024-02-25T13:20:00Z'
  },
  {
    id: 'event_4',
    title: 'Food & Wine Expo',
    description: 'Discover culinary excellence with renowned chefs, wine tastings, and gourmet food experiences. A paradise for food enthusiasts.',
    imageUrl: '/api/placeholder/600/400',
    location: 'Expo Center, Los Angeles',
    date: '2026-09-05',
    time: '11:00',
    organizer: 'Culinary Events LA',
    category: 'Food & Drink',
    status: 'published',
    tickets: [
      {
        id: 'ticket_4_1',
        eventId: 'event_4',
        type: 'standard',
        name: 'Foodie Pass',
        description: 'Access to all food stalls and basic tastings',
        price: 89,
        quantity: 800,
        sold: 420,
        benefits: ['Food hall access', 'Basic tastings', 'Recipe booklet'],
        isAvailable: true
      },
      {
        id: 'ticket_4_2',
        eventId: 'event_4',
        type: 'vip',
        name: 'Gourmet Experience',
        description: 'Premium tastings with celebrity chefs',
        price: 189,
        quantity: 150,
        sold: 85,
        benefits: ['VIP tasting sessions', 'Meet celebrity chefs', 'Exclusive wine pairings', 'Signed cookbook'],
        isAvailable: true
      }
    ],
    createdAt: '2024-03-01T14:00:00Z',
    updatedAt: '2024-03-10T10:15:00Z'
  }
];

export const demoUsers: User[] = [
  {
    id: 'admin_1',
    name: 'Admin User',
    email: 'admin@eventpro.com',
    phone: '+1-555-0100',
    membershipType: 'gold',
    membershipExpiry: '2025-12-31',
    createdAt: '2024-01-01T00:00:00Z',
    isGuest: false
  },
  {
    id: 'user_1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1-555-0101',
    membershipType: 'silver',
    membershipExpiry: '2024-12-31',
    createdAt: '2024-01-15T10:30:00Z',
    isGuest: false
  },
  {
    id: 'user_2',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1-555-0102',
    membershipType: 'bronze',
    membershipExpiry: '2024-10-15',
    createdAt: '2024-02-01T09:15:00Z',
    isGuest: false
  },
  {
    id: 'user_3',
    name: 'Mike Brown',
    email: 'mike.brown@email.com',
    phone: '+1-555-0103',
    membershipType: 'none',
    createdAt: '2024-02-20T14:45:00Z',
    isGuest: false
  }
];

export const demoMemberships: Membership[] = [
  {
    id: 'membership_bronze',
    type: 'bronze',
    name: 'Bronze Membership',
    description: 'Perfect for occasional event attendees who want basic benefits and discounts.',
    price: 49,
    duration: 12,
    benefits: [
      {
        id: 'benefit_1',
        title: '10% Discount',
        description: 'Get 10% off on all event tickets',
        icon: 'Percent'
      },
      {
        id: 'benefit_2',
        title: 'Priority Booking',
        description: '24-hour early access to new events',
        icon: 'Clock'
      },
      {
        id: 'benefit_3',
        title: 'Member Newsletter',
        description: 'Exclusive event updates and offers',
        icon: 'EnvelopeSimple'
      }
    ],
    discountPercentage: 10,
    freeTicketsPerMonth: 0,
    priority: 1
  },
  {
    id: 'membership_silver',
    type: 'silver',
    name: 'Silver Membership',
    description: 'Great value for regular event-goers who want enhanced benefits and better savings.',
    price: 99,
    duration: 12,
    benefits: [
      {
        id: 'benefit_4',
        title: '20% Discount',
        description: 'Get 20% off on all event tickets',
        icon: 'Percent'
      },
      {
        id: 'benefit_5',
        title: '1 Free Ticket',
        description: 'One free standard ticket per month',
        icon: 'Ticket'
      },
      {
        id: 'benefit_6',
        title: 'VIP Support',
        description: 'Dedicated customer support line',
        icon: 'Headset'
      },
      {
        id: 'benefit_7',
        title: 'Exclusive Events',
        description: 'Access to members-only events',
        icon: 'Star'
      }
    ],
    discountPercentage: 20,
    freeTicketsPerMonth: 1,
    priority: 2
  },
  {
    id: 'membership_gold',
    type: 'gold',
    name: 'Gold Membership',
    description: 'Ultimate experience for event enthusiasts with premium benefits and maximum savings.',
    price: 199,
    duration: 12,
    benefits: [
      {
        id: 'benefit_8',
        title: '30% Discount',
        description: 'Get 30% off on all event tickets',
        icon: 'Percent'
      },
      {
        id: 'benefit_9',
        title: '2 Free Tickets',
        description: 'Two free tickets per month (any type)',
        icon: 'Ticket'
      },
      {
        id: 'benefit_10',
        title: 'Concierge Service',
        description: 'Personal event planning assistance',
        icon: 'User'
      },
      {
        id: 'benefit_11',
        title: 'VIP Access',
        description: 'Automatic upgrade to VIP areas',
        icon: 'Crown'
      },
      {
        id: 'benefit_12',
        title: 'Exclusive Perks',
        description: 'Special gifts and experiences',
        icon: 'Gift'
      }
    ],
    discountPercentage: 30,
    freeTicketsPerMonth: 2,
    priority: 3
  }
];

// Combo ticket offers
export const demoComboOffers = [
  {
    id: 'combo_1',
    title: 'Tech & Business Bundle',
    description: 'Save big with our Tech Conference + Business Summit combo',
    events: ['event_1', 'event_3'],
    originalPrice: 798,
    discountedPrice: 599,
    savings: 199,
    validUntil: '2026-05-31',
    isActive: true
  },
  {
    id: 'combo_2',
    title: 'Summer Festival Package',
    description: 'Music Festival + Food Expo - Perfect summer entertainment',
    events: ['event_2', 'event_4'],
    originalPrice: 288,
    discountedPrice: 219,
    savings: 69,
    validUntil: '2026-06-30',
    isActive: true
  }
];

// Gallery images
export const demoGallery = [
  {
    id: 'gallery_1',
    eventId: 'event_1',
    title: 'Tech Conference 2023 Highlights',
    images: [
      '/api/placeholder/400/300',
      '/api/placeholder/400/300',
      '/api/placeholder/400/300',
      '/api/placeholder/400/300'
    ]
  },
  {
    id: 'gallery_2',
    eventId: 'event_2',
    title: 'Music Festival Memories',
    images: [
      '/api/placeholder/400/300',
      '/api/placeholder/400/300',
      '/api/placeholder/400/300',
      '/api/placeholder/400/300',
      '/api/placeholder/400/300',
      '/api/placeholder/400/300'
    ]
  }
];

// Initialize demo data function
export const initializeDemoData = async () => {
  try {
    // Check if spark API is available
    if (typeof window !== 'undefined' && window.spark && window.spark.kv) {
      // Check if data already exists
      const existingEvents = await window.spark.kv.get('events');
      if (!existingEvents || (Array.isArray(existingEvents) && existingEvents.length === 0)) {
        await window.spark.kv.set('events', demoEvents);
      }

      const existingUsers = await window.spark.kv.get('users');
      if (!existingUsers || (Array.isArray(existingUsers) && existingUsers.length === 0)) {
        await window.spark.kv.set('users', demoUsers);
      }

      const existingMemberships = await window.spark.kv.get('memberships');
      if (!existingMemberships || (Array.isArray(existingMemberships) && existingMemberships.length === 0)) {
        await window.spark.kv.set('memberships', demoMemberships);
      }

      const existingCombos = await window.spark.kv.get('combo-offers');
      if (!existingCombos || (Array.isArray(existingCombos) && existingCombos.length === 0)) {
        await window.spark.kv.set('combo-offers', demoComboOffers);
      }

      const existingGallery = await window.spark.kv.get('gallery');
      if (!existingGallery || (Array.isArray(existingGallery) && existingGallery.length === 0)) {
        await window.spark.kv.set('gallery', demoGallery);
      }

      console.log('Demo data initialized successfully');
    } else {
      console.log('Spark API not available, skipping demo data initialization');
    }
  } catch (error) {
    console.error('Error initializing demo data:', error);
  }
};