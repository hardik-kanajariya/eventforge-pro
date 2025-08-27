import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { useKV } from '@github/spark/hooks';
import { CartItem, Event, Ticket, Order, PurchasedTicket, User } from '../../lib/types';
import { useAuth } from '../AuthProvider';
import { 
  ArrowLeft, 
  CreditCard, 
  Trash,
  ShoppingCart,
  CheckCircle,
  Calendar,
  MapPin
} from '@phosphor-icons/react';
import { toast } from 'sonner';

interface CheckoutFlowProps {
  onNavigate: (view: string) => void;
}

export function CheckoutFlow({ onNavigate }: CheckoutFlowProps) {
  const [cart, setCart] = useKV<CartItem[]>("cart", []);
  const [events] = useKV<Event[]>("events", []);
  const [orders, setOrders] = useKV<Order[]>("orders", []);
  const [purchasedTickets, setPurchasedTickets] = useKV<PurchasedTicket[]>("purchased-tickets", []);
  const { user, loginAsGuest } = useAuth();
  
  const [step, setStep] = useState<'cart' | 'details' | 'payment' | 'success'>('cart');
  const [guestDetails, setGuestDetails] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const getCartDetails = () => {
    return cart.map(item => {
      const event = events.find(e => e.id === item.eventId);
      const ticket = event?.tickets.find(t => t.id === item.ticketId);
      return { item, event, ticket };
    }).filter(({ event, ticket }) => event && ticket);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const removeFromCart = (ticketId: string, eventId: string) => {
    setCart(prevCart => 
      prevCart.filter(item => !(item.ticketId === ticketId && item.eventId === eventId))
    );
    toast.success('Item removed from cart');
  };

  const updateCartQuantity = (ticketId: string, eventId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(ticketId, eventId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.ticketId === ticketId && item.eventId === eventId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const proceedToDetails = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    setStep('details');
  };

  const proceedToPayment = async () => {
    if (!user) {
      if (!guestDetails.name || !guestDetails.email || !guestDetails.phone) {
        toast.error('Please fill in all guest details');
        return;
      }
      
      try {
        await loginAsGuest(guestDetails.name, guestDetails.email, guestDetails.phone);
        toast.success('Guest account created! You can login later to manage your tickets.');
      } catch (error) {
        toast.error('Failed to create guest account');
        return;
      }
    }
    setStep('payment');
  };

  const processPayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const orderId = `order_${Date.now()}`;
      const orderDate = new Date().toISOString();
      
      // Generate tickets
      const tickets: PurchasedTicket[] = [];
      const cartDetails = getCartDetails();
      
      for (const { item, event, ticket } of cartDetails) {
        for (let i = 0; i < item.quantity; i++) {
          const ticketId = `ticket_${Date.now()}_${i}`;
          const qrCode = `QR_${ticketId}_${event!.id}`;
          
          tickets.push({
            id: ticketId,
            ticketId: item.ticketId,
            eventId: item.eventId,
            userId: user!.id,
            qrCode,
            purchaseDate: orderDate,
            status: 'valid',
            attendeeName: user!.name,
            attendeeEmail: user!.email,
            attendeePhone: user!.phone || '',
            ticketDetails: ticket!,
            eventDetails: event!
          });
        }
      }
      
      // Create order
      const order: Order = {
        id: orderId,
        userId: user!.id,
        items: cart,
        total: getTotalPrice(),
        discount: 0,
        paymentStatus: 'completed',
        paymentMethod: 'paypal',
        createdAt: orderDate,
        tickets
      };
      
      // Update sold tickets count
      cartDetails.forEach(({ item, event }) => {
        const eventIndex = events.findIndex(e => e.id === event!.id);
        if (eventIndex >= 0) {
          const ticketIndex = events[eventIndex].tickets.findIndex(t => t.id === item.ticketId);
          if (ticketIndex >= 0) {
            events[eventIndex].tickets[ticketIndex].sold += item.quantity;
          }
        }
      });
      
      // Save everything
      setOrders(prevOrders => [...prevOrders, order]);
      setPurchasedTickets(prevTickets => [...prevTickets, ...tickets]);
      setCart([]);
      setCompletedOrder(order);
      setStep('success');
      
      toast.success('Payment successful! Your tickets have been generated.');
      
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderCartStep = () => (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
        <Button variant="ghost" onClick={() => onNavigate('home')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Continue Shopping
        </Button>
      </div>

      {cart.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">Add some tickets to get started!</p>
            <Button onClick={() => onNavigate('home')}>Browse Events</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {getCartDetails().map(({ item, event, ticket }, index) => (
              <Card key={`${item.ticketId}-${item.eventId}`}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                      <Calendar className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{event!.title}</h3>
                      <p className="text-muted-foreground">{ticket!.name}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(event!.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 mr-1" />
                          {event!.location}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">${item.price}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartQuantity(item.ticketId, item.eventId, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartQuantity(item.ticketId, item.eventId, item.quantity + 1)}
                        >
                          +
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.ticketId, item.eventId)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fees</span>
                  <span>$0.00</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <Button className="w-full" size="lg" onClick={proceedToDetails}>
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );

  const renderDetailsStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">Contact Details</h1>
        <Button variant="ghost" onClick={() => setStep('cart')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {user ? 'Confirm Your Details' : 'Guest Checkout'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {user ? (
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <p className="text-lg">{user.name}</p>
              </div>
              <div>
                <Label>Email</Label>
                <p className="text-lg">{user.email}</p>
              </div>
              <div>
                <Label>Phone</Label>
                <p className="text-lg">{user.phone || 'Not provided'}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Provide your details to complete the purchase. We'll create a temporary account 
                for you and send login details via email.
              </p>
              <div className="space-y-2">
                <Label htmlFor="guest-name">Full Name *</Label>
                <Input
                  id="guest-name"
                  value={guestDetails.name}
                  onChange={(e) => setGuestDetails(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guest-email">Email *</Label>
                <Input
                  id="guest-email"
                  type="email"
                  value={guestDetails.email}
                  onChange={(e) => setGuestDetails(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email address"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guest-phone">Phone Number *</Label>
                <Input
                  id="guest-phone"
                  type="tel"
                  value={guestDetails.phone}
                  onChange={(e) => setGuestDetails(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>
          )}

          <Separator />

          <div>
            <h3 className="font-medium mb-3">Order Summary</h3>
            <div className="space-y-2">
              {getCartDetails().map(({ item, event, ticket }) => (
                <div key={`${item.ticketId}-${item.eventId}`} className="flex justify-between text-sm">
                  <span>{event!.title} - {ticket!.name} (×{item.quantity})</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
          </div>

          <Button className="w-full" size="lg" onClick={proceedToPayment}>
            Continue to Payment
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">Payment</h1>
        <Button variant="ghost" onClick={() => setStep('details')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Details
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            PayPal Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              This is a demo environment. Click "Complete Payment" to simulate a successful PayPal transaction.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-3">Final Order Summary</h3>
            <div className="space-y-2">
              {getCartDetails().map(({ item, event, ticket }) => (
                <div key={`${item.ticketId}-${item.eventId}`} className="flex justify-between text-sm">
                  <span>{event!.title} - {ticket!.name} (×{item.quantity})</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
          </div>

          <Button 
            className="w-full" 
            size="lg" 
            onClick={processPayment}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing Payment...' : 'Complete Payment'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardContent className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-4">Payment Successful!</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Your tickets have been generated and sent to your email.
          </p>
          
          {completedOrder && (
            <div className="bg-muted rounded-lg p-6 mb-8">
              <h3 className="font-medium mb-4">Order Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Order ID:</span>
                  <span className="font-mono">{completedOrder.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Tickets:</span>
                  <span>{completedOrder.tickets.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Paid:</span>
                  <span>${completedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={() => onNavigate('dashboard')} className="flex-1">
              View My Tickets
            </Button>
            <Button variant="outline" onClick={() => onNavigate('home')} className="flex-1">
              Browse More Events
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {step === 'cart' && renderCartStep()}
        {step === 'details' && renderDetailsStep()}
        {step === 'payment' && renderPaymentStep()}
        {step === 'success' && renderSuccessStep()}
      </div>
    </div>
  );
}