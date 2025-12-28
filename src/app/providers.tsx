"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";


export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        themes={["light", "dark"]}
      >
        <div className="flex flex-col min-h-[100vh] bg-default-white dark:bg-custom-black text-foreground">
          {children}
        </div>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
