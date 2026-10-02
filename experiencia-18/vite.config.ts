import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "framer-motion": path.resolve(__dirname, "./node_modules/framer-motion"),
      "lucide-react": path.resolve(__dirname, "./node_modules/lucide-react"),
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom")
    }
  },
  server: {
    port: 3018,
    host: true,
    open: false
  }
});
