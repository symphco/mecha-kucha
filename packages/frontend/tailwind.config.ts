import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-super': 'linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%)'
      },
      width: {
        128: '32rem',
      },
    },
  },
  plugins: [],
};
export default config;
