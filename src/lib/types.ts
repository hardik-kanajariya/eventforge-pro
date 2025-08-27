export interface Event {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  date: string;
  time: string;
  organizer: string;
  category: string;
  status: 'draft' | 'published' | 'cancelled';
  tickets: Ticket[];
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: string;
  eventId: string;
  type: 'standard' | 'vip' | 'special';
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  sold: number;
  benefits: string[];
  isAvailable: boolean;
}

export interface PurchasedTicket {
  id: string;
  ticketId: string;
  eventId: string;
  userId: string;
  qrCode: string;
  purchaseDate: string;
  status: 'valid' | 'used' | 'cancelled';
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  ticketDetails: Ticket;
  eventDetails: Event;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  membershipType: 'none' | 'bronze' | 'silver' | 'gold';
  membershipExpiry?: string;
  createdAt: string;
  isGuest: boolean;
  avatar?: string;
}

export interface Membership {
  id: string;
  type: 'bronze' | 'silver' | 'gold';
  name: string;
  description: string;
  price: number;
  duration: number; // in months
  benefits: MembershipBenefit[];
  discountPercentage: number;
  freeTicketsPerMonth: number;
  priority: number;
}

export interface MembershipBenefit {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface CartItem {
  ticketId: string;
  eventId: string;
  quantity: number;
  price: number;
  discountApplied?: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  discount: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentMethod: 'paypal';
  createdAt: string;
  tickets: PurchasedTicket[];
}

export interface AdminConfig {
  siteName: string;
  siteDescription: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  smtpSettings: {
    host: string;
    port: number;
    username: string;
    password: string;
    fromEmail: string;
    fromName: string;
  };
  paypalSettings: {
    clientId: string;
    clientSecret: string;
    sandbox: boolean;
  };
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  variables: string[];
  type: 'welcome' | 'ticket_confirmation' | 'membership_confirmation' | 'password_reset';
}

export type UserRole = 'guest' | 'user' | 'admin';