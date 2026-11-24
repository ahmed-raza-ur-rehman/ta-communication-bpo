import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: resolve("index.html"),
        about: resolve("about.html"),
        services: resolve("services.html"),
        mva: resolve("mva.html"),
        finalExpense: resolve("final-expense.html"),
        leadGeneration: resolve("lead-generation.html"),
        digitalMarketing: resolve("digital-marketing.html"),
        contact: resolve("contact.html")
      }
    }
  }
});
