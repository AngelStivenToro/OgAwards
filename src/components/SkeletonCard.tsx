'use client';

import { Card, CardBody, Skeleton } from '@heroui/react';

interface SkeletonCardProps {
  lines?: number;
  showButton?: boolean;
}

export default function SkeletonCard({ lines = 3, showButton = true }: SkeletonCardProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardBody className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4 rounded-lg" />
          <Skeleton className="h-4 w-1/4 rounded-full" />
          
          <div className="space-y-2">
            {Array.from({ length: lines }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-20 w-full rounded-lg" />
              </div>
            ))}
          </div>
          
          {showButton && (
            <Skeleton className="h-10 w-full rounded-lg" />
          )}
        </div>
      </CardBody>
    </Card>
  );
}
