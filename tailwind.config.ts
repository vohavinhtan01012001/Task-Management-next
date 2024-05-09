import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        wiggle: {
          'from': { top: '-40%', opacity:"1"},
          'to': { top: '-100%', opacity:"0.8"},
        },
        show: {
          'from': { transform: 'translateX(-5%)', opacity:"1"},
          'to': { transform: 'translateX(0)', opacity:"1"},
        },
        showtask: {
          'from': { transform: 'translateY(-7%)', opacity:"1"},
          'to': { transform: 'translateY(0)', opacity:"1"},
        }
      },
      
      animation: {
        'show-box': 'wiggle 0.4s ease-out',
        'show-section': 'show 0.4s ease',
        'show-add-task': 'showtask 0.4s ease',
      }
      
    },
  },
  plugins: [],
};
export default config;
