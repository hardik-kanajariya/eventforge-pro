import React from 'react';
import { AuthProvider } from './components/AuthProvider';
import { Router } from './components/Router';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <AuthProvider>
      <Router />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App