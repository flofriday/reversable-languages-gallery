import { StreamLanguage, LanguageSupport } from "@codemirror/language";

/**
 * Tiny stream-parser grammars — just keywords / atoms / comments / strings /
 * numbers, enough to make the custom reversible languages readable.
 * (CodeMirror 6 also supports full Lezer grammars later if we want more.)
 */

interface SimpleSpec {
  name: string;
  keywords: string[];
  atoms?: string[];
  lineComments?: string[];
  blockComments?: [string, string][];
  extraWords?: string[]; // highlighted as definition-ish
}

function simpleLang(spec: SimpleSpec) {
  const keywords = new Set(spec.keywords);
  const atoms = new Set(spec.atoms ?? []);
  const extra = new Set(spec.extraWords ?? []);
  const lineComments = spec.lineComments ?? [];
  const blockComments = spec.blockComments ?? [];
  return StreamLanguage.define({
    name: spec.name,
    startState: () => ({ inBlock: false as false | number }),
    token(stream, state) {
      if (state.inBlock !== false) {
        const end = blockComments[state.inBlock][1];
        if (stream.skipTo(end)) {
          stream.next();
          state.inBlock = false;
        } else {
          stream.skipToEnd();
        }
        return "comment";
      }
      if (stream.eatSpace()) return null;
      for (const lc of lineComments) {
        if (stream.match(lc, true)) {
          stream.skipToEnd();
          return "comment";
        }
      }
      for (const [open, close] of blockComments) {
        if (stream.match(open, true)) {
          if (stream.skipTo(close)) {
            stream.next();
          } else {
            stream.skipToEnd();
            state.inBlock = blockComments.indexOf(blockComments.find(b => b[0] === open)!);
          }
          return "comment";
        }
      }
      if (stream.match(/"([^"\\]|\\.)*"?/)) return "string";
      if (stream.match(/`[^`]*`?/)) return "string";
      if (stream.match(/0x[0-9a-fA-F]+|\d+(\.\d+)?/)) return "number";
      if (stream.match(/[$@]?[A-Za-z_][A-Za-z0-9_'.!?]*/)) {
        const w = stream.current();
        if (keywords.has(w)) return "keyword";
        if (atoms.has(w)) return "atom";
        if (extra.has(w)) return "def";
        return "variableName";
      }
      if (stream.match(/[{}[\]()<>]/)) return "punctuation";
      if (stream.match(/[+\-*/^<>=&|!~:;,.@#%]+/)) return "operator";
      stream.next();
      return null;
    },
    languageData: { commentTokens: { line: lineComments[0] } },
  });
}

const GRAMMARS: Record<string, () => LanguageSupport> = {
  janus: () =>
    new LanguageSupport(
      simpleLang({
        name: "janus",
        keywords: [
          "procedure", "local", "delocal", "if", "then", "else", "fi",
          "from", "do", "loop", "until", "call", "uncall", "push", "pop",
          "skip", "int", "stack",
        ],
        atoms: ["true", "false"],
        lineComments: ["//"],
      })
    ),
  rfun: () =>
    new LanguageSupport(
      simpleLang({
        name: "rfun",
        keywords: ["let", "rlet", "in", "case", "of"],
        atoms: ["Z", "S"],
        lineComments: ["--"],
      })
    ),
  iso: () =>
    new LanguageSupport(
      simpleLang({
        name: "iso",
        keywords: ["iso", "rec", "case", "let", "in", "type", "inv", "fix", "λ", "with"],
        atoms: ["Z", "S", "Nil", "Cons", "Left", "Right", "True", "False"],
        extraWords: ["nat", "Bool", "Int", "List"],
        lineComments: ["--", "//"],
      })
    ),
  asm: () =>
    new LanguageSupport(
      simpleLang({
        name: "pisa-asm",
        keywords: [
          "addi", "add", "neg", "xor", "xori", "andx", "andix", "orx", "orix",
          "bez", "rbez", "bltz", "rbltz", "bra", "rbra", "exch", "rl", "rr",
          "sllx", "srax", "start", "finish", "swapbr", "bgtz", "bne", "sub",
        ],
        atoms: [],
        lineComments: [";", "//"],
      })
    ),
  julia: () =>
    new LanguageSupport(
      simpleLang({
        name: "julia",
        keywords: [
          "function", "end", "for", "while", "if", "else", "elseif", "let",
          "in", "where", "return", "using", "import", "module", "struct",
          "mutable", "const", "local", "global", "begin", "do", "try", "catch",
        ],
        atoms: ["true", "false", "nothing"],
        lineComments: ["#"],
      })
    ),
  haskell: () =>
    new LanguageSupport(
      simpleLang({
        name: "haskell",
        keywords: ["let", "in", "case", "of", "where", "if", "then", "else", "do", "data", "type", "module", "import"],
        lineComments: ["--"],
        blockComments: [["{-", "-}"]],
      })
    ),
  python: () =>
    new LanguageSupport(
      simpleLang({
        name: "python",
        keywords: ["def", "for", "in", "if", "else", "elif", "while", "return", "import", "from", "with", "as", "lambda", "not", "and", "or"],
        atoms: ["True", "False", "None"],
        lineComments: ["#"],
      })
    ),
  fsharp: () =>
    new LanguageSupport(
      simpleLang({
        name: "fsharp",
        keywords: [
          "let", "mutable", "fun", "function", "for", "in", "do", "while",
          "if", "then", "else", "match", "with", "open", "module", "type",
          "rec", "return", "yield", "use", "namespace",
        ],
        atoms: ["true", "false", "null"],
        lineComments: ["//"],
        blockComments: [["(*", "*)"]],
      })
    ),
};

export function getLanguageSupport(lang: string): LanguageSupport | null {
  const make = GRAMMARS[lang];
  return make ? make() : null;
}
