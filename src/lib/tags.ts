/**
 * Pastel style per tag. All class strings are static so Tailwind picks them up.
 * `pill` = active filter pill, `badge` = small badge on cards/detail pages.
 */
export const TAG_STYLE: Record<
  string,
  { pill: string; badge: string; bar: string }
> = {
  imperative: {
    pill: "border-sky-300 bg-sky-100 text-sky-700",
    badge: "bg-sky-100 text-sky-700 border-sky-200",
    bar: "bg-sky-200",
  },
  functional: {
    pill: "border-lav-300 bg-lav-100 text-lav-700",
    badge: "bg-lav-100 text-lav-700 border-lav-200",
    bar: "bg-lav-200",
  },
  "object-oriented": {
    pill: "border-peach-300 bg-peach-100 text-peach-700",
    badge: "bg-peach-100 text-peach-700 border-peach-200",
    bar: "bg-peach-200",
  },
  core: {
    pill: "border-sage-300 bg-sage-100 text-sage-700",
    badge: "bg-sage-100 text-sage-700 border-sage-200",
    bar: "bg-sage-200",
  },
  "low-level": {
    pill: "border-stone-400 bg-stone-200 text-stone-700",
    badge: "bg-stone-200 text-stone-700 border-stone-300",
    bar: "bg-stone-300",
  },
  circuits: {
    pill: "border-rose-300 bg-rose-100 text-rose-700",
    badge: "bg-rose-100 text-rose-700 border-rose-200",
    bar: "bg-rose-200",
  },
  dsl: {
    pill: "border-teal-300 bg-teal-100 text-teal-700",
    badge: "bg-teal-100 text-teal-700 border-teal-200",
    bar: "bg-teal-200",
  },
  retrofitted: {
    pill: "border-amber-300 bg-amber-100 text-amber-700",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    bar: "bg-amber-200",
  },
  quantum: {
    pill: "border-fuchsia-300 bg-fuchsia-100 text-fuchsia-700",
    badge: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200",
    bar: "bg-fuchsia-200",
  },
  library: {
    pill: "border-lime-300 bg-lime-100 text-lime-700",
    badge: "bg-lime-100 text-lime-700 border-lime-200",
    bar: "bg-lime-200",
  },
  concurrent: {
    pill: "border-cyan-300 bg-cyan-100 text-cyan-700",
    badge: "bg-cyan-100 text-cyan-700 border-cyan-200",
    bar: "bg-cyan-200",
  },
  calculus: {
    pill: "border-violet-300 bg-violet-100 text-violet-700",
    badge: "bg-violet-100 text-violet-700 border-violet-200",
    bar: "bg-violet-200",
  },
  crypto: {
    pill: "border-emerald-300 bg-emerald-100 text-emerald-700",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    bar: "bg-emerald-200",
  },
  robotics: {
    pill: "border-orange-300 bg-orange-100 text-orange-700",
    badge: "bg-orange-100 text-orange-700 border-orange-200",
    bar: "bg-orange-200",
  },
  julia: {
    pill: "border-indigo-300 bg-indigo-100 text-indigo-700",
    badge: "bg-indigo-100 text-indigo-700 border-indigo-200",
    bar: "bg-indigo-200",
  },
  python: {
    pill: "border-yellow-300 bg-yellow-100 text-yellow-700",
    badge: "bg-yellow-100 text-yellow-700 border-yellow-200",
    bar: "bg-yellow-200",
  },
  synthesis: {
    pill: "border-rose-300 bg-rose-100 text-rose-700",
    badge: "bg-rose-100 text-rose-700 border-rose-200",
    bar: "bg-rose-200",
  },
  "reverse-debugging": {
    pill: "border-pink-300 bg-pink-100 text-pink-700",
    badge: "bg-pink-100 text-pink-700 border-pink-200",
    bar: "bg-pink-200",
  },
  bidirectional: {
    pill: "border-teal-300 bg-teal-100 text-teal-700",
    badge: "bg-teal-100 text-teal-700 border-teal-200",
    bar: "bg-teal-200",
  },
  example: {
    pill: "border-lav-300 bg-lav-200 text-lav-700 font-medium",
    badge: "bg-lav-200 text-lav-700 border-lav-300",
    bar: "bg-lav-300",
  },
  papers: {
    pill: "border-sage-300 bg-sage-200 text-sage-700 font-medium",
    badge: "bg-sage-200 text-sage-700 border-sage-300",
    bar: "bg-sage-300",
  },
};

const FALLBACK = TAG_STYLE.functional;

export function tagStyle(tag: string) {
  return TAG_STYLE[tag] ?? FALLBACK;
}
