import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { cn } from "@/utils/utils";
import { Divider } from "@heroui/react";
import Icon from "@/components/ui/Icon";

interface Props {
  isOpen: boolean;
  drag?: boolean;
  closeButton?: boolean;
  classContainer?: string;
  closeDisabled?: boolean;
  disabledFocus?: boolean;
  children?: React.ReactNode;
  ref?: MutableRefObject<null>;
  setIsOpen: (value: boolean) => void;
}

const Modal = ({
  isOpen,
  setIsOpen,
  closeDisabled,
  ref,
  disabledFocus = false,
  drag = false,
  classContainer,
  closeButton = !closeDisabled,
  children,
}: Props) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [isMediumScreen, setIsMediumScreen] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : true
  );
  const [isFocused, setIsFocused] = useState(false);

  const dragControls = useDragControls();
  const DRAG_CLOSE_THRESHOLD = 80;

  function startDrag(event: any) {
    dragControls.start(event);
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => {
      setIsMediumScreen(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const divRef = useRef(null);

  const sanitizeClassContainerForMobile = (classes?: string) => {
    if (!classes || !isMediumScreen) return classes;
    return classes.replace(/\bmax-w-[^\s]+/g, "").trim();
  };

  const resolvedContainerClasses = sanitizeClassContainerForMobile(classContainer);

  const handleClick = () => {
    if (!disabledFocus) {
      setIsFocused(true);
    }
    return null;
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (!disabledFocus) {
      // @ts-ignore
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    return null;
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !closeDisabled) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeDisabled, setIsOpen]);

  // Solo renderizamos el portal si estamos en el cliente
  if (!isClient) return null;

  return createPortal(
    <>
      <AnimatePresence mode="wait">
        {isOpen && !drag && (
          <motion.section
            key="modal-overlay"
            onClick={() => {
              if (!closeDisabled) {
                if (isMediumScreen) {
                  setIsOpen(false);
                }
              }
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.2,
            }}
            className="fixed top-0 left-0 w-full h-full bg-custom-black/70 overflow-y-auto z-40"
          >
            <motion.div
              drag="y"
              dragElastic={0}
              dragSnapToOrigin
              key="modal-content"
              dragListener={false}
              dragMomentum={false}
              dragControls={dragControls}
              transition={{ duration: 0.2 }}
              dragConstraints={
                isMediumScreen
                  ? { top: 0, bottom: DRAG_CLOSE_THRESHOLD * 1.5 }
                  : { top: 0, bottom: 0 }
              }
              animate={isMediumScreen ? { y: 0 } : { opacity: 1 }}
              exit={isMediumScreen ? { y: 1000 } : { opacity: 0 }}
              initial={isMediumScreen ? { y: 1000 } : { opacity: 0 }}
              onClick={(e) => {
                e.stopPropagation()
              }}
              onDrag={(event, info) => {
                if (info.offset.y < 0) {
                  event.stopPropagation();
                  return;
                }
                event.stopPropagation();
              }}
              onDragEnd={(event, info) => {
                if (info.offset.y > DRAG_CLOSE_THRESHOLD) {
                  setIsOpen(false);
                }
              }}
              className={cn(
                "md:my-8 mx-auto transform bottom-0 md:bottom-auto p-4 fixed md:relative rounded-t-2xl md:rounded-2xl bg-background text-left align-middle text-default-foreground shadow-standard transition-all w-full md:w-[98%] max-h-full md:max-h-min overflow-y-auto md:overflow-hidden",
                resolvedContainerClasses
              )}
            >
              {!closeDisabled && (
                <>
                  {/* X para cerrar el modal en DESKTOP */}
                  <Icon
                    icon="x"
                    onClick={() => setIsOpen(false)}
                    className="hidden md:block absolute text-default-500 top-1 right-3 hover:text-primary text-3xl transition-all cursor-pointer z-40"
                  />
                  {/* X y Barra para cerrar el modal en MOBILE */}
                  <div
                    style={{ touchAction: "none" }}
                    onPointerDownCapture={startDrag}
                    className="flex fixed left-0 md:hidden items-start justify-center w-full h-8"
                  >
                    {/* Barra */}
                    <Divider className="w-[40%] h-[8px] rounded-lg" />

                    {/* X para cerrar el modal */}
                    {closeButton && (
                      <Icon
                        icon="x-lg"
                        onClick={() => setIsOpen(false)}
                        className="absolute top-0 right-4 rounded-full flex items-center justify-center p-2 bg-divider hover:text-primary transition-all cursor-pointer md:hidden w-8 h-8 hover:bg-divider z-40"
                      />
                    )}
                  </div>
                </>
              )}
              <div
                className={cn("pt-4 md:pt-0", {
                  "pt-0": closeDisabled,
                })}
              >
                {children}
              </div>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {isOpen && drag && (
          <motion.section
            drag
            dragElastic={0}
            dragMomentum={false}
            dragListener={false}
            dragConstraints={ref}
            exit={{ opacity: 0 }}
            onClick={handleClick}
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            key="modal-drag-content"
            dragControls={dragControls}
            ref={!disabledFocus ? divRef : null}
            tabIndex={!disabledFocus ? 0 : undefined}
            className={cn(
              "fixed modal-selected inset-0 overflow-y-auto pointer-events-auto bg-background text-default-foreground w-[98%] h-[98%] my-4 rounded-large shadow-2xl mx-auto p-4 z-40",
              classContainer,
              { "z-50": isFocused }
            )}
          >
            <div className="absolute right-3 top-2 w-auto flex items-center justify-between gap-1">
              <div
                style={{ touchAction: "none" }}
                onPointerDownCapture={startDrag}
                className="h-8 flex items-center justify-center hover:cursor-grab text-default-400 hover:text-default-foreground active:text-default-foreground transition-all active:cursor-grabbing"
              >
                <Icon icon="arrows-move" className="text-xl" />
              </div>
              {!closeDisabled && (
                <Icon
                  icon="x"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                  className="text-borders hover:text-primary text-3xl flex items-center justify-center text-default-400 transition-all cursor-pointer"
                />
              )}
            </div>
            {children}
          </motion.section>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
};
export default Modal;
