"use client";

import { cn } from "@/utils/utils";
import type React from "react";

const Icon = ({
  icon,
  className = "",
  onClick,
  title,
}: {
  icon: string;
  title?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  className?: string;
}) => {
  return (
    <i
      onClick={onClick}
      title={title}
      className={cn(`bi bi-${icon.split(" ")[0]}`, className)}
    ></i>
  );
};

export default Icon;
