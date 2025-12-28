"use client";

import { AuthDB } from "@/libs/auth-db";
import { Award } from "@/libs/types";
import { VotingDB } from "@/libs/voting-db";
import { Button, Card, CardBody, Chip } from "@heroui/react";
import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { motion } from "framer-motion";
import Icon from "./ui/Icon";
import NomineeMedia, { NomineeMediaButton } from "./NomineeMedia";

interface VotingCardProps {
  award: Award;
  onVoteSuccess: () => void;
}

export default function VotingCard({ award, onVoteSuccess }: VotingCardProps) {
  const [rankings, setRankings] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [hasVotedForAward, setHasVotedForAward] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNominee, setSelectedNominee] = useState<any>(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  useEffect(() => {
    const checkIfVoted = async () => {
      const currentUser = AuthDB.getCurrentUser();
      if (currentUser) {
        try {
          const votes = await VotingDB.getVotes(award.id);
          const userVote = votes.find(
            (vote: any) => vote.userId === currentUser.id
          );
          setHasVotedForAward(!!userVote);
          if (userVote) {
            setRankings(userVote.rankings);
          }
        } catch (error) {
          console.error("Error checking vote status:", error);
        }
      }
      setIsLoading(false);
    };
    checkIfVoted();
  }, [award.id]);

  const handleNomineeClick = (nomineeId: string) => {
    if (hasVotedForAward) return; // No permitir cambios si ya votó

    if (rankings.includes(nomineeId)) {
      // Remove from rankings
      setRankings(rankings.filter((id) => id !== nomineeId));
    } else if (rankings.length < award.nominees.length) {
      // Add to rankings
      setRankings([...rankings, nomineeId]);
    }
  };

  const handleMediaClick = (nominee: any) => {
    setSelectedNominee(nominee);
    setIsMediaModalOpen(true);
  };

  const handleCloseMediaModal = () => {
    setIsMediaModalOpen(false);
    setSelectedNominee(null);
  };

  const handleSubmit = async () => {
    if (rankings.length === 0) {
      setError("Debes seleccionar al menos una opción");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const result = await VotingDB.submitVote(award.id, rankings);
      if (result.success) {
        // Actualizar estado local inmediatamente
        setHasVotedForAward(true);
        // Llamar al callback para actualizar el estado global
        onVoteSuccess();
      } else {
        setError(result.error || "Error al enviar el voto");
      }
    } catch (err) {
      setError("Error inesperado al votar");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getNomineeRank = (nomineeId: string) => {
    const index = rankings.indexOf(nomineeId);
    return index === -1 ? null : index + 1;
  };

  const currentUser = AuthDB.getCurrentUser();

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardBody className="p-6">
          <LoadingSpinner label="Verificando estado de votación..." />
        </CardBody>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0% -10% 0%" }}
    >
      <Card className="w-full max-w-2xl mx-auto card-hover animate-scale-in">
        <CardBody className="p-6">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-primary animate-fade-in">
                {award.title}
              </h3>
              {hasVotedForAward && (
                <div className="flex items-center gap-2">
                  <Chip color="success" variant="flat">
                    Ya votado
                  </Chip>
                </div>
              )}
            </div>
            <p className="text-default-600 text-xs">{award.description}</p>
          </div>

          <div className="space-y-3 mb-6">
            <p className="text-sm text-default-500 mb-4">
              <Icon icon="info-circle" className="inline mr-2" />
              {hasVotedForAward
                ? "Tu voto para esta categoría:"
                : "Ordena los nominados de mejor a peor (haz clic para ordenar)"}
            </p>

            {award.nominees.map((nominee) => {
              const rank = getNomineeRank(nominee.id);
              return (
                <div
                  key={nominee.id}
                  onClick={() =>
                    !hasVotedForAward && handleNomineeClick(nominee.id)
                  }
                  className={`p-4 border rounded-lg select-none cursor-pointer transition-all ${
                    rank !== null
                      ? "border-blue bg-blue/20"
                      : "border-divider hover:border-default-400"
                  } ${hasVotedForAward ? "cursor-not-allowed opacity-75" : ""}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm leading-tight break-words">
                        {nominee.name}
                      </h4>
                      <p className="text-xs text-default-600 mt-1 leading-tight line-clamp-2">
                        {nominee.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {nominee.media && (
                        <NomineeMediaButton
                          media={nominee.media} 
                          onClick={() => handleMediaClick(nominee)}
                        />
                      )}
                      {rank !== null && (
                        <div className="ml-4">
                          <Chip
                            color="primary"
                            variant="solid"
                            className="min-w-8 text-center font-bold"
                          >
                            #{rank}
                          </Chip>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {rankings.length > 0 && (
            <div className="mb-4 p-3 bg-default/60 rounded-lg">
              <p className="text-sm font-semibold text-primary mb-2">
                Tu orden actual:
              </p>
              <div className="space-y-1">
                {rankings.map((nomineeId, index) => {
                  const nominee = award.nominees.find(
                    (n) => n.id === nomineeId
                  );
                  return (
                    <div key={nomineeId} className="text-sm">
                      {index + 1}. {nominee?.name}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {!hasVotedForAward && (
            <Button
              color="primary"
              className="w-full"
              onPress={handleSubmit}
              isLoading={isSubmitting}
              isDisabled={rankings.length < 1}
            >
              Enviar Voto
            </Button>
          )}

          {hasVotedForAward && (
            <div className="text-center text-success font-semibold p-4 bg-success/20 rounded-lg">
              ✓ Ya has votado en esta categoría
            </div>
          )}
        </CardBody>
      </Card>
      
      {selectedNominee && (
        <NomineeMedia 
          nominee={selectedNominee}
          isOpen={isMediaModalOpen}
          onClose={handleCloseMediaModal}
        />
      )}
    </motion.div>
  );
}
