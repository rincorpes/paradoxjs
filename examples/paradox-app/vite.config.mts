import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "penrose-paradox": path.resolve(__dirname, "../../src/index.ts"),
    },
  },
  server: {
    host: "localhost",
    port: 3040,
  },
  preview: {
    host: "localhost",
    port: 3040,
  },
});
