import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useKV } from '@github/spark/hooks';
import { Membership } from '../../lib/types';
import { 
  Check, 
  Crown, 
  Star, 
  Ticket, 
  Percent,
  User,
  Headset,
  EnvelopeSimple,
  Clock,
  Gift
} from '@phosphor-icons/react';

interface PackagesPageProps {
  onNavigate: (view: string) => void;
}

export function PackagesPage({ onNavigate }: PackagesPageProps) {
  const [memberships] = useKV<Membership[]>('memberships', []);

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      Percent,
      Clock,
      EnvelopeSimple,
      Ticket,
      Headset,
      Star,
      User,
      Crown,
      Gift
    };
    const IconComponent = icons[iconName] || Star;
    return IconComponent;
  };

  const getMembershipColor = (type: string) => {
    switch (type) {
      case 'bronze':
        return 'from-orange-400/20 to-yellow-600/20';
      case 'silver':
        return 'from-gray-400/20 to-gray-600/20';
      case 'gold':
        return 'from-yellow-400/20 to-yellow-600/20';
      default:
        return 'from-primary/20 to-accent/20';
    }
  };

  const getMembershipBadgeColor = (type: string) => {
    switch (type) {
      case 'bronze':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'silver':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'gold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-primary/10 text-primary border-primary/30';
    }
  };

  const sortedMemberships = [...memberships].sort((a, b) => a.priority - b.priority);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/20 via-accent/10 to-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center bg-primary/20 rounded-full px-4 py-2 mb-4">
              <Crown className="w-5 h-5 text-primary mr-2" />
              <span className="text-primary font-semibold">Membership Packages</span>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Unlock Exclusive Benefits
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our membership program and enjoy premium perks, discounts, and exclusive access to events.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Membership Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {sortedMemberships.map((membership) => {
            const isPopular = membership.type === 'silver';
            
            return (
              <Card 
                key={membership.id} 
                className={`relative overflow-hidden hover:shadow-xl transition-all duration-300 ${
                  isPopular ? 'ring-2 ring-primary scale-105' : ''
                }`}
              >
                {isPopular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    <Badge className="bg-primary text-primary-foreground px-3 py-1 rounded-full">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className={`bg-gradient-to-br ${getMembershipColor(membership.type)} pb-8`}>
                  <div className="text-center">
                    <Badge 
                      variant="outline" 
                      className={`mb-4 ${getMembershipBadgeColor(membership.type)}`}
                    >
                      {membership.name}
                    </Badge>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-foreground">
                        ${membership.price}
                      </span>
                      <span className="text-muted-foreground ml-1">
                        /{membership.duration} months
                      </span>
                    </div>
                    <CardDescription className="text-base">
                      {membership.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Key Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {membership.discountPercentage}%
                        </div>
                        <div className="text-sm text-muted-foreground">Discount</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {membership.freeTicketsPerMonth}
                        </div>
                        <div className="text-sm text-muted-foreground">Free Tickets/Mo</div>
                      </div>
                    </div>
                    
                    {/* Benefits */}
                    <div>
                      <h4 className="font-semibold mb-3">What's Included:</h4>
                      <div className="space-y-3">
                        {membership.benefits.map((benefit) => {
                          const IconComponent = getIconComponent(benefit.icon);
                          return (
                            <div key={benefit.id} className="flex items-start gap-3">
                              <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center mt-0.5 shrink-0">
                                <IconComponent className="w-3 h-3 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium text-sm">{benefit.title}</div>
                                <div className="text-xs text-muted-foreground">
                                  {benefit.description}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="p-6 pt-0">
                  <Button 
                    size="lg" 
                    className="w-full"
                    variant={isPopular ? "default" : "outline"}
                  >
                    Choose {membership.name}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Comparison Table */}
        <div className="bg-card rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Compare Memberships</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4">Features</th>
                  {sortedMemberships.map(membership => (
                    <th key={membership.id} className="text-center py-4 px-4">
                      {membership.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Event Discount</td>
                  {sortedMemberships.map(membership => (
                    <td key={membership.id} className="text-center py-4 px-4">
                      {membership.discountPercentage}%
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Free Tickets Per Month</td>
                  {sortedMemberships.map(membership => (
                    <td key={membership.id} className="text-center py-4 px-4">
                      {membership.freeTicketsPerMonth || '—'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Priority Booking</td>
                  {sortedMemberships.map(membership => (
                    <td key={membership.id} className="text-center py-4 px-4">
                      <Check className="w-5 h-5 text-green-600 mx-auto" />
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">VIP Support</td>
                  {sortedMemberships.map(membership => (
                    <td key={membership.id} className="text-center py-4 px-4">
                      {membership.type !== 'bronze' ? (
                        <Check className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        '—'
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium">Exclusive Events</td>
                  {sortedMemberships.map(membership => (
                    <td key={membership.id} className="text-center py-4 px-4">
                      {membership.type !== 'bronze' ? (
                        <Check className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        '—'
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gradient-to-r from-muted/50 to-muted/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">How do membership discounts work?</h3>
              <p className="text-sm text-muted-foreground">
                Your membership discount is automatically applied at checkout for any event ticket purchase.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">When do free tickets reset?</h3>
              <p className="text-sm text-muted-foreground">
                Free ticket allowances reset on the first day of each month from your membership start date.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Can I upgrade my membership?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! You can upgrade anytime and pay the prorated difference for the remaining period.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Is membership auto-renewable?</h3>
              <p className="text-sm text-muted-foreground">
                Memberships auto-renew unless cancelled. You can manage this in your account settings.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Button variant="outline" onClick={() => onNavigate('contact')}>
              Have More Questions? Contact Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}