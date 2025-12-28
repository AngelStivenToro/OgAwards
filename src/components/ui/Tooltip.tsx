"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip as TooltipNexUi,
} from "@heroui/react";
import { cn } from "@/utils/utils";

interface Props {
  content: string | React.ReactNode;
  children: React.ReactNode;
  classNames?: { mobile?: string; desktop?: string; trigger?: string };
}

const Tooltip = ({ classNames, children, content }: Props) => {
  return (
    <>
      {/* MOBILE */}
      <div className="block md:hidden">
        <Popover>
          <PopoverTrigger className={classNames?.trigger}>
            <button type="button" className={cn("outline-none")}>
              {children}
            </button>
          </PopoverTrigger>
          <PopoverContent
            className={cn(
              "outline-none text-default-foreground",
              classNames?.mobile,
            )}
          >
            {content}
          </PopoverContent>
        </Popover>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:block">
        <TooltipNexUi
          className={cn(
            "outline-none text-default-foreground",
            classNames?.desktop,
          )}
          content={content}
        >
          <button
            type="button"
            className={cn("outline-none", classNames?.trigger)}
          >
            {children}
          </button>
        </TooltipNexUi>
      </div>
    </>
  );
};

export default Tooltip;
