import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useKV } from '@github/spark/hooks';
import { Event } from '../../lib/types';
import { Calendar, MapPin, Search, Users, Ticket } from '@phosphor-icons/react';

interface PublicHomePageProps {
  onNavigate: (view: string, eventId?: string) => void;
}

export function PublicHomePage({ onNavigate }: PublicHomePageProps) {
  const [events, , , eventsLoading] = useKV<Event[]>("events", []);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
    return matchesSearch && matchesCategory && event.status === 'published';
  });

  const categories = Array.from(new Set(events.map(e => e.category))).filter(Boolean);

  const getTicketPriceRange = (event: Event) => {
    if (!event.tickets || event.tickets.length === 0) return 'Free';
    
    const prices = event.tickets
      .filter(t => t.isAvailable)
      .map(t => t.price)
      .sort((a, b) => a - b);
    
    if (prices.length === 0) return 'Sold Out';
    if (prices[0] === 0) return 'Free';
    if (prices.length === 1) return `$${prices[0]}`;
    return `$${prices[0]} - $${prices[prices.length - 1]}`;
  };

  const getAvailableTickets = (event: Event) => {
    return event.tickets?.reduce((total, ticket) => total + (ticket.quantity - ticket.sold), 0) || 0;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Discover Amazing Events
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            From conferences to concerts, find and book tickets for the best events in your area.
          </p>
          <Button 
            size="lg" 
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={() => document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Browse Events
          </Button>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section id="events-section" className="py-12 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Events Grid */}
          {eventsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="aspect-video bg-muted"></div>
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded w-full"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No events found</h3>
              <p className="text-muted-foreground">
                {events.length === 0 
                  ? "No events have been created yet." 
                  : "Try adjusting your search or filter criteria."
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-muted">
                    {event.imageUrl ? (
                      <img 
                        src={event.imageUrl} 
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Calendar className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg line-clamp-2">{event.title}</h3>
                      <Badge variant="secondary" className="ml-2">
                        {event.category}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {event.description}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="w-4 h-4 mr-2" />
                      {getAvailableTickets(event)} tickets available
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-primary">
                        {getTicketPriceRange(event)}
                      </span>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Ticket className="w-4 h-4 mr-1" />
                        {event.tickets?.length || 0} types
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={() => onNavigate('event-details', event.id)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Membership CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Join Our Membership Program
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Get exclusive discounts, early access, and free tickets with our membership plans.
          </p>
          <Button size="lg" variant="outline">
            Learn More About Membership
          </Button>
        </div>
      </section>
    </div>
  );
}