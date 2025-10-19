/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    \"./src/**/*.{js,jsx,ts,tsx}\",
    \"./public/index.html\"
  ],
  theme: {
    extend: {
      colors: {
        'indigo': {
          500: '#6366f1',
          600: '#4f46e5'
        },
        'purple': {
          500: '#8b5cf6',
          600: '#7c3aed'
        },
        'cyan': {
          500: '#06b6d4'
        },
        'rose': {
          500: '#f43f5e'
        }
      },
      boxShadow: {
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }
    },
  },
  plugins: [],
}
