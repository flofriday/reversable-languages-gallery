import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages serves project pages at https://<user>.github.io/<repo>/.
// In Actions, GITHUB_REPOSITORY is set automatically ("<user>/<repo>");
// locally we fall back to "/".
const ghRepo = process.env.GITHUB_REPOSITORY?.split("/")[1];

export default defineConfig({
  site: ghRepo
    ? `https://${process.env.GITHUB_REPOSITORY.split("/")[0]}.github.io/${ghRepo}/`
    : "https://reversible-language-gallery.example",
  base: ghRepo ? `/${ghRepo}/` : "/",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
