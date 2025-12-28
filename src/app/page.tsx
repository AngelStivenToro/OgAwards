'use client';

import { useState, useEffect } from 'react';
import { AuthDB } from '@/libs/auth-db';
import Auth from '@/components/Auth';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = AuthDB.getCurrentUser();
    setIsAuthenticated(!!currentUser);
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg font-semibold select-none text-primary animate-pulse">Cargando...</div>
      </div>
    );
  }

  return isAuthenticated ? <Dashboard /> : <Auth onAuthSuccess={handleAuthSuccess} />;
}
