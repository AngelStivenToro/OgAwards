import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      transparent: "#00000000",
      "blurred-white": "#ffffffc7",
      "default-white": "#ffff",
      "soft-white": "#f9f9f9",
      "off-white": "#f3f3f3",
      "custom-black": "#1B1B1B",
      "soft-gray": "#c5c5c5",
      gray: "#898989",
      "dark-gray": "#2B2B2B",
      "soft-green": "#75f0a0",
      green: "#1CCC5B",
      "dark-green": "#117a37",
      "soft-blue": "#729cff",
      blue: "#2D6BFF",
      "dark-blue": "#1F4AB2",
      yellow: "#f1c40f",
      "soft-red": "#ff8a8a",
      red: "#e72828",
      "dark-red": "#8b1111",
      "soft-purple": "#540000",
      purple: "#612D8A",
      "dark-purple": "#381850",
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      layout: {},
      themes: {
        light: {
          colors: {
            primary: { DEFAULT: "#dfbe00a8", foreground: "#ffff" },
            secondary: { DEFAULT: "#540000", foreground: "#ffff" },
            default: { DEFAULT: "#e9e9e9", foreground: "#4A4A4A" },
            background: { DEFAULT: "#f3f3f3", foreground: "#000" },
            foreground: { DEFAULT: "#000", foreground: "#ffff" },
            danger: { DEFAULT: "#e72828", foreground: "#ffff" },
            warning: { DEFAULT: "#e9b435", foreground: "#ffff" },
            success: { DEFAULT: "#1ccc5b", foreground: "#ffff" },
            focus: "#dfbe00a8",
            content1: { DEFAULT: "#f3f3f3", foreground: "#000" },
            content2: "#e9e9e9",
            content3: "#e9e9e9",
            content4: "#1ccc5b",
            overlay: "#1ccc5b",
            divider: "#dbdbdb",
          },
        },
        dark: {
          colors: {
            primary: { DEFAULT: "#dfbe00a8", foreground: "#ffff" },
            secondary: { DEFAULT: "#540000", foreground: "#ffff" },
            default: { DEFAULT: "#4A4A4A", foreground: "#fff" },
            background: { DEFAULT: "#3B3B3B", foreground: "#fff" },
            foreground: { DEFAULT: "#ffff", foreground: "#000" },
            danger: { DEFAULT: "#e72828", foreground: "#ffff" },
            warning: { DEFAULT: "#e9b435", foreground: "#ffff" },
            success: { DEFAULT: "#1ccc5b", foreground: "#ffff" },
            focus: "#dfbe00a8",
            content1: { DEFAULT: "#3B3B3B", foreground: "#fff" },
            content2: "#4A4A4A",
            content3: "#4A4A4A",
            content4: "#1ccc5b",
            overlay: "#1ccc5b",
            divider: "#5f5f5f",
          },
        },
      },
    }),
  ],
};
export default config;
