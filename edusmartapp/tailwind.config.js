/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      // You can add customizations here, e.g.:
      // colors: { 'brand-primary': '#1da1f2' },
      // spacing: { '128': '32rem' },
    },
  },
  plugins: [
    // Add Tailwind plugins here if needed, e.g. require('@tailwindcss/forms')
  ],
}
