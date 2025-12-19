import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        flip: 'flip 3s infinite',
      },
      keyframes: {
        flip: {
          '0%, 100%': { transform: 'rotateY(0)' },
          '50%': { transform: 'rotateY(180deg)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
