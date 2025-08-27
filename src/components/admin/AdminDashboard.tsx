import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { useKV } from '@github/spark/hooks';
import { Event, Ticket, Order, PurchasedTicket as PurchasedTicketType } from '../../lib/types';
import { useAuth } from '../AuthProvider';
import { 
  Calendar, 
  Plus, 
  Edit,
  Trash,
  Users,
  DollarSign,
  BarChart,
  Settings,
  Eye,
  Ticket as TicketIcon
} from '@phosphor-icons/react';
import { toast } from 'sonner';

export function AdminDashboard() {
  const { user, role } = useAuth();
  const [events, setEvents] = useKV<Event[]>("events", []);
  const [orders] = useKV<Order[]>("orders", []);
  const [purchasedTickets] = useKV<PurchasedTicketType[]>("purchased-tickets", []);
  
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventForm, setEventForm] = useState<Partial<Event>>({
    title: '',
    description: '',
    imageUrl: '',
    location: '',
    date: '',
    time: '',
    organizer: '',
    category: '',
    status: 'draft',
    tickets: []
  });

  if (role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-12">
            <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Access Denied</h3>
            <p className="text-muted-foreground">You don't have permission to access the admin panel.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalTicketsSold = purchasedTickets.length;
  const totalEvents = events.length;
  const activeEvents = events.filter(e => e.status === 'published').length;

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventForm.title || !eventForm.description || !eventForm.date || !eventForm.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    const eventData: Event = {
      id: editingEvent?.id || `event_${Date.now()}`,
      title: eventForm.title!,
      description: eventForm.description!,
      imageUrl: eventForm.imageUrl || '',
      location: eventForm.location!,
      date: eventForm.date!,
      time: eventForm.time || '00:00',
      organizer: eventForm.organizer || 'EventPro',
      category: eventForm.category || 'General',
      status: eventForm.status as any || 'draft',
      tickets: eventForm.tickets || [],
      createdAt: editingEvent?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingEvent) {
      setEvents(prevEvents => 
        prevEvents.map(e => e.id === editingEvent.id ? eventData : e)
      );
      toast.success('Event updated successfully!');
    } else {
      setEvents(prevEvents => [...prevEvents, eventData]);
      toast.success('Event created successfully!');
    }

    resetForm();
  };

  const resetForm = () => {
    setEventForm({
      title: '',
      description: '',
      imageUrl: '',
      location: '',
      date: '',
      time: '',
      organizer: '',
      category: '',
      status: 'draft',
      tickets: []
    });
    setIsCreatingEvent(false);
    setEditingEvent(null);
  };

  const handleEditEvent = (event: Event) => {
    setEventForm(event);
    setEditingEvent(event);
    setIsCreatingEvent(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(prevEvents => prevEvents.filter(e => e.id !== eventId));
      toast.success('Event deleted successfully!');
    }
  };

  const addTicketType = () => {
    const newTicket: Ticket = {
      id: `ticket_${Date.now()}`,
      eventId: eventForm.id || '',
      type: 'standard',
      name: 'Standard Ticket',
      description: 'Regular admission ticket',
      price: 0,
      quantity: 100,
      sold: 0,
      benefits: [],
      isAvailable: true
    };

    setEventForm(prev => ({
      ...prev,
      tickets: [...(prev.tickets || []), newTicket]
    }));
  };

  const updateTicket = (index: number, field: keyof Ticket, value: any) => {
    setEventForm(prev => ({
      ...prev,
      tickets: prev.tickets?.map((ticket, i) => 
        i === index ? { ...ticket, [field]: value } : ticket
      ) || []
    }));
  };

  const removeTicket = (index: number) => {
    setEventForm(prev => ({
      ...prev,
      tickets: prev.tickets?.filter((_, i) => i !== index) || []
    }));
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage events, tickets, and monitor sales</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">${totalRevenue.toFixed(0)}</p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TicketIcon className="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{totalTicketsSold}</p>
                  <p className="text-sm text-muted-foreground">Tickets Sold</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-purple-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{totalEvents}</p>
                  <p className="text-sm text-muted-foreground">Total Events</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Eye className="w-8 h-8 text-orange-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{activeEvents}</p>
                  <p className="text-sm text-muted-foreground">Active Events</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="events" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Events Management</h2>
              <Button onClick={() => setIsCreatingEvent(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </div>

            {isCreatingEvent && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingEvent ? 'Edit Event' : 'Create New Event'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveEvent} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Event Title *</Label>
                        <Input
                          id="title"
                          value={eventForm.title}
                          onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select 
                          value={eventForm.category}
                          onValueChange={(value) => setEventForm(prev => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="conference">Conference</SelectItem>
                            <SelectItem value="workshop">Workshop</SelectItem>
                            <SelectItem value="concert">Concert</SelectItem>
                            <SelectItem value="sports">Sports</SelectItem>
                            <SelectItem value="exhibition">Exhibition</SelectItem>
                            <SelectItem value="networking">Networking</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="date">Date *</Label>
                        <Input
                          id="date"
                          type="date"
                          value={eventForm.date}
                          onChange={(e) => setEventForm(prev => ({ ...prev, date: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="time">Time</Label>
                        <Input
                          id="time"
                          type="time"
                          value={eventForm.time}
                          onChange={(e) => setEventForm(prev => ({ ...prev, time: e.target.value }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          value={eventForm.location}
                          onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="organizer">Organizer</Label>
                        <Input
                          id="organizer"
                          value={eventForm.organizer}
                          onChange={(e) => setEventForm(prev => ({ ...prev, organizer: e.target.value }))}
                          placeholder="EventPro"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={eventForm.description}
                        onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <Input
                        id="imageUrl"
                        type="url"
                        value={eventForm.imageUrl}
                        onChange={(e) => setEventForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    {/* Tickets Section */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label>Ticket Types</Label>
                        <Button type="button" variant="outline" onClick={addTicketType}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Ticket Type
                        </Button>
                      </div>
                      
                      {eventForm.tickets?.map((ticket, index) => (
                        <Card key={index} className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                              <Label>Ticket Name</Label>
                              <Input
                                value={ticket.name}
                                onChange={(e) => updateTicket(index, 'name', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Type</Label>
                              <Select 
                                value={ticket.type}
                                onValueChange={(value) => updateTicket(index, 'type', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="standard">Standard</SelectItem>
                                  <SelectItem value="vip">VIP</SelectItem>
                                  <SelectItem value="special">Special</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Price ($)</Label>
                              <Input
                                type="number"
                                value={ticket.price}
                                onChange={(e) => updateTicket(index, 'price', parseFloat(e.target.value) || 0)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Quantity</Label>
                              <Input
                                type="number"
                                value={ticket.quantity}
                                onChange={(e) => updateTicket(index, 'quantity', parseInt(e.target.value) || 0)}
                              />
                            </div>
                          </div>
                          <div className="mt-4 flex justify-between items-center">
                            <Textarea
                              placeholder="Ticket description and benefits..."
                              value={ticket.description}
                              onChange={(e) => updateTicket(index, 'description', e.target.value)}
                              rows={2}
                              className="flex-1 mr-4"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeTicket(index)}
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select 
                        value={eventForm.status}
                        onValueChange={(value) => setEventForm(prev => ({ ...prev, status: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex space-x-4">
                      <Button type="submit">
                        {editingEvent ? 'Update Event' : 'Create Event'}
                      </Button>
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Events List */}
            <div className="grid grid-cols-1 gap-4">
              {events.map((event) => (
                <Card key={event.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{event.title}</h3>
                          <Badge variant={event.status === 'published' ? 'default' : 'secondary'}>
                            {event.status}
                          </Badge>
                          <Badge variant="outline">{event.category}</Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-2">{event.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                          <span>{event.location}</span>
                          <span>{event.tickets.length} ticket type(s)</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditEvent(event)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteEvent(event.id)}>
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-2xl font-bold">Order Management</h2>
            
            {orders.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <BarChart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No orders yet</h3>
                  <p className="text-muted-foreground">Orders will appear here once customers start purchasing tickets.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">Order #{order.id.split('_')[1]}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant={order.paymentStatus === 'completed' ? 'default' : 'destructive'}>
                            {order.paymentStatus}
                          </Badge>
                          <span className="text-lg font-semibold">${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Items:</h4>
                        {order.items.map((item, index) => {
                          const ticket = order.tickets.find(t => t.ticketId === item.ticketId);
                          return (
                            <div key={index} className="flex justify-between text-sm">
                              <span>
                                {ticket?.eventDetails.title} - {ticket?.ticketDetails.name} (×{item.quantity})
                              </span>
                              <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold">System Settings</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Email Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>SMTP Host</Label>
                    <Input placeholder="smtp.gmail.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>SMTP Port</Label>
                    <Input type="number" placeholder="587" />
                  </div>
                  <div className="space-y-2">
                    <Label>Username</Label>
                    <Input placeholder="your-email@gmail.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input type="password" placeholder="Your app password" />
                  </div>
                </div>
                <Button>Save Email Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>PayPal Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Client ID</Label>
                  <Input placeholder="Your PayPal Client ID" />
                </div>
                <div className="space-y-2">
                  <Label>Client Secret</Label>
                  <Input type="password" placeholder="Your PayPal Client Secret" />
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="sandbox" />
                  <Label htmlFor="sandbox">Use Sandbox Mode</Label>
                </div>
                <Button>Save PayPal Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}