import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '../ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { useAuth } from '../AuthProvider';
import { useKV } from '@github/spark/hooks';
import { CartItem } from '../../lib/types';
import { 
  Calendar, 
  Ticket, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  House,
  Tag,
  Package,
  Info,
  Images,
  Phone,
  ShoppingCart
} from '@phosphor-icons/react';
import { toast } from 'sonner';

interface NavbarProps {
  onNavigate: (view: string) => void;
  currentView: string;
}

export function Navbar({ onNavigate, currentView }: NavbarProps) {
  const { user, role, login, logout, isLoading: authLoading } = useAuth();
  const [cart] = useKV<CartItem[]>("cart", []);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);
    
    try {
      const success = await login(loginForm.email, loginForm.password);
      if (success) {
        setIsLoginOpen(false);
        setLoginForm({ email: '', password: '' });
        toast.success('Logged in successfully!');
      } else {
        toast.error('Invalid credentials. Try admin@eventpro.com / admin123 or any user email / demo123');
      }
    } finally {
      setIsLoginLoading(false);
    }
  };

  const navItems = [
    { label: 'Home', view: 'home', icon: House },
    { label: 'Events', view: 'events', icon: Calendar },
    { label: 'Offers', view: 'offers', icon: Tag },
    { label: 'Packages', view: 'packages', icon: Package },
    { label: 'About', view: 'about', icon: Info },
    { label: 'Gallery', view: 'gallery', icon: Images },
    { label: 'Contact', view: 'contact', icon: Phone }
  ];

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">EventPro</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === item.view
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('checkout')}
              className="relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onNavigate('dashboard')}>
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  {role === 'admin' && (
                    <DropdownMenuItem onClick={() => onNavigate('admin')}>
                      <Settings className="mr-2 h-4 w-4" />
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Sign In</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Sign in to your account</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@eventpro.com"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="admin123"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoginLoading}>
                      {isLoginLoading ? 'Signing In...' : 'Sign In'}
                    </Button>
                  </form>
                  <div className="text-sm text-muted-foreground text-center">
                    Demo credentials:<br />
                    Admin: admin@eventpro.com / admin123<br />
                    User: john.smith@email.com / demo123
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {/* Mobile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {navItems.map((item) => (
                  <DropdownMenuItem key={item.view} onClick={() => onNavigate(item.view)}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}