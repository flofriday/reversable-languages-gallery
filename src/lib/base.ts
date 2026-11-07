// Astro's `base` is "/" locally and "/<repo>/" on GitHub Pages.
export const base: string = import.meta.env.BASE_URL;

/** Prefix an internal path with the configured base. */
export function u(path: string): string {
  const p = path.startsWith("/") ? path.slice(1) : path;
  return base + p;
}
