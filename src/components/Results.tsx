'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, Chip, Progress } from '@heroui/react';
import { Award } from '@/libs/types';
import { VotingDB } from '@/libs/voting-db';
import LoadingSpinner from './LoadingSpinner';

interface ResultsProps {
  awards: Award[];
}

export default function Results({ awards }: ResultsProps) {
  const [results, setResults] = useState<{ [key: string]: any[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      const resultsData: { [key: string]: any[] } = {};
      for (const award of awards) {
        resultsData[award.id] = await VotingDB.getResults(award.id);
      }
      setResults(resultsData);
      setLoading(false);
    };
    loadResults();
  }, [awards]);

  const getProgressValue = (points: number, maxPoints: number) => {
    return maxPoints > 0 ? (points / maxPoints) * 100 : 0;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center mb-6">Resultados de Votación</h2>
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="w-full max-w-2xl mx-auto">
            <CardBody className="p-6">
              <LoadingSpinner label="Cargando resultados..." />
            </CardBody>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-6 animate-pulse">Resultados de Votación</h2>
      
      {awards.map((award, awardIndex) => {
        const awardResults = results[award.id] || [];
        const maxPoints = Math.max(...awardResults.map((r: any) => r.points), 1);

        return (
          <Card 
            key={award.id} 
            className="w-full max-w-2xl mx-auto transform transition-all duration-500 hover:scale-105"
            style={{
              animationDelay: `${awardIndex * 100}ms`
            }}
          >
            <CardBody className="p-6">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold animate-fade-in">{award.title}</h3>
                  <Chip color="primary" variant="flat">{award.category}</Chip>
                </div>
                <p className="text-gray-600">{award.description}</p>
              </div>

              <div className="space-y-3">
                {awardResults.map((result: any, index: number) => (
                  <div 
                    key={result.nominee.id} 
                    className="space-y-2 transform transition-all duration-300"
                    style={{
                      animationDelay: `${(awardIndex * 100) + (index * 50)}ms`
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm transform transition-all duration-300 hover:scale-110 ${
                          index === 0 ? 'bg-yellow-500' : 
                          index === 1 ? 'bg-gray-400' : 
                          index === 2 ? 'bg-orange-600' : 'bg-gray-300'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold">{result.nominee.name}</h4>
                          <p className="text-sm text-gray-600">{result.nominee.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{result.points}</div>
                        <div className="text-sm text-gray-500">puntos</div>
                      </div>
                    </div>
                    <Progress 
                      value={getProgressValue(result.points, maxPoints)}
                      color={index === 0 ? 'warning' : index === 1 ? 'default' : index === 2 ? 'danger' : 'default'}
                      className="w-full"
                      size="sm"
                    />
                  </div>
                ))}

                {awardResults.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    No hay votos registrados para esta categoría
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
