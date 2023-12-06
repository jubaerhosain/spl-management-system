import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@components": path.resolve(new URL("./src/components", import.meta.url).pathname),
      "@utils": path.resolve(new URL("./src/utils", import.meta.url).pathname),
      "@pages": path.resolve(new URL("./src/pages", import.meta.url).pathname),
      "@contexts": path.resolve(new URL("./src/contexts", import.meta.url).pathname),
      "@services": path.resolve(new URL("./src/services", import.meta.url).pathname),
      "@routes": path.resolve(new URL("./src/routes", import.meta.url).pathname),
    },
  },
});
