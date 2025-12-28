'use client';

import { Spinner } from '@heroui/react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  label?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'primary', 
  label 
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Spinner size={size} color={color} />
      {label && (
        <p className="mt-2 text-sm text-gray-600">{label}</p>
      )}
    </div>
  );
}
