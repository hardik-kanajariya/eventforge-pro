import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useKV } from '@github/spark/hooks';
import { Event } from '../../lib/types';
import { Ticket, Clock, CalendarDays, MapPin, Percent } from '@phosphor-icons/react';

interface OffersPageProps {
  onNavigate: (view: string, eventId?: string) => void;
}

interface ComboOffer {
  id: string;
  title: string;
  description: string;
  events: string[];
  originalPrice: number;
  discountedPrice: number;
  savings: number;
  validUntil: string;
  isActive: boolean;
}

export function OffersPage({ onNavigate }: OffersPageProps) {
  const [events] = useKV<Event[]>('events', []);
  const [comboOffers] = useKV<ComboOffer[]>('combo-offers', []);

  const getEventDetails = (eventId: string) => {
    return events.find(event => event.id === eventId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const daysUntilExpiry = (validUntil: string) => {
    const today = new Date();
    const expiryDate = new Date(validUntil);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-accent/20 via-primary/10 to-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center bg-accent/20 rounded-full px-4 py-2 mb-4">
              <Percent className="w-5 h-5 text-accent mr-2" />
              <span className="text-accent font-semibold">Special Offers</span>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Combo Ticket Deals
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Save more when you bundle! Get the best value with our exclusive combo ticket packages.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Active Offers */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-8">Limited Time Offers</h2>
          
          {comboOffers.filter(offer => offer.isActive).length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No active offers</h3>
              <p className="text-muted-foreground mb-4">
                Check back soon for exciting combo deals and discounts!
              </p>
              <Button onClick={() => onNavigate('events')}>
                Browse Events
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {comboOffers
                .filter(offer => offer.isActive)
                .map((offer) => {
                  const offerEvents = offer.events.map(getEventDetails).filter(Boolean);
                  const daysLeft = daysUntilExpiry(offer.validUntil);
                  
                  return (
                    <Card key={offer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardHeader className="bg-gradient-to-r from-accent/10 to-primary/10">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-xl mb-2">{offer.title}</CardTitle>
                            <CardDescription className="text-base">
                              {offer.description}
                            </CardDescription>
                          </div>
                          <Badge variant="destructive" className="shrink-0">
                            {daysLeft > 0 ? `${daysLeft} days left` : 'Expires today'}
                          </Badge>
                        </div>
                        
                        {/* Price Section */}
                        <div className="flex items-center gap-4 mt-4">
                          <div className="text-3xl font-bold text-primary">
                            ${offer.discountedPrice}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-lg line-through text-muted-foreground">
                              ${offer.originalPrice}
                            </span>
                            <span className="text-sm font-semibold text-green-600">
                              Save ${offer.savings}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="p-6">
                        <h4 className="font-semibold mb-4">Included Events:</h4>
                        <div className="space-y-4">
                          {offerEvents.map((event, index) => (
                            <div key={event?.id} className="flex items-start gap-4 p-4 border rounded-lg">
                              <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden shrink-0">
                                <img 
                                  src={event?.imageUrl} 
                                  alt={event?.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-medium text-foreground truncate">
                                  {event?.title}
                                </h5>
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                  <CalendarDays className="w-3 h-3 mr-1" />
                                  {event?.date && formatDate(event.date)}
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {event?.location}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Offer Details */}
                        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-center text-sm text-muted-foreground mb-2">
                            <Clock className="w-4 h-4 mr-2" />
                            Valid until {formatDate(offer.validUntil)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            This combo package includes standard admission to both events. 
                            Individual tickets would cost ${offer.originalPrice} - save ${offer.savings} with this bundle!
                          </p>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="bg-muted/30 p-6">
                        <Button size="lg" className="w-full">
                          Get This Deal - ${offer.discountedPrice}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
            </div>
          )}
        </div>

        {/* Why Combo Tickets */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Why Choose Combo Tickets?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Combo tickets offer the best value for event enthusiasts who want to experience multiple events.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Percent className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Save Money</h3>
              <p className="text-sm text-muted-foreground">
                Get significant discounts compared to buying individual tickets
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">One Purchase</h3>
              <p className="text-sm text-muted-foreground">
                Buy multiple event tickets in a single convenient transaction
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CalendarDays className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Curated Events</h3>
              <p className="text-sm text-muted-foreground">
                Expertly selected event combinations for the best experience
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}