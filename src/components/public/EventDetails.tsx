import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { useKV } from '@github/spark/hooks';
import { Event, Ticket, CartItem } from '../../lib/types';
import { useAuth } from '../AuthProvider';
import { 
  Calendar, 
  MapPin, 
  User, 
  Clock, 
  Ticket as TicketIcon, 
  ArrowLeft,
  Minus,
  Plus,
  Crown,
  Star,
  Shield
} from '@phosphor-icons/react';
import { toast } from 'sonner';

interface EventDetailsProps {
  eventId: string | null;
  onNavigate: (view: string) => void;
}

export function EventDetails({ eventId, onNavigate }: EventDetailsProps) {
  const [events] = useKV<Event[]>("events", []);
  const [cart, setCart] = useKV<CartItem[]>("cart", []);
  const { user } = useAuth();
  const [selectedTickets, setSelectedTickets] = useState<Record<string, number>>({});

  const event = events.find(e => e.id === eventId);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Event not found</h2>
          <p className="text-muted-foreground mb-4">The event you're looking for doesn't exist.</p>
          <Button onClick={() => onNavigate('home')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  const getTicketIcon = (type: string) => {
    switch (type) {
      case 'vip': return Crown;
      case 'special': return Star;
      default: return Shield;
    }
  };

  const getTicketColor = (type: string) => {
    switch (type) {
      case 'vip': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'special': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const updateTicketQuantity = (ticketId: string, change: number) => {
    setSelectedTickets(prev => {
      const current = prev[ticketId] || 0;
      const newQuantity = Math.max(0, current + change);
      
      if (newQuantity === 0) {
        const { [ticketId]: _, ...rest } = prev;
        return rest;
      }
      
      return { ...prev, [ticketId]: newQuantity };
    });
  };

  const getTotalPrice = () => {
    return Object.entries(selectedTickets).reduce((total, [ticketId, quantity]) => {
      const ticket = event.tickets.find(t => t.id === ticketId);
      return total + (ticket ? ticket.price * quantity : 0);
    }, 0);
  };

  const getTotalTickets = () => {
    return Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0);
  };

  const addToCart = () => {
    const cartItems: CartItem[] = Object.entries(selectedTickets).map(([ticketId, quantity]) => {
      const ticket = event.tickets.find(t => t.id === ticketId)!;
      return {
        ticketId,
        eventId: event.id,
        quantity,
        price: ticket.price
      };
    });

    setCart(prevCart => {
      const newCart = [...prevCart];
      
      cartItems.forEach(newItem => {
        const existingIndex = newCart.findIndex(
          item => item.ticketId === newItem.ticketId && item.eventId === newItem.eventId
        );
        
        if (existingIndex >= 0) {
          newCart[existingIndex].quantity += newItem.quantity;
        } else {
          newCart.push(newItem);
        }
      });
      
      return newCart;
    });

    setSelectedTickets({});
    toast.success(`${getTotalTickets()} ticket(s) added to cart!`);
    onNavigate('checkout');
  };

  const isEventPast = new Date(event.date) < new Date();
  const hasAvailableTickets = event.tickets.some(t => t.isAvailable && t.quantity > t.sold);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card/50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button 
            variant="ghost" 
            onClick={() => onNavigate('home')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="lg:col-span-2">
            {/* Event Image */}
            <div className="aspect-video bg-muted rounded-lg mb-6 overflow-hidden">
              {event.imageUrl ? (
                <img 
                  src={event.imageUrl} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Calendar className="w-16 h-16 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Event Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="secondary">{event.category}</Badge>
                  <Badge variant={event.status === 'published' ? 'default' : 'destructive'}>
                    {event.status}
                  </Badge>
                  {isEventPast && <Badge variant="destructive">Past Event</Badge>}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {event.title}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {event.description}
                </p>
              </div>

              <Separator />

              {/* Event Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-muted-foreground">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Time</p>
                    <p className="text-muted-foreground">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Organizer</p>
                    <p className="text-muted-foreground">{event.organizer}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Selection */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TicketIcon className="w-5 h-5 mr-2" />
                  Select Tickets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!hasAvailableTickets ? (
                  <div className="text-center py-8">
                    <TicketIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium text-foreground mb-2">No tickets available</h3>
                    <p className="text-sm text-muted-foreground">
                      This event is sold out or tickets are not currently available.
                    </p>
                  </div>
                ) : isEventPast ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium text-foreground mb-2">Event has ended</h3>
                    <p className="text-sm text-muted-foreground">
                      This event has already taken place.
                    </p>
                  </div>
                ) : (
                  <>
                    {event.tickets.map((ticket) => {
                      const Icon = getTicketIcon(ticket.type);
                      const available = ticket.quantity - ticket.sold;
                      const selected = selectedTickets[ticket.id] || 0;
                      
                      return (
                        <div key={ticket.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <Icon className="w-5 h-5 text-primary" />
                              <div>
                                <h4 className="font-medium">{ticket.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {ticket.description}
                                </p>
                              </div>
                            </div>
                            <Badge className={getTicketColor(ticket.type)}>
                              {ticket.type.toUpperCase()}
                            </Badge>
                          </div>

                          {ticket.benefits.length > 0 && (
                            <div className="mb-3">
                              <p className="text-xs font-medium text-muted-foreground mb-1">INCLUDES:</p>
                              <ul className="text-xs text-muted-foreground space-y-1">
                                {ticket.benefits.map((benefit, index) => (
                                  <li key={index} className="flex items-center">
                                    <span className="w-1 h-1 bg-primary rounded-full mr-2" />
                                    {benefit}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-lg font-bold text-primary">
                                ${ticket.price}
                              </span>
                              <p className="text-xs text-muted-foreground">
                                {available} remaining
                              </p>
                            </div>

                            {ticket.isAvailable && available > 0 ? (
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateTicketQuantity(ticket.id, -1)}
                                  disabled={selected === 0}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="w-8 text-center font-medium">{selected}</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateTicketQuantity(ticket.id, 1)}
                                  disabled={selected >= available}
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                            ) : (
                              <Badge variant="destructive">Sold Out</Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {getTotalTickets() > 0 && (
                      <>
                        <Separator />
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Total Tickets:</span>
                            <span>{getTotalTickets()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Total Price:</span>
                            <span className="text-xl font-bold text-primary">
                              ${getTotalPrice().toFixed(2)}
                            </span>
                          </div>
                          <Button 
                            className="w-full" 
                            size="lg"
                            onClick={addToCart}
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}