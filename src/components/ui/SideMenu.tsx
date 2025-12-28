"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/utils/utils";
import { SetStateAction, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Icon from "./Icon";
import { ScrollShadow } from "@heroui/react";

interface Props {
  children: React.ReactNode;
  showAside: boolean;
  className?: string;
  icon?: "x" | "arrows";
  width?: number;
  heigth?: number;
  backdrop?: { show: boolean; blur?: boolean };
  disabledClosed?: boolean;
  position?: "left" | "right" | "top" | "bottom";
  setShowAside: (value: SetStateAction<boolean>) => void;
}

const SideMenu = ({
  children,
  heigth = 300,
  width = 400,
  icon = "x",
  position = "right",
  disabledClosed = false,
  showAside,
  setShowAside,
  className = "",
  backdrop = { show: true, blur: false },
}: Props) => {
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isLeft = position === "left";
  const directionMultiplier = isLeft ? 1 : -1;

  if (disabledClosed) {
    backdrop = { show: true, blur: backdrop.blur };
  }

  useEffect(() => {
    if (showAside) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showAside]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !disabledClosed) {
        setShowAside(false);
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        setTouchStartX(event.touches[0].clientX);
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (touchStartX !== null) {
        const touchMoveX = event.touches[0].clientX;
        const touchDistanceX = touchStartX - touchMoveX;
        const swipeThreshold = 100;

        if (touchDistanceX * directionMultiplier > swipeThreshold) {
          setShowAside(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [touchStartX, directionMultiplier]);

  if (!isClient) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {showAside && (
        <>
          {/* FONDO */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(
              "fixed bg-custom-black/70 top-0 z-9998 w-full h-screen",
              {
                "backdrop-blur-sm bg-custom-black/70":
                  backdrop.blur,
              }
            )}
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.7) !important",
              zIndex: 9998
            }}
            onClick={() => {
              if (!disabledClosed) {
                setShowAside(false);
              }
            }}
          />

          {/* CONTENIDO */}
          <motion.div
            initial={
              position == "top" || position == "bottom"
                ? { y: position == "top" ? "-100vh" : "100vh" }
                : {
                  x: position !== "left" ? "100vw" : "-100vw",
                }
            }
            animate={
              position == "top" || position == "bottom" ? { y: 0 } : { x: 0 }
            }
            exit={
              position == "top" || position == "bottom"
                ? { y: position == "top" ? "-100vh" : "100vh" }
                : {
                  x: position !== "left" ? "100vw" : "-100vw",
                }
            }
            transition={{
              type: "tween",
              duration: 0.4,
            }}
            style={{
              zIndex: 9999,
              ...(position == "left" || position == "right"
                ? {
                  maxWidth: width,
                  height: "100vh",
                }
                : { height: heigth ?? "90vh", width: "100%" })
            }}
            className={cn(
              "w-full bg-background shadow-soft text-default-foreground z-[9999] h-[90vh] fixed p-4",
              className,
              {
                "left-0": position == "left",
                "right-0": position == "right",
                "h-screen": position == "right" || position == "left",
                "top-0": position !== "bottom",
                "bottom-0": position == "bottom",
              }
            )}
          >
            {!disabledClosed && (
              <Icon
                icon={cn({
                  "x-lg": icon == "x",
                  "chevron-double-down":
                    position == "bottom" && icon == "arrows",
                  "chevron-double-up": position == "top" && icon == "arrows",
                  "chevron-double-left": position == "left" && icon == "arrows",
                  "chevron-double-right":
                    position == "right" && icon == "arrows",
                })}
                className={cn(
                  "absolute text-borders top-2 hover:text-primary right-2 text-lg transition-all cursor-pointer"
                )}
                onClick={() => {
                  setShowAside(false);
                }}
              />
            )}
            <ScrollShadow className="max-h-[98%] px-1" >
              {children}
            </ScrollShadow>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default SideMenu;
