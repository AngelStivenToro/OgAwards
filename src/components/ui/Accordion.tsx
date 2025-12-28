"use client";

import { cn } from "@/utils/utils";
import { ClassValue } from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Icon from "./Icon";

const Accordion = ({
  className,
  defaultOpenedItem,
  variant = "divider",
  items,
}: {
  className?: ClassValue;
  defaultOpenedItem?: number;
  variant?: "divider" | "splitted" | "shadow";
  items: {
    title: string;
    subtitle?: string;
    startContent?: React.ReactNode;
    element: React.ReactNode;
    classnames?: {
      header?: ClassValue;
      container?: ClassValue;
    };
  }[];
}) => {
  const [openedItem, setOpenedItem] = useState<number | null>(
    defaultOpenedItem &&
      defaultOpenedItem > 0 &&
      defaultOpenedItem <= items.length
      ? defaultOpenedItem - 1
      : null
  );

  return (
    <section
      className={cn(
        "flex flex-col",
        {
          "gap-2": variant === "splitted",
          "gap-3": variant === "shadow",
        },
        className
      )}
    >
      {items.map((item, i) => (
        <motion.article
          className={cn("", {
            "border-b border-divider last:border-0": variant === "divider",
            "bg-background rounded-large border-2 border-divider":
              variant === "splitted",
            "bg-background rounded-large shadow-soft": variant === "shadow",
          })}
          key={i}
        >
          <div
            className={cn(
              "flex items-center justify-between select-none cursor-pointer py-3 min-h-[60px]",
              {
                "px-3 py-2": variant === "splitted" || variant === "shadow",
                "border-b border-divider":
                  variant === "splitted" && openedItem === i,
              },
              item.classnames?.header
            )}
            onClick={() => setOpenedItem(openedItem === i ? null : i)}
          >
            <div className="flex justify-start items-center gap-2">
              {item.startContent && item.startContent}

              <div>
                <p className="text-lg text-default-foreground font-medium">
                  {item.title}
                </p>

                {item.subtitle && (
                  <p className="text-sm text-default-500">{item.subtitle}</p>
                )}
              </div>
            </div>

            <motion.div animate={{ rotate: openedItem == i ? -90 : 0 }}>
              <Icon className="text-sm text-default-500" icon="chevron-left" />
            </motion.div>
          </div>
          <AnimatePresence>
            {i === openedItem && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={cn("overflow-hidden", item.classnames?.container)}
              >
                {item.element}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.article>
      ))}
    </section>
  );
};

export default Accordion;
