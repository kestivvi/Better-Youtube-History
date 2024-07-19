import { defineConfig } from "vite"
import { crx } from "@crxjs/vite-plugin"
import react from "@vitejs/plugin-react"
import path from "path"

import manifest from "./src/manifest"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    build: {
      emptyOutDir: true,
      outDir: "build",
      rollupOptions: {
        input: {
          home: "home.html",
          redirectPage: "redirectPage.html",
        },
        output: {
          chunkFileNames: "assets/chunk-[hash].js",
        },
      },
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },

    plugins: [
      crx({ manifest }),
      react({
        babel: {
          plugins: [["module:@preact/signals-react-transform"]],
        },
      }),
    ],
  }
})
