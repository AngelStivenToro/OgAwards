"use client";

import Icon from "@/components/ui/Icon";
import { motion } from "framer-motion";
import { cn } from "@/utils/utils";

const CornerButtons = ({
  btns,
  position = "left",
}: {
  btns: { onClick: () => void; icon: string; width: string; text: string }[];
  position?: "left" | "right";
}) => {
  return (
    <section
      className={cn("fixed bottom-3 flex flex-col gap-3 z-20 select-none", {
        "left-3": position === "left",
        "right-3": position === "right",
      })}
    >
      {btns.map((btn, i) => (
        <motion.div
          className="py-2 px-3 bg-primary hover:bg-primary/75 w-[50px] overflow-hidden rounded-full cursor-pointer z-20 text-default-white"
          key={i}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0 }}
          whileHover={{
            scale: 1.1,
            width: btn.width,
            opacity: 1,
            color: "#fff",
          }}
          onClick={btn.onClick}
        >
          <motion.div
            initial="hidden"
            className={cn(
              "relative flex flex-row gap-4 items-center font-medium",
              { "flex-row-reverse": position == "right" },
            )}
          >
            <motion.div
              transition={{ duration: 1.5 }}
              animate={{ rotate: [0, 360] }}
            >
              <Icon icon={btn.icon} className="text-2xl text-default-white" />
            </motion.div>
            <div
              className={cn(
                "absolute flex items-center bg-transparent min-w-full",
                {
                  "right-[40px]": position === "right",
                  "left-[40px]": position === "left",
                },
              )}
            >
              <p className="absolute min-w-full">{btn.text}</p>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </section>
  );
};

export default CornerButtons;
