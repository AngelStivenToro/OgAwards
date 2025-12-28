"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, Button, Chip, Tabs, Tab } from "@heroui/react";
import { Award } from "@/libs/types";
import { VotingDB } from "@/libs/voting-db";
import { AuthDB } from "@/libs/auth-db";
import VotingCard from "./VotingCard";
import Results from "./Results";
import SkeletonCard from "./SkeletonCard";
import AnimatedText from "./ui/AnimateText";
import WelcomeModal, { useWelcomeModal } from "./WelcomeModal";

export default function Dashboard() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [activeTab, setActiveTab] = useState("voting");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen: isWelcomeOpen, handleClose: closeWelcomeModal } = useWelcomeModal();

  useEffect(() => {
    // Inicializar premios si no existen
    const initializeData = async () => {
      try {
        await VotingDB.initializeAwards();
        setAwards(await VotingDB.getAwards());
        setCurrentUser(AuthDB.getCurrentUser());
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initializeData();
  }, []);

  const handleVoteSuccess = () => {
    // Solo actualizar el estado del usuario, no recargar todos los datos
    const updatedUser = AuthDB.getCurrentUser();
    setCurrentUser(updatedUser);
  };

  const handleLogout = () => {
    AuthDB.logout();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-default-50 py-4">
      <div className="w-[95%] mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center justify-center gap-4">
            <img
              src="/awards.png"
              alt="OG GANG AWARDS"
              className="w-24 h-24 sm:w-24 sm:h-24 object-contain"
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-primary">
                <AnimatedText
                  size="title"
                  delay={1.5}
                  animate="appear"
                  text="OG GANG AWARDS 2025"
                />
              </h1>
              <div className="text-default-500 mt-1">
                Bienvenido,{" "}
                {currentUser?.username ? (
                  <span className="font-semibold text-default-700">
                    {currentUser?.username}
                  </span>
                ) : (
                  <span className="bg-default-200 rounded-md animate-pulse w-20 inline-block text-default-200 select-none">
                    Cargando...
                  </span>
                )}
                !
                {currentUser?.hasVoted && (
                  <Chip color="success" variant="flat" className="ml-2">
                    Ya has votado
                  </Chip>
                )}
              </div>
            </div>
          </div>
          <Button color="danger" variant="flat" onPress={handleLogout}>
            Cerrar Sesión
          </Button>
        </div>

        {/* Tabs */}
        <Tabs
          selectedKey={activeTab}
          onSelectionChange={(key) => setActiveTab(key as string)}
        >
          <Tab key="voting" title="Votación">
            <div className="space-y-6 mt-6">
              {isLoading ? (
                <>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <SkeletonCard key={index} />
                  ))}
                </>
              ) : (
                awards.map((award) => (
                  <VotingCard
                    key={award.id}
                    award={award}
                    onVoteSuccess={handleVoteSuccess}
                  />
                ))
              )}
            </div>
          </Tab>

          <Tab
            key="results"
            title="Resultados"
            isDisabled={!currentUser?.hasVoted}
          >
            <div className="mt-6">
              {!currentUser?.hasVoted ? (
                <Card className="w-full max-w-2xl mx-auto">
                  <CardBody className="p-8 text-center">
                    <div className="mb-4">
                      <div className="w-16 h-16 mx-auto mb-4 bg-default-200 rounded-full flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-default-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        Resultados Bloqueados
                      </h3>
                      <p className="text-default-600 mb-4">
                        Debes completar todas las votaciones para ver los
                        resultados.
                      </p>
                      <div className="text-sm text-default-500">
                        {currentUser ? (
                          <span>Te faltan votaciones por completar.</span>
                        ) : (
                          <span>Debes iniciar sesión para votar.</span>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ) : (
                <Results awards={awards} />
              )}
            </div>
          </Tab>
        </Tabs>
      </div>
      
      <WelcomeModal isOpen={isWelcomeOpen} onClose={closeWelcomeModal} />
    </div>
  );
}
