import { defineConfig } from "vite-plus";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  fmt: {
    semi: false,
    sortImports: true,
    sortTailwindcss: { functions: ["cn"] },
    ignorePatterns: [
      "**/components/ui",
      "pnpm-lock.yaml",
    ],
  },
  lint: {
    plugins: ["react", "typescript", "oxc"],
    rules: {
      "react/rules-of-hooks": "error",
      "react/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
        },
      ],
      "vite-plus/prefer-vite-plus-imports": "error",
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
    jsPlugins: [
      {
        name: "vite-plus",
        specifier: "vite-plus/oxlint-plugin",
      },
    ],
  },
  resolve: { tsconfigPaths: true },
  plugins: [react(), cloudflare()],
});
