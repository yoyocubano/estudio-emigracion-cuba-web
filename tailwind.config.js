/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.html"],
  theme: {
    extend: {
      colors: {
        navy: "#0B2A4A", navy2: "#063A5E", gold: "#B08D3C", gold2: "#C9A44C",
        ink: "#1E293B", mut: "#64748B", paper: "#F6F8FA", line: "#E2E8F0"
      },
      fontFamily: { sans: ["'Segoe UI'", "system-ui", "-apple-system", "Arial", "sans-serif"] }
    }
  },
  plugins: []
}
