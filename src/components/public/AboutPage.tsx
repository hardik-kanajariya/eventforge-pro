import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Users, 
  Target, 
  Heart, 
  Award,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  TrendUp,
  Shield,
  Clock
} from '@phosphor-icons/react';

interface AboutPageProps {
  onNavigate: (view: string) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  const stats = [
    { icon: Calendar, label: 'Events Hosted', value: '1,500+' },
    { icon: Users, label: 'Happy Customers', value: '50,000+' },
    { icon: Globe, label: 'Cities Covered', value: '25+' },
    { icon: Award, label: 'Years Experience', value: '8+' }
  ];

  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To connect people through unforgettable experiences by making event discovery and ticket purchasing seamless and enjoyable.'
    },
    {
      icon: Heart,
      title: 'Our Values',
      description: 'We believe in transparency, quality, and putting our customers first. Every event we host reflects our commitment to excellence.'
    },
    {
      icon: Shield,
      title: 'Our Promise',
      description: 'Secure transactions, authentic experiences, and dedicated support to ensure your event journey is smooth from start to finish.'
    }
  ];

  const features = [
    {
      icon: Clock,
      title: 'Easy Booking',
      description: 'Simple, fast ticket booking process with instant confirmation'
    },
    {
      icon: Star,
      title: 'Quality Events',
      description: 'Curated selection of high-quality events and experiences'
    },
    {
      icon: TrendUp,
      title: 'Best Prices',
      description: 'Competitive pricing with exclusive discounts and combo deals'
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Safe and secure payment processing with industry-standard encryption'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      bio: '10+ years in event management, passionate about connecting communities through experiences.',
      image: '/api/placeholder/300/300'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      bio: 'Technology leader focused on building scalable platforms that enhance user experience.',
      image: '/api/placeholder/300/300'
    },
    {
      name: 'Emma Davis',
      role: 'Head of Events',
      bio: 'Event specialist with expertise in curating diverse, high-quality experiences.',
      image: '/api/placeholder/300/300'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/20 via-accent/10 to-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center bg-primary/20 rounded-full px-4 py-2 mb-4">
              <Users className="w-5 h-5 text-primary mr-2" />
              <span className="text-primary font-semibold">About EventPro</span>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Creating Memorable Experiences
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              EventPro is your trusted partner in discovering, booking, and experiencing the best events. 
              We're passionate about bringing people together through unforgettable moments.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-muted/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              What Drives Us
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our core values shape everything we do, from event curation to customer service.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Why Choose EventPro?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We've built our platform with you in mind, focusing on simplicity, security, and satisfaction.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 rounded-lg hover:bg-muted/30 transition-colors">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gradient-to-r from-muted/50 to-muted/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Meet Our Team
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Passionate professionals dedicated to making your event experience exceptional.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-muted overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <Badge variant="secondary" className="mb-4">{member.role}</Badge>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Company Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Founded in 2016, EventPro started with a simple idea: make it easier for people to 
                discover and attend amazing events in their communities. What began as a small startup 
                has grown into a leading event management platform serving thousands of customers nationwide.
              </p>
              <p>
                We've partnered with venues, organizers, and artists to bring you the best selection 
                of events, from intimate workshops to large-scale festivals. Our technology platform 
                ensures smooth transactions, while our dedicated support team is always ready to help.
              </p>
              <p>
                Today, EventPro continues to innovate, introducing features like combo tickets, 
                membership packages, and personalized recommendations to enhance your event experience.
              </p>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Get in Touch</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">
                  123 Event Street, San Francisco, CA 94102
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">hello@eventpro.com</span>
              </div>
            </div>
            
            <div className="mt-8">
              <Button onClick={() => onNavigate('contact')} className="mr-4">
                Contact Us
              </Button>
              <Button variant="outline" onClick={() => onNavigate('events')}>
                Browse Events
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}