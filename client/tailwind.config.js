/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        noir: {
          950: '#070a11',
          900: '#0b0f19',
          850: '#111827',
          800: '#1a2234',
          700: '#283548',
          600: '#3d4d65',
        },
        detective: {
          gold: '#eab308',
          amber: '#f59e0b',
          crimson: '#ef4444',
          cyan: '#06b6d4',
          emerald: '#10b981',
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}
