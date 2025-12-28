"use client";

import { cn } from "@/utils/utils";
import { delay, inView, motion } from "framer-motion";
import { useEffect } from "react";

interface Props {
  text: string;
  delay?: number;
  center?: boolean;
  duration?: number;
  className?: string;
  secondText?: string;
  classContainer?: string;
  animate?: "updown" | "appear";
  size?: "title" | "medium" | "subtitle";
}

const AnimatedText = ({
  size,
  text,
  center,
  animate,
  className,
  delay = 6,
  secondText,
  classContainer,
  duration = 0.5,
}: Props) => {
  return (
    <div className={cn("inline-block ", classContainer)}>
      {text && (
        <>
          {animate == "appear" && (
            <p
              className={cn(
                "",
                {
                  "text-center": center,
                  className,
                  "text-2xl md:text-3xl": size == "title",
                  "text-xl md:text-2xl": size == "medium",
                  "text-lg md:text-xl": size == "subtitle",
                }
              )}
            >
              {text.split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: duration, delay: i / delay }}
                >
                  {word}{" "}
                </motion.span>
              ))}
            </p>
          )}
          {animate == "updown" && (
            <section
              className={cn(
                "flex overflow-hidden h-auto ",
                {
                  "justify-center": center,
                  className,
                  "text-2xl md:text-3xl": size == "title",
                  "text-xl md:text-2xl": size == "medium",
                  "text-lg md:text-xl": size == "subtitle",
                }
              )}
            >
              {text.split("").map((letter, i) => (
                <motion.div
                  key={i}
                  style={{ overflow: "hidden" }}
                  whileInView={{ opacity: 1 }}
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: duration,
                    delay: i / 10,
                    opacity: { delay: 0.08, duration: duration },
                  }}
                >
                  {letter == " " ? "\u00A0" : letter}
                </motion.div>
              ))}
            </section>
          )}
          {secondText && (
            <p
              className={cn("font-semibold text-default-400", {
                "text-center": center,
              })}
            >
              {`${secondText}`.split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: duration, delay: i / delay }}
                >
                  {word}{" "}
                </motion.span>
              ))}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default AnimatedText;
