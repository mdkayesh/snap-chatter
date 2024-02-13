/** @type {import('tailwindcss').Config} */
export const content = ["./src/**/*.{html,ts}"];
export const theme = {
  extend: {
    colors: {
      "primary-100": "var(--primary-100)",
      "primary-200": "var(--primary-200)",
      "bg-primary-100": "var(--bg-primary-100)",
      "bg-primary-200": "var(--bg-primary-200)",
      "bg-secondary-100": "var(--bg-secondary-100)",
      "bg-secondary-200": "var(--bg-secondary-200)",
      "text-100": "var(--text-100)",
      "text-200": "var(--text-200)",
      "text-300": "var(--text-300)",
      "text-400": "var(--text-400)",
      "text-500": "var(--text-500)",
      "text-600": "var(--text-600)",
    },
  },
};
export const plugins = [];
