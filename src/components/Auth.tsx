'use client';

import { useState } from 'react';
import { Card, CardBody, Input, Button, Divider } from '@heroui/react';
import { AuthDB } from '@/libs/auth-db';

interface AuthProps {
  onAuthSuccess: () => void;
}

export default function Auth({ onAuthSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const result = await AuthDB.login(username);
        if (result.success) {
          onAuthSuccess();
        } else {
          setError(result.error || 'Error al iniciar sesión');
        }
      } else {
        if (!email) {
          setError('El email es requerido para registro');
          setLoading(false);
          return;
        }
        const result = await AuthDB.register(username, email);
        if (result.success) {
          const loginResult = await AuthDB.login(username);
          if (loginResult.success) {
            onAuthSuccess();
          } else {
            setError(loginResult.error || 'Error al iniciar sesión después del registro');
          }
        } else {
          setError(result.error || 'Error al registrarse');
        }
      }
    } catch (err: any) {
      console.error('Error en auth:', err);
      setError(err.message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
      <Card className="w-full max-w-md">
        <CardBody className="p-8">
          <div className="flex flex-col items-center mb-6">
            <img 
              src="/awards.png" 
              alt="OG Awards" 
              className="w-48 h-48 object-contain"
            />
            <h2 className="text-2xl font-bold text-center">
              {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Usuario"
              placeholder="Ingresa tu nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
            />
            
            {!isLogin && (
              <Input
                label="Email"
                type="email"
                placeholder="Ingresa tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            )}
            
            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}
            
            <Button
              type="submit"
              color="primary"
              className="w-full"
              isLoading={loading}
              disabled={!username || (!isLogin && !email)}
            >
              {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
            </Button>
          </form>
          
          <Divider className="my-4" />
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-blue-600 hover:underline"
            >
              {isLogin 
                ? '¿No tienes cuenta? Regístrate' 
                : '¿Ya tienes cuenta? Inicia sesión'
              }
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
