"use client";

import { useState, useEffect } from "react";
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Button,
  Chip,
  Divider
} from "@heroui/react";
import { motion } from "framer-motion";
import Icon from "./ui/Icon";
import { AuthDB } from "@/libs/auth-db";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const instructions = [
    {
      title: "¡Bienvenido a OG GANG AWARDS 2025!",
      content: "Tu opinión es importante. Vota por tus favoritos en diferentes categorías y ayuda a decidir los ganadores.",
      icon: "trophy",
      color: "warning"
    },
    {
      title: "¿Cómo votar?",
      content: "Ordena los nominados haciendo clic en ellos. Arrastra o selecciona del mejor al peor según tu preferencia.",
      icon: "hand-index",
      color: "primary"
    },
    {
      title: "Sistema de puntos",
      content: "1er lugar: 3 puntos | 2do lugar: 2 puntos | 3er lugar: 1 punto. Tu voto determinará los resultados finales.",
      icon: "star",
      color: "success"
    },
    {
      title: "Resultados exclusivos",
      content: "Solo podrás ver los resultados después de votar en TODAS las categorías. ¡Tu voto cuenta!",
      icon: "eye-slash",
      color: "danger"
    }
  ];

  const handleNext = () => {
    if (currentStep < instructions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    // Marcar que el usuario ya vio el modal
    localStorage.setItem('ogawards_welcome_seen', 'true');
    onClose();
  };

  const currentInstruction = instructions[currentStep];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      size="lg"
      backdrop="blur"
      hideCloseButton={currentStep === 0}
      classNames={{
        base: "bg-default-50 dark:bg-default-100",
        header: "pb-2",
        body: "py-6",
        footer: "pt-4"
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <Icon 
                    icon={currentInstruction.icon} 
                    className={`text-2xl text-${currentInstruction.color}`}
                  />
                </motion.div>
                <h2 className="text-xl font-bold text-foreground">
                  {currentInstruction.title}
                </h2>
              </div>
              
              {/* Progress indicator */}
              <div className="flex gap-1 mt-2">
                {instructions.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`h-1 flex-1 rounded-full ${
                      index <= currentStep 
                        ? `bg-${currentInstruction.color}` 
                        : 'bg-default-300'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  />
                ))}
              </div>
            </ModalHeader>
            
            <ModalBody>
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <p className="text-default-600 text-lg leading-relaxed">
                  {currentInstruction.content}
                </p>
                
                {/* Visual indicator */}
                <div className="mt-6 flex justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 200, 
                      damping: 15,
                      delay: 0.2
                    }}
                  >
                    <Chip 
                      color={currentInstruction.color as any}
                      variant="flat"
                      size="lg"
                      className="px-6 py-3"
                    >
                      <span className="font-semibold">
                        {currentStep === 0 && "¡Comencemos!"}
                        {currentStep === 1 && "Paso 1/3"}
                        {currentStep === 2 && "Paso 2/3"}
                        {currentStep === 3 && "Último paso"}
                      </span>
                    </Chip>
                  </motion.div>
                </div>
              </motion.div>
            </ModalBody>
            
            <ModalFooter>
              <div className="flex justify-between w-full">
                {currentStep > 0 ? (
                  <Button
                    variant="flat"
                    color="default"
                    onPress={handlePrevious}
                    startContent={<Icon icon="arrow-left" />}
                  >
                    Anterior
                  </Button>
                ) : (
                  <div />
                )}
                
                <Button
                  color={currentInstruction.color as any}
                  onPress={handleNext}
                  endContent={
                    currentStep < instructions.length - 1 
                      ? <Icon icon="arrow-right" /> 
                      : <Icon icon="check-circle" />
                  }
                >
                  {currentStep < instructions.length - 1 ? "Siguiente" : "¡Entendido!"}
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

// Hook para manejar la lógica del modal
export function useWelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkWelcomeModal = () => {
      const hasSeenModal = localStorage.getItem('ogawards_welcome_seen');
      const currentUser = AuthDB.getCurrentUser();
      
      // Solo mostrar si el usuario está logueado y no ha visto el modal
      if (currentUser && !hasSeenModal) {
        setIsOpen(true);
      }
    };

    checkWelcomeModal();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  return { isOpen, handleClose };
}
