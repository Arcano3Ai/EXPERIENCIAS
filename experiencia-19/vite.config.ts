import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3019,
    host: true, // Permite acceder desde el celular por IP local (ej. 192.168.x.x:3019) para probar el giroscopio físico real
    open: false
  }
});
