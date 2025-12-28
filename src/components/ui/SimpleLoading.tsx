"use client";

import { cn } from "@/utils/utils";
import { Spinner } from "@heroui/react";

export const SimpleLoading = ({
  height = "auto",
}: {
  height?: "auto" | "md" | "lg";
}) => {
  return (
    <section
      className={cn(
        "w-full flex justify-center items-center gap-4 py-5 select-none margin-header",
        {
          "h-[150px]": height === "md",
          "h-[300px]": height === "lg",
        },
      )}
    >
      <Spinner
        size="lg"
        classNames={{
          wrapper: "w-[50px] h-[50px]",
        }}
      />
      <p className="font-medium text-gray animate-pulse text-2xl">
        Cargando...
      </p>
    </section>
  );
};
