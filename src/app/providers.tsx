"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { UserProvider } from "../context/UserContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        themes={["light", "dark"]}
      >
        <UserProvider>
          <div className="flex flex-col min-h-[100vh] bg-default-white dark:bg-custom-black text-foreground">
            {children}
          </div>
        </UserProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
