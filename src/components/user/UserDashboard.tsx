import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useKV } from '@github/spark/hooks';
import { PurchasedTicket, Order, User } from '../../lib/types';
import { useAuth } from '../AuthProvider';
import { TicketDownload } from '../TicketDownload';
import { 
  Ticket, 
  Calendar, 
  MapPin, 
  Download, 
  User as UserIcon,
  Mail,
  Phone,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle
} from '@phosphor-icons/react';
import { toast } from 'sonner';

interface UserDashboardProps {
  onNavigate: (view: string) => void;
}

export function UserDashboard({ onNavigate }: UserDashboardProps) {
  const { user, updateProfile } = useAuth();
  const [purchasedTickets] = useKV<PurchasedTicket[]>("purchased-tickets", []);
  const [orders] = useKV<Order[]>("orders", []);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<PurchasedTicket | null>(null);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-12">
            <UserIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Please sign in</h3>
            <p className="text-muted-foreground mb-6">You need to be logged in to view your dashboard.</p>
            <Button onClick={() => onNavigate('home')}>Go to Homepage</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userTickets = purchasedTickets.filter(ticket => ticket.userId === user.id);
  const userOrders = orders.filter(order => order.userId === user.id);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(profileForm);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const downloadTicket = (ticket: PurchasedTicket) => {
    setSelectedTicket(ticket);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'used': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'bg-green-100 text-green-800';
      case 'used': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your tickets and profile</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Ticket className="w-8 h-8 text-primary mr-3" />
                <div>
                  <p className="text-2xl font-bold">{userTickets.length}</p>
                  <p className="text-sm text-muted-foreground">Total Tickets</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-primary mr-3" />
                <div>
                  <p className="text-2xl font-bold">
                    {userTickets.filter(t => new Date(t.eventDetails.date) > new Date()).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Upcoming Events</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CreditCard className="w-8 h-8 text-primary mr-3" />
                <div>
                  <p className="text-2xl font-bold">${userOrders.reduce((sum, order) => sum + order.total, 0).toFixed(0)}</p>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="tickets" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tickets">My Tickets</TabsTrigger>
            <TabsTrigger value="orders">Order History</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Tickets Tab */}
          <TabsContent value="tickets" className="space-y-6">
            {userTickets.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Ticket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No tickets yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Purchase tickets for events to see them here.
                  </p>
                  <Button onClick={() => onNavigate('home')}>Browse Events</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {userTickets.map((ticket) => (
                  <Card key={ticket.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{ticket.eventDetails.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">{ticket.ticketDetails.name}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(ticket.status)}
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(ticket.eventDetails.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="w-4 h-4 mr-2" />
                          {ticket.eventDetails.time}
                        </div>
                        <div className="flex items-center text-muted-foreground col-span-2">
                          <MapPin className="w-4 h-4 mr-2" />
                          {ticket.eventDetails.location}
                        </div>
                      </div>
                      
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground">QR Code</p>
                            <p className="font-mono text-sm">{ticket.qrCode}</p>
                          </div>
                          <div className="w-12 h-12 bg-white border-2 border-gray-300 rounded flex items-center justify-center">
                            <div className="text-xs">QR</div>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => downloadTicket(ticket)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Ticket
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            {userOrders.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No orders yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Your purchase history will appear here.
                  </p>
                  <Button onClick={() => onNavigate('home')}>Start Shopping</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {userOrders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Order #{order.id.split('_')[1]}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                            {order.paymentStatus}
                          </Badge>
                          <span className="text-lg font-semibold">${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-3">
                        <h4 className="font-medium">Items:</h4>
                        {order.items.map((item, index) => {
                          const ticket = order.tickets.find(t => t.ticketId === item.ticketId);
                          return (
                            <div key={index} className="flex justify-between items-center text-sm">
                              <span>
                                {ticket?.eventDetails.title} - {ticket?.ticketDetails.name} (×{item.quantity})
                              </span>
                              <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          );
                        })}
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between font-medium">
                            <span>Total</span>
                            <span>${order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Profile Information</CardTitle>
                  <Button 
                    variant="outline" 
                    onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                {isEditing ? (
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="profile-name">Full Name</Label>
                      <Input
                        id="profile-name"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="profile-email">Email</Label>
                      <Input
                        id="profile-email"
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="profile-phone">Phone Number</Label>
                      <Input
                        id="profile-phone"
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    
                    <div className="flex space-x-4">
                      <Button type="submit">Save Changes</Button>
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center space-x-3">
                        <UserIcon className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">Full Name</p>
                          <p className="text-muted-foreground">{user.name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">Email</p>
                          <p className="text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">Phone</p>
                          <p className="text-muted-foreground">{user.phone || 'Not provided'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Badge className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">Membership</p>
                          <p className="text-muted-foreground capitalize">{user.membershipType}</p>
                        </div>
                      </div>
                    </div>
                    
                    {user.isGuest && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">Guest Account</h4>
                        <p className="text-blue-800 text-sm">
                          This is a temporary guest account. Consider creating a full account to access additional features.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Ticket Download Modal */}
      {selectedTicket && (
        <TicketDownload 
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
}