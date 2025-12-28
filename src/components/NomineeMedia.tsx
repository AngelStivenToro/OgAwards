"use client";

import { useState } from "react";
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody,
  Button,
  Image,
  Chip
} from "@heroui/react";
import { motion } from "framer-motion";
import Icon from "./ui/Icon";

export interface MediaItem {
  type: "image" | "video" | "audio" | "text";
  url?: string;
  content?: string;
  title?: string;
}

interface NomineeMediaProps {
  nominee: {
    id: string;
    name: string;
    description: string;
    media?: MediaItem;
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function NomineeMedia({ nominee, isOpen, onClose }: NomineeMediaProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!nominee.media) return null;

  const renderMediaContent = () => {
    const { type, url, content, title } = nominee.media!;

    switch (type) {
      case "image":
        return (
          <div className="space-y-4">
            {title && (
              <h3 className="text-lg font-semibold text-center">{title}</h3>
            )}
            <div className="relative rounded-lg overflow-hidden bg-default-100">
              <Image
                src={url!.startsWith('/') ? url : `/${url}`}
                alt={nominee.name}
                className="w-full h-auto max-h-[400px] object-contain"
                onLoad={() => setIsLoading(false)}
                fallbackSrc="/placeholder-image.jpg"
              />
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
            </div>
          </div>
        );

      case "video":
        return (
          <div className="space-y-4">
            {title && (
              <h3 className="text-lg font-semibold text-center">{title}</h3>
            )}
            <div className="relative rounded-lg overflow-hidden bg-black">
              <video
                src={url!.startsWith('/') ? url : `/${url}`}
                controls
                className="w-full h-auto max-h-[400px]"
                preload="metadata"
              >
                Tu navegador no soporta reproducción de video.
              </video>
            </div>
          </div>
        );

      case "audio":
        return (
          <div className="space-y-4">
            {title && (
              <h3 className="text-lg font-semibold text-center">{title}</h3>
            )}
            <div className="bg-default-100 rounded-lg p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <Icon icon="music-note-beamed" className="text-3xl text-primary" />
                </div>
              </div>
              <audio
                src={url!.startsWith('/') ? url : `/${url}`}
                controls
                className="w-full"
                preload="metadata"
              >
                Tu navegador no soporta reproducción de audio.
              </audio>
            </div>
          </div>
        );

      case "text":
        return (
          <div className="space-y-4">
            {title && (
              <h3 className="text-lg font-semibold text-center">{title}</h3>
            )}
            <div className="bg-default-100 rounded-lg p-6 max-h-[400px] overflow-y-auto">
              <div className="prose prose-sm max-w-none">
                <p className="text-default-700 leading-relaxed whitespace-pre-wrap">
                  {content}
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <Icon icon="file-earmark" className="text-4xl text-default-400 mb-2" />
            <p className="text-default-500">Tipo de media no soportado</p>
          </div>
        );
    }
  };

  const getMediaIcon = () => {
    const { type } = nominee.media!;
    
    switch (type) {
      case "image": return "image";
      case "video": return "play-circle";
      case "audio": return "music-note-beamed";
      case "text": return "file-text";
      default: return "file-earmark";
    }
  };

  const getMediaColor = () => {
    const { type } = nominee.media!;
    
    switch (type) {
      case "image": return "success";
      case "video": return "primary";
      case "audio": return "warning";
      case "text": return "secondary";
      default: return "default";
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      backdrop="blur"
      classNames={{
        base: "bg-default-50 dark:bg-default-100",
        header: "pb-2",
        body: "py-6"
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <Icon 
                    icon={getMediaIcon()} 
                    className={`text-2xl text-${getMediaColor()}`}
                  />
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {nominee.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Chip 
                      color={getMediaColor() as any}
                      variant="flat"
                      size="sm"
                    >
                      {nominee.media!.type.toUpperCase()}
                    </Chip>
                    <span className="text-sm text-default-500">
                      {nominee.description}
                    </span>
                  </div>
                </div>
              </div>
            </ModalHeader>
            
            <ModalBody>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderMediaContent()}
              </motion.div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

// Componente para el botón de media en las nominaciones
interface NomineeMediaButtonProps {
  media?: MediaItem;
  onClick: () => void;
}

export function NomineeMediaButton({ media, onClick }: NomineeMediaButtonProps) {
  if (!media) return null;

  const getMediaIcon = () => {
    switch (media.type) {
      case "image": return "image";
      case "video": return "play-circle";
      case "audio": return "music-note-beamed";
      case "text": return "file-text";
      default: return "file-earmark";
    }
  };

  const getMediaColor = () => {
    switch (media.type) {
      case "image": return "success";
      case "video": return "primary";
      case "audio": return "warning";
      case "text": return "secondary";
      default: return "default";
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        isIconOnly
        size="sm"
        variant="flat"
        color={getMediaColor() as any}
        onClick={onClick}
        className="ml-2"
      >
        <Icon icon={getMediaIcon()} className="text-sm" />
      </Button>
    </motion.div>
  );
}
