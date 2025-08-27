import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useKV } from '@github/spark/hooks';
import { toast } from 'sonner';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle,
  Send,
  CheckCircle,
  Globe,
  Users,
  Headset
} from '@phosphor-icons/react';

interface ContactPageProps {
  onNavigate: (view: string) => void;
}

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  type: string;
  submittedAt: string;
  status: 'pending' | 'responded' | 'resolved';
}

export function ContactPage({ onNavigate }: ContactPageProps) {
  const [submissions, setSubmissions] = useKV<ContactSubmission[]>('contact-submissions', []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    type: ''
  });

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: ['+1 (555) 123-4567', 'Mon-Fri 9AM-6PM PST'],
      action: () => window.open('tel:+15551234567')
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['hello@eventpro.com', 'Response within 24 hours'],
      action: () => window.open('mailto:hello@eventpro.com')
    },
    {
      icon: MapPin,
      title: 'Address',
      details: ['123 Event Street', 'San Francisco, CA 94102'],
      action: () => window.open('https://maps.google.com')
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Monday - Friday: 9AM - 6PM', 'Weekend: 10AM - 4PM'],
      action: null
    }
  ];

  const supportTopics = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'booking', label: 'Booking Support' },
    { value: 'membership', label: 'Membership Questions' },
    { value: 'technical', label: 'Technical Issues' },
    { value: 'refund', label: 'Refund Request' },
    { value: 'partnership', label: 'Partnership Opportunity' },
    { value: 'feedback', label: 'Feedback & Suggestions' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newSubmission: ContactSubmission = {
        id: `contact_${Date.now()}`,
        ...formData,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      };

      setSubmissions(prev => [...prev, newSubmission]);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        type: ''
      });

      toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.name && formData.email && formData.subject && formData.message && formData.type;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/20 via-accent/10 to-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center bg-primary/20 rounded-full px-4 py-2 mb-4">
              <MessageCircle className="w-5 h-5 text-primary mr-2" />
              <span className="text-primary font-semibold">Get in Touch</span>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              We're Here to Help
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions about events, bookings, or memberships? Our friendly support team is ready to assist you.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-primary" />
                  Send us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Inquiry Type *</Label>
                      <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a topic" />
                        </SelectTrigger>
                        <SelectContent>
                          {supportTopics.map(topic => (
                            <SelectItem key={topic.value} value={topic.value}>
                              {topic.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your inquiry"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Please provide details about your inquiry..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full"
                    disabled={!isFormValid || isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    <Send className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Multiple ways to reach our support team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div 
                    key={index} 
                    className={`flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors ${
                      info.action ? 'cursor-pointer' : ''
                    }`}
                    onClick={info.action || undefined}
                  >
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center shrink-0">
                      <info.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{info.title}</h3>
                      {info.details.map((detail, detailIndex) => (
                        <p key={detailIndex} className="text-sm text-muted-foreground">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Help</CardTitle>
                <CardDescription>
                  Find answers to common questions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => onNavigate('events')}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Browse Events
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => onNavigate('packages')}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Membership Info
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => onNavigate('about')}
                >
                  <Headset className="w-4 h-4 mr-2" />
                  Support Center
                </Button>
              </CardContent>
            </Card>

            {/* Response Time */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 dark:text-green-100">
                    Fast Response Time
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    We typically respond within 24 hours
                  </p>
                </div>
              </div>
              <p className="text-sm text-green-800 dark:text-green-200">
                Our support team is committed to providing quick and helpful responses to all inquiries.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Quick answers to common questions about our platform and services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-6 bg-muted/30 rounded-lg">
                <h3 className="font-semibold mb-2">How do I purchase tickets?</h3>
                <p className="text-sm text-muted-foreground">
                  Browse our events, select your preferred tickets, and proceed to checkout. 
                  You can pay securely with PayPal and receive instant confirmation.
                </p>
              </div>
              
              <div className="p-6 bg-muted/30 rounded-lg">
                <h3 className="font-semibold mb-2">What is the refund policy?</h3>
                <p className="text-sm text-muted-foreground">
                  Refunds are available up to 48 hours before the event start time. 
                  Processing may take 5-7 business days depending on your payment method.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-6 bg-muted/30 rounded-lg">
                <h3 className="font-semibold mb-2">How do membership discounts work?</h3>
                <p className="text-sm text-muted-foreground">
                  Membership discounts are automatically applied at checkout when you're logged in. 
                  The discount percentage depends on your membership tier.
                </p>
              </div>
              
              <div className="p-6 bg-muted/30 rounded-lg">
                <h3 className="font-semibold mb-2">Can I transfer my tickets?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes, tickets can be transferred to another person through your account dashboard. 
                  The new attendee will receive a confirmation email with their QR code.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}