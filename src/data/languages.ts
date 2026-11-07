export type Category =
  | "Imperative"
  | "Functional"
  | "Object-oriented"
  | "Core language"
  | "Low-level & ISA"
  | "Circuits"
  | "Domain-specific"
  | "Retrofitted"
  | "Tools"
  | "Quantum"
  | "Library";

export interface Paper {
  title: string;
  authors: string;
  year: string;
  venue?: string;
  url?: string;
}

export interface Implementation {
  name: string;
  kind: string;
  url?: string;
}

export interface Example {
  title: string;
  code: string;
  lang: string;
  source: string;
  note?: string;
}

export interface Language {
  slug: string;
  name: string;
  year: string;
  sortYear: number;
  family: Category;
  paradigm: string;
  reversibility: string;
  summary: string;
  description: string[];
  constructs?: { term: string; detail: string }[];
  examples?: Example[];
  papers: Paper[];
  implementations: Implementation[];
  sourceAvailable: boolean;
  sourceNote?: string;
  links?: { label: string; url: string }[];
  /** Official logo shipped by the project (path in /public/logos). */
  logo?: string;
  /** Compact variant for cards (defaults to logo). */
  logoCard?: string;
  logoCredit?: string;
}

export const languages: Language[] = [
  {
    slug: "janus",
    name: "Janus",
    year: "1982",
    sortYear: 1982,
    family: "Imperative",
    paradigm: "Imperative, procedural",
    reversibility: "Fully reversible (locally invertible)",
    summary:
      "The canonical reversible imperative language. Every statement has a unique inverse; procedures are called forwards with call and backwards with uncall.",
    description: [
      "Janus was designed by Christopher Lutz and Howard Derby at Caltech in 1982; the well-known letter to Rolf Landauer dates from 1986. It was later rediscovered, formalized, and extended by Tetsuo Yokoyama and Robert Glück, who proved it r-Turing complete by writing an invertible self-interpreter in it (PEPM 2007).",
      "Janus operates on a global store of integers and fixed-size arrays (some versions add stacks). Standard assignment is forbidden because it destroys information; instead the language offers reversible updates (x += e, x -= e, x ^= e), swap (x <=> y), and structured reversible control flow. Conditionals carry both an entry test and an exit assertion (if e1 then s1 else s2 fi e2); loops carry an entry assertion and an exit test (from e1 do s1 loop s2 until e2). Local variables are introduced with local … delocal blocks whose final value is recorded in the program text, which is what makes deallocation reversible.",
      "Janus remains the reference point for almost all reversible-language research: compilers exist from Janus to the PISA assembly language and to RSSA, and its syntax is the basis of several circuit compilers.",
    ],
    constructs: [
      { term: "x op= e", detail: "Reversible update with op ∈ {+, −, ^}; x must not occur in e." },
      { term: "x <=> y", detail: "Swap — self-inverse." },
      { term: "if e1 then s1 else s2 fi e2", detail: "Entry test e1, exit assertion e2; roles swap when running backwards." },
      { term: "from e1 do s1 loop s2 until e2", detail: "Reversible loop: entry assertion e1, exit test e2." },
      { term: "local t x = e1 in s delocal t x = e2", detail: "Reversible local variable; the final value is stored in the code." },
      { term: "call p / uncall p", detail: "Run procedure p forwards or backwards." },
      { term: "push(x, s) / pop(x, s)", detail: "Reversible stack operations (x must be 0-cleared appropriately)." },
    ],
    examples: [
      {
        title: "Fibonacci pairs — computed forwards, undone with uncall",
        lang: "janus",
        code: `int n x1 x2

procedure fibpair
    if n=0 then
        x1 += 1
        x2 += 1
    else
        n -= 1
        call fibpair
        x1 += x2
        x1 <=> x2
    fi x1=x2

procedure main_fwd
    n += 4
    call fibpair

procedure main_bwd
    x1 += 5
    x2 += 8
    uncall fibpair`,
        source:
          "Glück & Yokoyama, “Reversible computing from a programming language perspective”, TCS 953 (2023); via Wikipedia “Reversible programming language”.",
        note: "Given n, fibpair sets x1 to F(n) and x2 to F(n+1). main_bwd shows the inverse semantics: uncall runs the procedure backwards.",
      },
      {
        title: "Reversible bubble sort over stacks (init / makeidperm / sort / main)",
        lang: "janus",
        code: `procedure init(int n, stack list)
  local int q=0
  n += 4
  q+=9 push(list,q)
  q+=7 push(list,q)
  q+=1 push(list,q)
  q+=5 push(list,q)
  delocal int q=0

procedure makeidperm(int n, stack perm)
  local int i=0
  local int z=0
  from  i=0
  do    skip
  loop  push(perm,z)
        perm[i] += i
        i += 1
  until i=n
  i -= n
  delocal int z=0
  delocal int i=0

procedure sort(int n, stack list, stack perm)
  local int i=0
  local int j=0
  from  i = 0
  do    skip
  loop  j += n-2
        from  j = n-2
        do    skip
        loop  if   list[j] > list[j+1]
              then list[j] <=> list[j+1]
                   perm[j] <=> perm[j+1]
              else skip
              fi   perm[j] > perm[j+1]
              j -= 1
        until j = i-1
        j -= i-1
        i += 1
  until i = n-1
  i -= n-1
  delocal int j=0
  delocal int i=0

procedure main(int n, stack list, stack perm)
  call init(n,list)
  call makeidperm(n,perm)
  call sort(n,list,perm)`,
        source: "Esolang wiki, “Janus” (CC0), https://esolangs.org/wiki/Janus",
        note: "Sorts a stack of 4 numbers while maintaining a permutation stack; every step is reversible.",
      },
    ],
    papers: [
      {
        title: "Janus: a time-reversible language",
        authors: "C. Lutz (letter to R. Landauer)",
        year: "1986",
        venue: "Letter",
        url: "http://tetsuo.jp/ref/janus.html",
      },
      {
        title: "A reversible programming language and its invertible self-interpreter",
        authors: "T. Yokoyama, R. Glück",
        year: "2007",
        venue: "PEPM 2007",
        url: "https://doi.org/10.1145/1244381.1244404",
      },
      {
        title: "Reversible computation and reversible programming languages",
        authors: "T. Yokoyama",
        year: "2010",
        venue: "ENTCS 253(6)",
        url: "https://doi.org/10.1016/J.ENTCS.2010.02.007",
      },
      {
        title: "Reversible computing from a programming language perspective",
        authors: "R. Glück, T. Yokoyama",
        year: "2023",
        venue: "Theoretical Computer Science 953, 113429",
        url: "https://doi.org/10.1016/j.tcs.2022.06.010",
      },
    ],
    implementations: [
      {
        name: "DIKU PIRC online interpreter",
        kind: "Interpreter (web)",
        url: "https://topps.diku.dk/pirc/?id=janus",
      },
      { name: "Janus → PISA compiler", kind: "Compiler", url: "https://doi.org/10.1007/978-3-540-74510-5_9" },
      { name: "Janus → RSSA compiler", kind: "Compiler", url: "https://reversible-computation-2021.github.io/program" },
      {
        name: "Janus → reversible circuits (rcc/jcc)",
        kind: "Compiler",
        url: "https://github.com/aparent/rcc",
      },
    ],
    sourceAvailable: true,
    sourceNote: "Multiple open interpreters and compilers; see implementations.",
    links: [{ label: "Esolang wiki page", url: "https://esolangs.org/wiki/Janus" }],
  },
  {
    slug: "r-mit",
    name: "R (MIT)",
    year: "1997",
    sortYear: 1997,
    family: "Imperative",
    paradigm: "Imperative, compiled, S-expression syntax",
    reversibility: "Fully reversible (locally invertible)",
    summary:
      "Michael P. Frank's Lisp-flavoured reversible language from the MIT Reversible Computing project, co-designed with the Pendulum/PISA reversible processor.",
    description: [
      "R (not to be confused with the statistical language R) was developed by Michael P. Frank at MIT in the late 1990s as part of the Reversible Computing project. Programs are written as S-expressions but support C-like arrays and pointer arithmetic. The language was designed together with the Pendulum processor and its PISA instruction set, so there is a real compilation chain from R to reversible machine code.",
      "R provides call/rcall for forward and reverse procedure invocation, reversible updates (loc op= e with +=, −=, ^=, plus comparison-updates), swap (loc <-> loc), negation, and let bindings whose variables must be restored to a known state before scope exit. Its if requires the condition to keep the same truth value across the branch, and its for loop requires the iterator to be unchanged after the loop — implicit invariants that make control flow reversible.",
    ],
    constructs: [
      { term: "loc op= e", detail: "Reversible update; also <=<, >=> comparison-updates." },
      { term: "loc <-> loc", detail: "Swap." },
      { term: "(if e then s*)", detail: "e must evaluate the same before and after the branch (invariant)." },
      { term: "(for name = a to b s*)", detail: "Iterator must be restored after the loop." },
      { term: "(let ((name <- e)) s*)", detail: "Local binding; variable must be zero-cleared on exit." },
      { term: "(call sub) / (rcall sub)", detail: "Forward and reverse subroutine calls." },
    ],
    examples: [
      {
        title: "PISA assembly: free-fall simulation with call/uncall (the target of R)",
        lang: "asm",
        code: `Call Fall:
10: ADDI h 1000
11: ADDI tend 5
12: BRA 16        ; call

Uncall Fall:
18: ADDI v 40
19: ADDI t 4
20: ADDI tend 4
21: RBRA 7        ; uncall

Subroutine Fall:
27: BRA 9
28: SWAPBR rtn    ; br <=> rtn
29: NEG rtn       ; rtn = -rtn
30: BGTZ t 5      ; t > 0?
31: ADDI v 10     ; v += 10
32: ADDI h 5      ; h += 5
33: SUB h v       ; h -= v
34: ADDI t 1      ; t += 1
35: BNE t tend -5 ; t != tend?
36: BRA -9`,
        source:
          "Axelsen, Glück & Yokoyama, “Reversible Machine Code and Its Abstract Processor Architecture”, CSR 2007; via Wikipedia “Reversible programming language”.",
        note: "The same program exists as an R source (defsub Fall …) that the R compiler targets to PISA.",
      },
    ],
    papers: [
      {
        title: "Reversibility for Efficient Computing",
        authors: "M. P. Frank",
        year: "1999",
        venue: "PhD thesis, MIT",
        url: "https://hdl.handle.net/1721.1/9464",
      },
      {
        title: "The R programming language and compiler",
        authors: "M. P. Frank",
        year: "1997",
        venue: "MIT Reversible Computing Project Memo",
      },
      {
        title: "Reversible computer engineering and architecture",
        authors: "C. Vieri",
        year: "1999",
        venue: "PhD thesis, MIT",
        url: "https://hdl.handle.net/1721.1/80144",
      },
    ],
    implementations: [
      { name: "R → PISA compiler", kind: "Compiler (historical)" },
    ],
    sourceAvailable: false,
    sourceNote: "The R compiler was never publicly released; the PhD thesis describes it. PISA itself is documented and simulatable.",
    links: [{ label: "Wikipedia overview", url: "https://en.wikipedia.org/wiki/Reversible_programming_language" }],
  },
  {
    slug: "psi-lisp",
    name: "Ψ-Lisp (Psi-Lisp)",
    year: "1992",
    sortYear: 1992,
    family: "Functional",
    paradigm: "Linear Lisp",
    reversibility: "Fully reversible (injective primitives)",
    summary:
      "Henry Baker's reversible variant of Linear Lisp: every cons cell has a single reference and all primitive operations are injective.",
    description: [
      "In his 1992 IWMM paper “NREVERSAL of Fortune — The Thermodynamics of Garbage Collection”, Henry G. Baker proposed an abstract computer model and a language, Ψ-Lisp, whose primitive operations are injective and hence reversible. It builds on Linear Lisp, where every cons cell has a unity reference count, so nothing is ever garbage-collected implicitly.",
      "Ψ-Lisp looks like traditional Lisp, but all programs are reversible. It makes extensive use of swapping operations, which are self-inverse, and requires that all information needed to run a lambda expression backwards is encoded in its returned values.",
      "Ψ-Lisp was a proposal rather than a running system, but it is the historical root of the linear-typed approach that later reversible functional languages (RFun, Theseus, CoreFun, Sparcl) adopted.",
    ],
    papers: [
      {
        title: "NREVERSAL of Fortune — The Thermodynamics of Garbage Collection",
        authors: "H. G. Baker",
        year: "1992",
        venue: "IWMM 1992, LNCS 637",
        url: "https://mirror.smallbone.se/hbaker/ReverseGC.html",
      },
      {
        title: "Lively Linear Lisp — “Look Ma, No Garbage!”",
        authors: "H. G. Baker",
        year: "1992",
        venue: "ACM SIGPLAN Notices 27(8)",
        url: "https://wiki.xxiivv.com/docs/LinearLisp.html",
      },
    ],
    implementations: [],
    sourceAvailable: false,
    sourceNote: "Described in papers only; no public implementation.",
  },
  {
    slug: "inv",
    name: "Inv",
    year: "2004",
    sortYear: 2004,
    family: "Functional",
    paradigm: "Point-free functional",
    reversibility: "Fully reversible",
    summary:
      "Mu, Hu and Takeichi's point-free reversible language, designed to make reversible aspects easy to manage in document construction.",
    description: [
      "Inv is a point-free reversible programming language introduced by Zhenjiang Hu, Masato Takeichi and colleagues (MPC 2004). Like Yarel, it is point-free, which eases the management of reversible aspects; it was introduced with applications to document construction in mind.",
      "It is one of the languages cited as an ancestor of Sparcl, and its compositional operators overlap with Yarel's while differing in the basic combinators.",
    ],
    papers: [
      {
        title: "An injective language for reversible computation",
        authors: "S. Mu, Z. Hu, M. Takeichi",
        year: "2004",
        venue: "MPC 2004",
      },
    ],
    implementations: [],
    sourceAvailable: false,
  },

  {
    slug: "srl",
    name: "SRL",
    year: "2003",
    sortYear: 2003,
    family: "Core language",
    paradigm: "Simple reversible language",
    reversibility: "Total reversible functions",
    summary:
      "Armando Matos' simple reversible language with stacks and arrays; variables range over ℤ so increment/decrement are always mutually inverse.",
    description: [
      "SRL (“a Simple Reversible Language”) was introduced by Armando B. Matos in 2003 (“Linear programs in a simple reversible language”, TCS 290). Programs are total injective functions, and variables range over the integers ℤ rather than ℕ, which guarantees that every increment can be undone by a decrement.",
      "SRL is an instance of total-information-flow reversibilization and is the basis of later core languages such as S-CORE and Yarel (Yarel can represent every SRL program).",
    ],
    papers: [
      {
        title: "Linear programs in a simple reversible language",
        authors: "A. B. Matos",
        year: "2003",
        venue: "Theoretical Computer Science 290(3)",
        url: "https://doi.org/10.1016/S0304-3975(02)00486-3",
      },
      {
        title: "The efficiency of primitive recursive functions: a programmer's view",
        authors: "A. B. Matos",
        year: "2015",
        venue: "Theoretical Computer Science 594",
      },
    ],
    implementations: [],
    sourceAvailable: false,
    sourceNote: "Formal model; no standalone implementation.",
  },
  {
    slug: "r-core",
    name: "R-CORE",
    year: "2015",
    sortYear: 2015,
    family: "Core language",
    paradigm: "Minimal imperative core",
    reversibility: "Fully reversible; r-Turing complete",
    summary:
      "Glück & Yokoyama's minimal r-Turing complete core: reversible assignment, a reversible while loop, and dynamic data structures.",
    description: [
      "R-CORE is the minimalist reversible while language: it consists of just three ingredients — a reversible assignment, a reversible while loop, and dynamic data structures built from a single binary constructor and a single symbol. Despite its minimality it is computationally as powerful as reversible Turing machines.",
      "It is the “assembly language” of reversible imperative semantics: structured reversible flowchart languages and Janus-like languages are all instances of the same computation model, and the Structured Reversible Program Theorem says every unstructured reversible flowchart can be simulated by a structured one with exactly one reversible loop.",
    ],
    papers: [
      {
        title: "Reversible computing from a programming language perspective",
        authors: "R. Glück, T. Yokoyama",
        year: "2023",
        venue: "TCS 953, 113429",
        url: "https://doi.org/10.1016/j.tcs.2022.06.010",
      },
      {
        title: "A minimalist's reversible while language",
        authors: "T. Yokoyama",
        year: "2017",
        venue: "IEICE Trans. Inf. Syst. 100-D",
        url: "https://doi.org/10.1587/transinf.2016EDP7274",
      },
    ],
    implementations: [],
    sourceAvailable: false,
  },
  {
    slug: "r-while",
    name: "R-WHILE",
    year: "2015",
    sortYear: 2015,
    family: "Core language",
    paradigm: "Reversible WHILE with tree-structured data",
    reversibility: "Fully reversible; r-Turing complete",
    summary:
      "A reversible version of Jones' WHILE language with S-expression data, recursive procedures, and a linear-time reversible self-interpreter.",
    description: [
      "R-WHILE is a structured imperative reversible language based on Jones' irreversible WHILE language, with symbolic tree-structured data (S-expressions), pattern matching, recursive procedures, and reversible replacements. Glück and Yokoyama showed it admits a linear-time reversible self-interpreter (JSSST 2016), and later gave it a fully reversible denotational semantics (LMCS 2018).",
      "Its structured control-flow operators — reversible conditional and reversible loop — are the same as those of reversible flowchart languages, making R-WHILE the standard example in the categorical semantics literature.",
    ],
    papers: [
      {
        title: "A linear-time self-interpreter of a reversible imperative language",
        authors: "R. Glück, T. Yokoyama",
        year: "2016",
        venue: "JSSST 33(3)",
      },
      {
        title: "Reversible programs have reversible semantics",
        authors: "R. Glück, T. Yokoyama",
        year: "2018",
        venue: "Logical Methods in Computer Science 14(3:16)",
        url: "https://lmcs.episciences.org/4802",
      },
    ],
    implementations: [
      {
        name: "R-WHILE online interpreter + self-interpreter",
        kind: "Interpreter (web)",
        url: "http://tetsuo.jp/ref/RPLA2019",
      },
    ],
    sourceAvailable: true,
  },
  {
    slug: "rfcl",
    name: "RFCL",
    year: "2015",
    sortYear: 2015,
    family: "Core language",
    paradigm: "Reversible flowchart language",
    reversibility: "Fully reversible; reversibly universal",
    summary:
      "The reversible flowchart language — the diagrammatic common core of structured reversible imperative languages (sequence, selection, loop).",
    description: [
      "RFCL (Reversible Flowchart Language) is the common semantic skeleton of structured reversible imperative languages. Its grammar is just: atomic block, sequence, reversible conditional (if p then B else B fi p), and reversible loop (from p loop B until p).",
      "Janus without recursion, R-WHILE, and R-CORE are all instances of this model. Glück and Kaarsgaard gave the class a categorical foundation in inverse categories with joins (LMCS 2018), proving soundness, adequacy, and full abstraction.",
    ],
    papers: [
      {
        title: "Fundamentals of reversible flowchart languages",
        authors: "T. Yokoyama, H. B. Axelsen, R. Glück",
        year: "2015",
        venue: "Theoretical Computer Science",
        url: "https://doi.org/10.1016/j.tcs.2015.07.046",
      },
      {
        title: "A categorical foundation for structured reversible flowchart languages",
        authors: "R. Glück, R. Kaarsgaard",
        year: "2018",
        venue: "Logical Methods in Computer Science 14(3)",
        url: "https://lmcs.episciences.org/4802",
      },
    ],
    implementations: [],
    sourceAvailable: false,
  },
  {
    slug: "s-core",
    name: "S-CORE",
    year: "2025",
    sortYear: 2025,
    family: "Core language",
    paradigm: "Stack-based reversible core",
    reversibility: "Total reversible functions",
    summary:
      "Palazzo & Roversi's stack-based extension of SRL, adding a notion of reversible management of failures.",
    description: [
      "S-CORE extends SRL with a stack-based core and, notably, a notion of “reversible management of failures”: failures can be handled in a way that remains reversible. It was presented alongside a study of reversible computation with stacks in EPTCS 441 (2026).",
    ],
    papers: [
      {
        title: "Reversible computation with stacks and “reversible management of failures”",
        authors: "M. Palazzo, L. Roversi",
        year: "2026",
        venue: "EPTCS 441, pp. 213–226",
        url: "https://doi.org/10.4204/EPTCS.441.13",
      },
    ],
    implementations: [],
    sourceAvailable: false,
  },
  {
    slug: "rl",
    name: "RL",
    year: "1990s",
    sortYear: 1995,
    family: "Core language",
    paradigm: "Unstructured reversible language",
    reversibility: "Fully reversible",
    summary:
      "An unstructured reversible language with jumps, cited in the flowchart literature as the counterpart to structured reversible flowcharts.",
    description: [
      "RL is the unstructured reversible counterpart of RFCL: reversible assembly-style languages with jumps that must be paired with from-statements identifying their origin, so that control flow joins reversibly. Unstructured reversible flowcharts can always be transformed into structured ones (Structured Reversible Program Theorem).",
    ],
    papers: [
      {
        title: "Fundamentals of reversible flowchart languages",
        authors: "T. Yokoyama, H. B. Axelsen, R. Glück",
        year: "2015",
        venue: "Theoretical Computer Science",
        url: "https://doi.org/10.1016/j.tcs.2015.07.046",
      },
    ],
    implementations: [],
    sourceAvailable: false,
  },
  {
    slug: "rfun",
    name: "RFun",
    year: "2011",
    sortYear: 2011,
    family: "Functional",
    paradigm: "Untyped first-order functional",
    reversibility: "Fully reversible (partial injections)",
    summary:
      "Yokoyama, Axelsen & Glück's untyped first-order reversible functional language with Lisp-style data; closed under program inversion.",
    description: [
      "RFun (“towards a reversible functional language”, RC 2011) is an untyped, first-order language in which arguments are organized in left expressions (patterns) over Lisp-style symbols and constructors. Bound variables must be used linearly, functions are partial injections, and the language is syntactically closed under inverses — a program inverter can produce the inverse of any RFun program.",
      "Its semantics has been modeled in join inverse rig categories (Kaarsgaard & Rennela, MFPS 2021), and a Haskell-like typed redesign was later proposed by Kaarsgaard and Thomsen (“RFun Revisited”, IFL 2015).",
    ],
    constructs: [
      { term: "case / pattern matching", detail: "Symmetric first-match policy; restricted to guarantee backward determinism." },
      { term: "duplication operator", detail: "Controlled duplication/deduplication of first-order values." },
      { term: "program inverter", detail: "For every program p there is a program computing p⁻¹." },
    ],
    papers: [
      {
        title: "Towards a reversible functional language",
        authors: "T. Yokoyama, H. B. Axelsen, R. Glück",
        year: "2012",
        venue: "RC 2011, LNCS 7165",
        url: "https://doi.org/10.1007/978-3-642-29517-1_14",
      },
      {
        title: "Interpretation and programming of the reversible functional language RFUN",
        authors: "M. K. Thomsen, H. B. Axelsen",
        year: "2016",
        venue: "IFL 2015",
      },
      {
        title: "Join inverse rig categories for reversible functional programming, and beyond",
        authors: "R. Kaarsgaard, M. Rennela",
        year: "2021",
        venue: "MFPS 2021, EPTCS 351",
        url: "https://arxiv.org/abs/2105.09929",
      },
    ],
    implementations: [
      {
        name: "DIKU PIRC RFun interpreter",
        kind: "Interpreter (Haskell, web)",
        url: "https://topps.diku.dk/pirc/?id=rfun",
      },
    ],
    sourceAvailable: true,
    examples: [
      {
        title: "plus and fib in RFun (with ⌊·⌋ duplication operator)",
        lang: "rfun",
        code: `plus ⟨x,y⟩ ≜ case y of
  Z    → ⌊⟨x⟩⌋
  S(u) → let ⟨x′,u′⟩ = plus ⟨x,u⟩ in ⟨x′, S(u′)⟩

fib n ≜ case n of
  Z    → ⟨S(Z), S(Z)⟩
  S(m) → let ⟨x,y⟩ = fib m in
         let z = plus ⟨y,x⟩ in z`,
        source:
          "Kaarsgaard & Rennela, “Join Inverse Rig Categories for Reversible Functional Programming”, arXiv:2105.09929 §1.1 (example due to Yokoyama & Glück, PEPM 2007)",
        note: "fib n computes the Fibonacci pair ⟨F(n+1), F(n+2)⟩-style; the paper gives the automatically derived inverses plus⁻¹ and fib⁻¹ next.",
      },
      {
        title: "The derived inverses plus⁻¹ and fib⁻¹ (rlet calls run backwards)",
        lang: "rfun",
        code: `plus⁻¹ z ≜ case z of
  ⌊⟨x⟩⌋       → ⟨x, Z⟩
  ⟨x′, S(u′)⟩ → let ⟨x,u⟩ = plus⁻¹ ⟨x′,u′⟩ in ⟨x, S(u)⟩

fib⁻¹ z ≜ case z of
  ⟨S(Z), S(Z)⟩ → Z
  z′           → let ⟨y,x⟩ = plus⁻¹ z′ in
                 let m = fib⁻¹ ⟨x,y⟩ in S(m)`,
        source:
          "Kaarsgaard & Rennela, arXiv:2105.09929 §1.1 — RFun is syntactically closed under inverses; the program inverter derives these.",
      },
    ],
    links: [{ label: "DIKU PIRC project page", url: "https://topps.diku.dk/pirc/" }],
  },
  {
    slug: "theseus",
    name: "Theseus",
    year: "2012",
    sortYear: 2012,
    family: "Functional",
    paradigm: "Typed functional (type isomorphisms)",
    reversibility: "All functions are partial isomorphisms",
    summary:
      "James & Sabry's typed reversible functional language built on the Π/Π⁰ combinator calculus; every well-typed program is reversible.",
    description: [
      "Theseus (RC 2014) meshes reversible computing with conventional functional programming abstractions. It is built on the Π⁰ reversible combinator calculus: all functions are partial isomorphisms, patterns must be exhaustive and non-overlapping, and the type system distinguishes reversible (↔) from irreversible (→) arrows, discharging the latter at compile time.",
      "Theseus has been the basis of a whole family of later languages — the Chardonnet–Lemonnier–Valiron language adds higher-order functions, inductive types, and general recursion with a full categorical semantics.",
    ],
    papers: [
      {
        title: "Theseus: a high level language for reversible computing",
        authors: "R. P. James, A. Sabry",
        year: "2014",
        venue: "Reversible Computation (RC)",
        url: "https://homes.luddy.indiana.edu/sabry/files/theseus.pdf",
      },
      {
        title: "Information effects",
        authors: "R. P. James, A. Sabry",
        year: "2012",
        venue: "POPL 2012",
        url: "https://doi.org/10.1145/2103656.2103667",
      },
    ],
    implementations: [],
    sourceAvailable: false,
    sourceNote: "Prototype described in papers; no public release.",
    examples: [
      {
        title: "Simple isomorphisms: not",
        lang: "iso",
        code: `not : : Bool ↔ Bool
| True  ↔ False
| False ↔ True`,
        source: "James & Sabry, “Theseus: A High Level Language for Reversible Computing”, RC 2014, §3.1 (theseus.pdf)",
        note: "The two sides of each clause can be swapped to get the inverse — here not is its own inverse.",
      },
      {
        title: "expandNat and its inverse foldNat (Nat ↔ Nat + 1)",
        lang: "iso",
        code: `expandNat : : Nat ↔ Nat + 1          foldNat : : Nat + 1 ↔ Nat
| 0       ↔ Right ( )                  | Right ( ) ↔ 0
| Succ n  ↔ Left n                     | Left n    ↔ Succ n`,
        source: "James & Sabry, theseus.pdf §3.1 — expandNat and foldBool/foldNat shown as inverse pairs",
      },
    ],
  },
  {
    slug: "rcfun",
    name: "RCFUN",
    year: "2014",
    sortYear: 2014,
    family: "Functional",
    paradigm: "Functional with reference counting",
    reversibility: "Fully reversible",
    summary:
      "Mogensen's reversible functional language with reference counting, showing heap memory management can be made reversible.",
    description: [
      "RCFUN is a sketch of a reversible functional language that uses reference counting for memory management. It relies on Axelsen & Glück's reversible heap manager, in which allocation and deallocation are logical inverses of each other — freeing a block is done by running the allocation procedure backwards. A translation of RCFUN to Janus demonstrates the idea.",
    ],
    papers: [
      {
        title: "Reference counting for reversible languages",
        authors: "T. Æ. Mogensen",
        year: "2015",
        venue: "RC 2014, LNCS 8494",
        url: "https://doi.org/10.1007/978-3-319-08494-7_7",
      },
    ],
    implementations: [],
    sourceAvailable: false,
  },
  {
    slug: "eel",
    name: "Eel",
    year: "2016",
    sortYear: 2016,
    family: "Imperative",
    paradigm: "Imperative, partially reversible",
    reversibility: "Partial — irreversible ops allowed at an energy cost",
    summary:
      "The first partially reversible language (Tyagi, Lynch, Demaine): a log stack trades energy for space, with protected/general conditionals and loops.",
    description: [
      "Eel — the Energy-Efficient Language — was the first programming language designed explicitly for partially reversible computation. Programs may mix reversible and irreversible operations; irreversible operations cost energy per bit of information created or destroyed (Landauer's principle).",
      "To reverse irreversible steps, Eel pushes the lost information onto a log stack (log/unroll blocks), explicitly trading energy cost for space. It comes in three language levels (high-level Python-like down to PISA-based low-level), and introduces protected vs. general conditionals and loops — different points on the energy–space trade-off spectrum. An interpreter annotates the energy cost of a run.",
    ],
    constructs: [
      { term: "log … unroll", detail: "Mark a block for reversal; the compiler logs overwritten values onto the log stack." },
      { term: "protected if / general if", detail: "Protected: condition variable untouched by the branch. General: logs the branch decision." },
      { term: "protected for / general for", detail: "Same distinction for loops." },
      { term: "log stack + log pointer", detail: "Stores the bits needed to reverse irreversible operations." },
    ],
    papers: [
      {
        title: "Toward an energy efficient language and compiler for (partially) reversible algorithms",
        authors: "N. Tyagi, J. Lynch, E. D. Demaine",
        year: "2016",
        venue: "RC 2016",
        url: "https://arxiv.org/abs/1605.08475",
      },
      {
        title: "Energy-efficient algorithms",
        authors: "E. D. Demaine, J. Lynch, G. J. Mirano, N. Tyagi",
        year: "2016",
        venue: "ITCS 2016",
        url: "https://arxiv.org/abs/1605.08448",
      },
    ],
    implementations: [
      { name: "Eel compiler + energy-annotating interpreter", kind: "Compiler & interpreter (Java)" },
    ],
    sourceAvailable: false,
    sourceNote: "Java implementation described in the RC 2016 paper; not publicly released.",
    examples: [
      {
        title: "Log / Unroll: an irreversible update made reversible via the log stack (Fig. 1)",
        lang: "python",
        code: `# High level — the Log block is reversed by Unroll:
Log:
    x += 1
Unroll

# compiles to the low level (PISA-based):
#   forward:  LPUSH(x)        ; ADD(x, 1)
#   unroll:   SUB(x, 1)       ; LPOP(x)   // restores and zeroes the log entry`,
        source: "Tyagi, Lynch & Demaine, “Toward an Energy Efficient Language and Compiler for (Partially) Reversible Algorithms”, RC 2016 (arXiv:1605.08475), Fig. 1",
        note: "The overwritten value of x is stored on the log stack (LPUSH) so Unroll can restore it (LPOP).",
      },
    ],
  },
  {
    slug: "roopl",
    name: "ROOPL",
    year: "2017",
    sortYear: 2017,
    family: "Object-oriented",
    paradigm: "Statically typed OO with inheritance & subtype polymorphism",
    reversibility: "Fully reversible (locally invertible)",
    summary:
      "The first reversible object-oriented programming language: user-defined classes, inheritance, encapsulation, and dynamic dispatch — all locally invertible.",
    description: [
      "ROOPL (Haulund's MSc thesis, DIKU 2017; RC 2017 paper) is the first reversible language with built-in object-oriented features: user-defined data types, class inheritance, subtype polymorphism via dynamic dispatch, and encapsulation. Every statement is locally invertible at no extra cost, and each class method has direct access to its inverse via uncall.",
      "The thesis demonstrates computational universality by implementing a reversible Turing machine simulator, and describes a garbage-free translation from ROOPL to the reversible assembly language PISA.",
    ],
    papers: [
      {
        title: "Design and implementation of a reversible object-oriented programming language",
        authors: "T. Haulund",
        year: "2017",
        venue: "MSc thesis, University of Copenhagen",
        url: "https://arxiv.org/abs/1707.07845",
      },
      {
        title: "Implementing reversible object-oriented language features on reversible machines",
        authors: "T. Haulund, T. Æ. Mogensen, R. Glück",
        year: "2017",
        venue: "RC 2017, LNCS 10301",
        url: "https://doi.org/10.1007/978-3-319-59936-6_5",
      },
    ],
    implementations: [
      { name: "ROOPL → PISA compiler", kind: "Compiler" },
    ],
    sourceAvailable: false,
    sourceNote: "Compiler implemented as part of the thesis; not publicly released.",
  },
  {
    slug: "corefun",
    name: "CoreFun",
    year: "2018",
    sortYear: 2018,
    family: "Functional",
    paradigm: "Typed functional core language",
    reversibility: "Statically guaranteed by the type system",
    summary:
      "A small typed reversible functional core whose combined unrestricted/linear type system guarantees reversibility; r-Turing complete.",
    description: [
      "CoreFun (Jacobsen, Kaarsgaard & Thomsen, RC 2018) reduces typed reversible functional programming to its essentials. Its type system combines unrestricted and linear reasoning — including reversible duplication and deduplication of first-order data — so that well-typed programs are automatically reversible.",
      "It has a complete formal semantics and type system and is intended as a core language into which higher-level features (variants, type classes) can be desugared.",
    ],
    papers: [
      {
        title: "CoreFun: a typed functional reversible core language",
        authors: "P. A. H. Jacobsen, R. Kaarsgaard, M. K. Thomsen",
        year: "2018",
        venue: "RC 2018, LNCS 11106",
        url: "https://doi.org/10.1007/978-3-319-99498-7_21",
      },
    ],
    implementations: [
      {
        name: "CoreFun implementation",
        kind: "Prototype",
        url: "https://github.com/diku-dk/coreFun",
      },
    ],
    sourceAvailable: true,
  },
  {
    slug: "rooppp",
    name: "ROOPL++",
    year: "2018",
    sortYear: 2018,
    family: "Object-oriented",
    paradigm: "OO with dynamic memory & fixed-size arrays",
    reversibility: "Fully reversible (locally invertible)",
    summary:
      "Cservenka's extension of ROOPL with dynamic memory management (buddy allocator) and fixed-size arrays — binary trees and linked lists become feasible.",
    description: [
      "ROOPL++ extends ROOPL with dynamic memory management and fixed-size arrays. Reversible memory-manager layouts were compared and the Buddy Memory layout selected; translations of the extensions to PISA (and later to HSSA) provide garbage-free computation.",
      "The extension makes non-trivial reversible data structures — binary trees, doubly linked lists — feasible without contradicting the reversible paradigm.",
    ],
    papers: [
      {
        title: "Design and implementation of dynamic memory management in a reversible object-oriented programming language",
        authors: "M. H. Cservenka",
        year: "2018",
        venue: "MSc thesis, University of Copenhagen",
        url: "https://arxiv.org/abs/1804.05097",
      },
      {
        title: "Compiling Roopl++ to HSSA",
        authors: "L. Gail, U. Meyer, T. Schönhals",
        year: "2026",
        venue: "RC 2026, LNCS",
      },
    ],
    implementations: [
      { name: "ROOPL++ → PISA / HSSA compilers", kind: "Compiler" },
    ],
    sourceAvailable: false,
  },
  {
    slug: "yarel",
    name: "Yarel",
    year: "2019",
    sortYear: 2019,
    family: "Functional",
    paradigm: "Point-free core functional",
    reversibility: "Fully reversible; primitive-recursive complete",
    summary:
      "Grandi, Moshiri & Roversi's point-free core language implementing a primitive-recursive-complete class of permutations, compiled to Java.",
    description: [
      "Yarel (“Yet Another REversible Language”) is a core reversible language whose functions are permutations defined recursively; the class is primitive recursive complete. Arguments are managed linearly by construction, building on the monoidal structure of the algebraic theory for Boolean circuits.",
      "Yarel can represent every SRL program and comes with an Eclipse-based IDE (Yarel-IDE) and a compiler to Java.",
    ],
    papers: [
      {
        title: "Introducing yet another REversible language",
        authors: "C. Grandi, D. Moshiri, L. Roversi",
        year: "2019",
        venue: "arXiv:1902.05369",
        url: "https://arxiv.org/abs/1902.05369",
      },
    ],
    implementations: [
      { name: "Yarel compiler to Java + Yarel-IDE (Eclipse plugin)", kind: "Compiler & IDE" },
    ],
    sourceAvailable: false,
  },
  {
    slug: "sparcl",
    name: "Sparcl",
    year: "2020",
    sortYear: 2020,
    family: "Functional",
    paradigm: "Partially invertible, linear-typed functional",
    reversibility: "Partial invertibility, statically guaranteed",
    summary:
      "Matsuda & Wang's language for partially invertible computation: invertible parts are statically guaranteed bijective, ordinary code can coexist.",
    description: [
      "Sparcl — “a system for partially reversible computation with linear types” (ICFP 2020; JFP 2024) — is the first invertible language that addresses practical partially invertible programs. Its linear type system (based on λq→) statically determines which parts of a program are reversible; constructs unlift (with ▷, ◁) and pin mediate between the invertible world and ordinary unidirectional code.",
      "Derived bijections are total with respect to the actual domains and ranges: if fwd e v = u then bwd e u = v and vice versa. Sparcl is reversible-Turing complete, comes with an interpreter and an Agda formalization with a machine-checked proof.",
    ],
    papers: [
      {
        title: "Sparcl: a language for partially invertible computation",
        authors: "K. Matsuda, M. Wang",
        year: "2020",
        venue: "ICFP 2020, Proc. ACM Program. Lang. 4",
        url: "https://mengwangoxf.github.io/Papers/ICFP20.pdf",
      },
      {
        title: "Sparcl: a language for partially invertible computation",
        authors: "K. Matsuda, M. Wang",
        year: "2024",
        venue: "Journal of Functional Programming 34, e2",
        url: "https://doi.org/10.1017/S0956796823000126",
      },
    ],
    implementations: [
      {
        name: "Sparcl interpreter",
        kind: "Interpreter",
        url: "https://github.com/kztk-m/sparcl",
      },
      {
        name: "Sparcl in Agda (formalized, with proofs)",
        kind: "Formalization",
        url: "https://github.com/kztk-m/sparcl-agda",
      },
    ],
    sourceAvailable: true,
    examples: [
      {
        title: "subs: partially invertible list transform in Sparcl (the paper's teaser example)",
        lang: "haskell",
        code: `subs : (List Int)• ⊸ (List Int)•
subs xs = goSubs 0 xs

goSubs : Int → (List Int)• ⊸ (List Int)•
goSubs Nil•         = Nil• with null
goSubs n (Cons x xs) =
  let (x, r)• = pin x (λx′. goSubs x′ xs) in   -- x′ : Int is a static version of x : Int•
  Cons• (sub n x) r with not ◦ null

sub : Int → Int• ⊸ Int•
sub n = lift (λx. x − n) (λx. x + n)`,
        source: "Matsuda & Wang, “Sparcl: A Language for Partially-Invertible Computation”, ICFP 2020 (Proc. ACM 4, art. 118), §1 teaser",
        note: "subs [1,2,5,2,3] = [1,1,3,−3,1]; pin snapshots the invertible head so the recursive call can use it as a static value.",
      },
    ],
  },
  {
    slug: "nilang",
    name: "NiLang",
    year: "2020",
    sortYear: 2020,
    family: "Domain-specific",
    paradigm: "Reversible eDSL embedded in Julia",
    reversibility: "Fully reversible; every program is differentiable",
    summary:
      "Liu & Zhao's reversible Julia eDSL: reverse-mode automatic differentiation by running programs backwards — no tape needed.",
    description: [
      "NiLang (逆lang) is a reversible embedded domain-specific language in Julia. Any program written in NiLang is differentiable: reverse-mode AD is obtained by executing the inverse program, so no tape of intermediate values is stored. Benchmarks show it outperforming conventional AD frameworks in speed and memory.",
      "Unlike the research languages, NiLang supports floating-point, complex, fixed-point, and logarithmic numbers, arrays, and in-place array updates, and it implements the compute–copy–uncompute (Bennett) macro. It has been used for sparse matrices, normalizing flows, and physics simulations (billiard-ball cellular automata, QR decomposition).",
    ],
    constructs: [
      { term: "@i function … end", detail: "Marks a function as reversible; the inverse (~f) is generated automatically." },
      { term: "x += e / x -= e / x ⊻= e", detail: "Reversible updates; @code_reverse derives the inverse syntax." },
      { term: "a ← b / a → b", detail: "Copy and its inverse (move)." },
      { term: "a ↔ b", detail: "Swap — self-reversible." },
      { term: "NiLang.AD.gradient", detail: "Reverse-mode AD via the automatically generated inverse." },
    ],
    examples: [
      {
        title: "Computing the norm of a vector — and its automatically generated inverse",
        lang: "julia",
        code: `using NiLang

@i function f(res, y, x)
    for i = 1:length(x)
        y += x[i] ^ 2
    end
    res += sqrt(y)
end

res_out, y_out, x_out = f(0.0, 0.0, [1, 2, 3.0])
# => (3.7416573897739413, 14.0, [1.0, 2.0, 3.0])

(~f)(res_out, y_out, x_out)   # automatically generated inverse program
# => (0.0, 0.0, [1.0, 2.0, 3.0])`,
        source: "NiLang.jl README, https://github.com/GiggleLiu/NiLang.jl",
        note: "~f is the inverse of f, generated automatically; running it restores the initial state exactly.",
      },
      {
        title: "Reversible axpy + loss (from the NiLang tutorial)",
        lang: "julia",
        code: `@i function r_axpy!(a::T, x::AbstractVector{T}, y!::AbstractVector{T}) where T
    @safe @assert length(x) == length(y!)
    for i=1:length(x)
        y![i] += a * x[i]
    end
end

@i function r_loss(out!, a, x, y!, z)
    r_axpy!(a, x, y!)
    for i=1:length(z)
        out! += z[i] * y![i]
    end
end`,
        source: "NiLang.jl documentation, docs/src/tutorial.md (github.com/GiggleLiu/NiLang.jl)",
        note: "In-place vector update (axpy) composed into a loss function; both are @i-invertible.",
      },
    ],
    papers: [
      {
        title: "Differentiate everything with a reversible programming language",
        authors: "J.-G. Liu, T. Zhao",
        year: "2020",
        venue: "arXiv:2003.04617 (ICLR 2021)",
        url: "https://arxiv.org/abs/2003.04617",
      },
    ],
    implementations: [
      {
        name: "NiLang.jl",
        kind: "Julia package",
        url: "https://github.com/GiggleLiu/NiLang.jl",
      },
      {
        name: "NiLangCore.jl",
        kind: "Julia package (core)",
        url: "https://www.juliapackages.com/p/nilangcore",
      },
    ],
    sourceAvailable: true,
    links: [
      { label: "Documentation & notebooks", url: "https://giggleliu.github.io/NiLang.jl/dev" },
    ],
    logo: "/logos/nilang3.png",
    logoCard: "/logos/nilang.jpg",
    logoCredit: "NiLang project docs (Apache-2.0), github.com/GiggleLiu/NiLang.jl",
  },
  {
    slug: "hermes",
    name: "Hermes",
    year: "2020",
    sortYear: 2020,
    family: "Domain-specific",
    paradigm: "Reversible DSL for lightweight encryption",
    reversibility: "Fully reversible; side-channel resistant",
    summary:
      "Mogensen's reversible encryption language: write the cipher once and get decryption free by running it backwards; types separate secret from public data.",
    description: [
      "Hermes is a domain-specific reversible language for lightweight encryption (RC 2020; Science of Computer Programming 215, 2022). Because every Hermes program is reversible, decryption is just encryption run backwards — no separate decryption procedure is written.",
      "Hermes additionally guards against side-channel attacks: a type system separates secret and public values, secret variables are cleared after use (no state leakage), and operations on secret data take time independent of the data (no timing leaks). Well-known lightweight ciphers (e.g. RC5 rounds) have been implemented in Hermes and compared with C.",
    ],
    papers: [
      {
        title: "Hermes: a language for light-weight encryption",
        authors: "T. Æ. Mogensen",
        year: "2020",
        venue: "RC 2020, LNCS 12227",
      },
      {
        title: "Hermes: a reversible language for lightweight encryption",
        authors: "T. Æ. Mogensen",
        year: "2022",
        venue: "Science of Computer Programming 215, 102746",
        url: "https://doi.org/10.1016/j.scico.2021.102746",
      },
      {
        title: "Hermes: implementing cryptography without side-channels",
        authors: "K. F. Larsen, T. Æ. Mogensen, M. K. Thomsen",
        year: "2020",
        venue: "PriSC 2020 (POPL)",
        url: "https://popl20.sigplan.org/details/prisc-2020-papers/11/",
      },
    ],
    implementations: [
      {
        name: "Hermes prototype",
        kind: "Compiler / interpreter",
        url: "https://github.com/maltevelin/Hermes",
      },
    ],
    sourceAvailable: true,
  },
  {
    slug: "agni",
    name: "Agni",
    year: "2021",
    sortYear: 2021,
    family: "Functional",
    paradigm: "Reversible functional array programming",
    reversibility: "Fully reversible",
    summary:
      "Mogensen's reversible functional array language; its type notation recording consumed/produced values was later reused in the L4 intermediate language.",
    description: [
      "Agni (RC 2021) is a functional language for reversible array programming. Arrays are first-class reversible data, and its function types s → t ⊸ u record which values are read-only, which are consumed, and which are produced — a notation later reused by the L4 intermediate language.",
    ],
    papers: [
      {
        title: "Reversible functional array programming",
        authors: "T. Æ. Mogensen",
        year: "2021",
        venue: "RC 2021, LNCS 12805, pp. 45–63",
        url: "https://researchprofiles.ku.dk/en/publications/reversible-functional-array-programming/",
      },
    ],
    implementations: [],
    sourceAvailable: false,
  },
  {
    slug: "jeopardy",
    name: "Jeopardy",
    year: "2022",
    sortYear: 2022,
    family: "Functional",
    paradigm: "First-order functional, globally invertible",
    reversibility: "Global invertibility without local invertibility",
    summary:
      "Kristensen, Kaarsgaard & Thomsen's functional language that permits locally irreversible (even nondeterministic) operations if the whole program is statically invertible.",
    description: [
      "Jeopardy guarantees program invertibility without imposing local reversibility. It looks like an ordinary first-order functional language with algebraic data types and an invert keyword, but allows limited use of uninvertible — even nondeterministic — operations, provided an analysis (available implicit arguments analysis) can statically determine that the whole program is globally invertible.",
      "This makes reversible programs look much more like conventional functional programs than in Janus-style languages.",
    ],
    papers: [
      {
        title: "Jeopardy: an invertible functional programming language",
        authors: "J. T. Kristensen, R. Kaarsgaard, M. K. Thomsen",
        year: "2022",
        venue: "arXiv:2209.02422; RC 2024, LNCS 14680",
        url: "https://arxiv.org/abs/2209.02422",
      },
      {
        title: "Branching execution symmetry in Jeopardy by available implicit arguments analysis",
        authors: "J. T. Kristensen, R. Kaarsgaard, M. K. Thomsen",
        year: "2022",
        venue: "NIK 2022",
        url: "https://arxiv.org/abs/2212.03161",
      },
    ],
    implementations: [
      {
        name: "Jeopardy prototype",
        kind: "Interpreter",
        url: "https://github.com/jtkristensen/Jeopardy",
      },
    ],
    sourceAvailable: true,
  },
  {
    slug: "clv-language",
    name: "CLV language",
    year: "2024",
    sortYear: 2024,
    family: "Functional",
    paradigm: "Higher-order functional with inductive types",
    reversibility: "Partial isomorphisms; Turing-complete",
    summary:
      "Chardonnet, Lemonnier & Valiron's Theseus-based higher-order reversible language with inductive types and general recursion — proved to encode any reversible Turing machine.",
    description: [
      "The language of Chardonnet, Lemonnier & Valiron (FSCD 2024) extends the Theseus family with higher-order functions, pairing and injection, inductive types (µX.A), and general recursion. Pattern clauses must be exhaustive and non-overlapping, which is enough to guarantee reversibility.",
      "The authors encode any reversible Turing machine in it and give a sound and adequate categorical semantics in join inverse categories, with full completeness: every computable partial injective function is the image of a term. A companion line of work gives a Curry–Howard correspondence with μMALL (linear logic with least fixed points).",
    ],
    papers: [
      {
        title: "Semantics for a Turing-complete reversible programming language with inductive types",
        authors: "K. Chardonnet, L. Lemonnier, B. Valiron",
        year: "2024",
        venue: "FSCD 2024, LIPIcs 299",
        url: "https://arxiv.org/abs/2309.12151",
      },
      {
        title: "A Curry–Howard correspondence for linear, reversible computation",
        authors: "K. Chardonnet, A. Saurin, B. Valiron",
        year: "2025",
        venue: "Logical Methods in Computer Science 21(3)",
        url: "https://arxiv.org/abs/2302.11887",
      },
    ],
    implementations: [],
    sourceAvailable: false,
    examples: [
      {
        title: "Example 7: map on lists (recursive iso over [A] ↔ [B])",
        lang: "iso",
        code: `map : (A ↔ B) → [A] ↔ [B]
map = λψ. fix φ. {
  []     ↔ []
  h :: t ↔ let h′ = ψ h in
           let t′ = φ t in
           h′ :: t′
}

-- its inverse map⁻¹ is derived by swapping clause sides:
map⁻¹ = λψ. fix φ. {
  []       ↔ []
  h′ :: t′ ↔ let t = φ t′ in
             let h = ψ h′ in
             h :: t
}`,
        source: "Chardonnet, Lemonnier & Valiron, FSCD 2024 (arXiv:2309.12151), Example 7",
        note: "[] = fold(injl ()) and h :: t = fold(injr ⟨h, t⟩); the inverse swaps LHS/RHS of every clause.",
      },
      {
        title: "Example 8: Cantor pairing nat ⊗ nat ↔ nat",
        lang: "iso",
        code: `ω1 : nat ⊗ nat ↔ (nat ⊗ nat) ⊕ 1 =
  { ⟨S(i), j⟩     ↔ injl (⟨i, S(j)⟩)
  | ⟨0, S(S(j))⟩ ↔ injl (⟨S(j), 0⟩)
  | ⟨0, S(0)⟩    ↔ injl (⟨0, 0⟩)
  | ⟨0, 0⟩       ↔ injr () }

ω2 : (nat ⊗ nat) ⊕ 1 ↔ nat =
  { injl (x) ↔ let y = φ x in S(y)
  | injr ()  ↔ 0 }

CantorPairing : nat ⊗ nat ↔ nat =
  fix φ. { x ↔ let y = ω1 x in
              let z = ω2 y in z }`,
        source: "Chardonnet, Lemonnier & Valiron, FSCD 2024 (arXiv:2309.12151), Example 8",
        note: "ω1 performs one Cantor-pairing step; ω2 recurses via the fix-bound φ until the base case.",
      },
    ],
  },
  {
    slug: "pisolang",
    name: "PisoLang",
    year: "2026",
    sortYear: 2026,
    family: "Functional",
    paradigm: "User-friendly typed functional with inductive types",
    reversibility: "Fully reversible",
    summary:
      "Onodera et al.'s user-oriented reversible functional language (RC 2026): the CLV calculus plus polymorphism, type inference, and inductive types.",
    description: [
      "PisoLang is built on the Chardonnet et al. calculus and adds features aimed at practical programming: more conventional syntax, polymorphism, type inference, and inductive types. It shows that injective functions can be expressed conveniently while remaining fully reversible.",
      "It is one of the most recent signs that reversible functional languages are moving from core calculi toward usable languages.",
    ],
    papers: [
      {
        title: "PisoLang: a user-friendly reversible programming language with inductive types",
        authors: "K. Onodera, K. Nakano, K. Asada, K. Kikuchi",
        year: "2026",
        venue: "RC 2026",
        url: "https://www.riec.tohoku.ac.jp/~ksk/pub/Onodera26rc-full.pdf",
      },
    ],
    implementations: [],
    sourceAvailable: false,
    examples: [
      {
        title: "Fibonacci pairs in PisoLang (add is made injective by returning (m+n, n))",
        lang: "iso",
        code: `type nat = Z | S of nat

iso rec add = case
| (m, 0)    <-> (m, 0)
| (m, S n)  <-> let (m', n') = add (S m, n) in
                 (m', S n')
in

iso rec fib = case
| 0    <-> (S 0, S 0)
| S n  <-> let (S (S m), n) = add (fib n) in
           (n, S (S m))
in
(fib 9, inv fib (8, 13))`,
        source: "Onodera, Nakano, Asada & Kikuchi, “PisoLang”, RC 2026 — §2 example program",
        note: "fib 9 returns (55, 89); inv fib runs the same iso backwards, yielding 5 from (8, 13).",
      },
    ],
  },
  {
    slug: "pisa",
    name: "PISA / Pendulum",
    year: "1999",
    sortYear: 1999,
    family: "Low-level & ISA",
    paradigm: "Reversible RISC instruction set",
    reversibility: "Fully reversible ISA",
    summary:
      "The Pendulum processor's 12-bit reversible RISC instruction set: a direction bit, branch bit, reversible branches, and EXCH memory access.",
    description: [
      "Pendulum was a 12-bit, RISC-inspired, fully reversible microprocessor implemented in 0.5 µm CMOS at MIT (Vieri's PhD thesis, 1999). Its instruction set PISA includes a direction register (DIR) tracking forward/backward mode, a branch register (BR) for reversible control flow, paired conditional branches (BEZ/RBEZ, BLTZ/RBLTZ) that toggle DIR, a reversible EXCH (exchange) memory instruction, and arithmetic/logic ops whose behaviour depends on the direction bit.",
      "PISA is the compilation target of Frank's R language and of several Janus compilers, and the low-level anchor of Eel's three-level design.",
    ],
    papers: [
      {
        title: "Reversible computer engineering and architecture",
        authors: "C. Vieri",
        year: "1999",
        venue: "PhD thesis, MIT",
        url: "https://hdl.handle.net/1721.1/80144",
      },
      {
        title: "Reversible machine code and its abstract processor architecture",
        authors: "H. B. Axelsen, R. Glück, T. Yokoyama",
        year: "2007",
        venue: "CSR 2007, LNCS 4649",
        url: "https://doi.org/10.1007/978-3-540-74510-5_9",
      },
    ],
    implementations: [
      {
        name: "PISA simulators / documentation",
        kind: "Simulator & docs",
        url: "https://esolangs.org/wiki/Pendulum_Instruction_Set_Architecture",
      },
    ],
    sourceAvailable: true,
    examples: [
      {
        title: "Fibonacci in PISA assembly — computed forward, then run backwards to reclaim space",
        lang: "asm",
        code: `main:  start                    ; Compute Nth Fibonacci number

       addi $1 1                 ; $0=0, $1=1, base case
       addi $2 18                ; hold N, loop counter
       neg $2                    ; shorthand for (xori $2 0x1ff) + 1
       addi $2 1                 ; setup $2 for loop count
       addi $3 bottom            ; loop target is top; swapped with bottom
       addi $4 t1                ; entry point
       addi $5 exit              ; exit address
call:  bez $4 $7                 ; call fib routine

       rbez $5 $7                ; return from rcall
       addi $5 -1
rexit: bez $4 $7

top:   bltz $3 $2                ; paired loop branch, could be J
t1:    bez $4 $7
       addi $7 1
       add $0 $1
       xor $0 $1                 ; swap $0, $1
       xor $1 $0
       xor $0 $1
       addi $2 1                 ; increment counter
       addi $3 -10               ; correct for exchange
b1:    bez $5 $2                 ; exit condition
bottom: bltz $3 $2               ; loop until done

exit:  bez $5 $2                 ; exit point. top and bottom could
                               ; have an unconditional jump
;;; Copy output and call the fib generator in reverse
       add $6 $1                 ; Result to $6
       addi $4 3                 ; $4 points to call, adjust to rexit
rcall: rbez $5 $2                ; call backwards; goto b1
       bez $5 $7                 ; return from rcall
;; reclaim other space
;; we know $0=0, $1=1, $2=-17, $3=bottom,
;;         $4=t1, $5=call+1, $6=fib(18), $7=0
;;     clear out those values
       addi $1 -1
       addi $2 17
       addi $3 -22
       addi $4 -13
       addi $5 -9

end: finish`,
        source:
          "Esolang wiki, “Pendulum Instruction Set Architecture” (CC0), example copied from Vieri 1995 (Pendulum thesis)",
        note: "The rcall/rbez instructions run the fib routine backwards to free the registers it used.",
      },
    ],
    links: [{ label: "Esolang wiki", url: "https://esolangs.org/wiki/Pendulum_Instruction_Set_Architecture" }],
  },
  {
    slug: "bobisa",
    name: "BobISA",
    year: "2012",
    sortYear: 2012,
    family: "Low-level & ISA",
    paradigm: "Small reversible processor ISA",
    reversibility: "Fully reversible ISA",
    summary:
      "A small reversible processor ISA (the “Bob” processor needs only 473 reversible gates / 6328 transistors); compilation target for RFun.",
    description: [
      "BobISA is the instruction set of a minimal reversible processor design; the whole Bob processor is built from only 473 reversible gates (about 6328 transistors). A translation from the reversible functional language RFun to BobISA has been presented.",
    ],
    papers: [
      {
        title: "A reversible processor architecture and its reversible logic design",
        authors: "M. K. Thomsen, H. B. Axelsen, R. Glück",
        year: "2011",
        venue: "RC 2011, LNCS 7165",
        url: "https://doi.org/10.1007/978-3-642-29517-1_3",
      },
    ],
    implementations: [],
    sourceAvailable: false,
  },
  {
    slug: "ril",
    name: "RIL",
    year: "2015",
    sortYear: 2015,
    family: "Low-level & ISA",
    paradigm: "Reversible intermediate language",
    reversibility: "Fully reversible IR",
    summary:
      "Mogensen's reversible intermediate language, used for memory-usage analysis of reversible functional programs; the base of RSSA and CRIL.",
    description: [
      "RIL (Reversible Intermediate Language) is an IR for reversible programming languages used by Mogensen in memory-usage analysis of a reversible functional language. Programs in RIL translate into RSSA, and CRIL extends RIL with concurrency.",
    ],
    papers: [
      {
        title: "Garbage collection for reversible functional languages",
        authors: "T. Æ. Mogensen",
        year: "2015",
        venue: "RC 2015, LNCS 9138",
      },
    ],
    implementations: [],
    sourceAvailable: false,
  },
  {
    slug: "rssa",
    name: "RSSA",
    year: "2016",
    sortYear: 2016,
    family: "Low-level & ISA",
    paradigm: "Reversible SSA form",
    reversibility: "Fully reversible IR",
    summary:
      "A reversible variant of SSA: selected uses destroy variables and labels carry parameters, so φ-nodes work at joins and splits.",
    description: [
      "RSSA (Mogensen, PSI 2015) makes Static Single Assignment reversible — non-trivial because SSA's single-assignment discipline conflicts with the reversible updates and exchanges of Janus-like languages. Selected uses of a variable may destroy it, and labels take parameters so φ-nodes exist on both joins and splits. Copy/constant propagation and register allocation work in this setting.",
      "Janus compiles to RSSA (Kutrib, Meyer et al., RC 2021), which is then lowered further.",
    ],
    papers: [
      {
        title: "RSSA: a reversible SSA form",
        authors: "T. Æ. Mogensen",
        year: "2016",
        venue: "PSI 2015, LNCS 9609",
        url: "https://doi.org/10.1007/978-3-319-41579-6_16",
      },
      {
        title: "Compiling Janus to RSSA",
        authors: "M. Kutrib, U. Meyer, N. Deworetzki, M. Schuster",
        year: "2021",
        venue: "RC 2021",
        url: "https://reversible-computation-2021.github.io/program",
      },
    ],
    implementations: [],
    sourceAvailable: false,
  },
  {
    slug: "cril",
    name: "CRIL",
    year: "2023",
    sortYear: 2023,
    family: "Low-level & ISA",
    paradigm: "Concurrent reversible intermediate language",
    reversibility: "Fully reversible, causally consistent concurrency",
    summary:
      "Oguchi & Yuen's concurrent extension of RIL: multi-threaded blocks with P/V synchronization; reversibility via an annotation DAG preserving causal safety and liveness.",
    description: [
      "CRIL (Concurrent Reversible Intermediate Language, EXPRESS/SOS 2023) extends RIL with multiple concurrent blocks and P/V-style synchronization primitives. Concurrent blocks interact through shared variables, and reversibility is established by composing bidirectional control flow with an annotation DAG that records read/write dependencies — guaranteeing causal safety and causal liveness when running backwards.",
    ],
    papers: [
      {
        title: "CRIL: a concurrent reversible intermediate language",
        authors: "S. Oguchi, S. Yuen",
        year: "2023",
        venue: "EXPRESS/SOS 2023, EPTCS 387",
        url: "https://arxiv.org/abs/2309.07310",
      },
    ],
    implementations: [],
    sourceAvailable: false,
  },
  {
    slug: "hssa",
    name: "HSSA",
    year: "2024",
    sortYear: 2024,
    family: "Low-level & ISA",
    paradigm: "Hybrid SSA intermediate language",
    reversibility: "Partially reversible IR",
    summary:
      "Gail & Meyer's hybrid SSA: a partially reversible intermediate language mixing reversible and classical code; compilation target of ROOPL++.",
    description: [
      "HSSA (Hybrid SSA) connects reversible and classical computing: it is a partially reversible SSA-like intermediate language into which both reversible languages (ROOPL++) and classical code can be compiled, enabling optimizations across the boundary.",
    ],
    papers: [
      {
        title: "Connecting reversible and classical computing through hybrid SSA",
        authors: "L. Gail, U. Meyer",
        year: "2024",
        venue: "RC 2024, LNCS 14680",
        url: "https://rc2024.mat.umk.pl/accepted.php",
      },
      {
        title: "Compiling Roopl++ to HSSA",
        authors: "L. Gail, U. Meyer, T. Schönhals",
        year: "2026",
        venue: "RC 2026 (MSc thesis, THM)",
        url: "https://publikationsserver.thm.de/xmlui/handle/123456789/479",
      },
    ],
    implementations: [],
    sourceAvailable: false,
  },
  {
    slug: "l4",
    name: "L4",
    year: "2026",
    sortYear: 2026,
    family: "Low-level & ISA",
    paradigm: "Generic linearly typed low-level reversible language",
    reversibility: "Fully reversible IR",
    summary:
      "Mogensen's 2026 successor to RSSA: a generic, linearly typed, low-level reversible language with a bidirectional small-step semantics.",
    description: [
      "L4 is a generic reversible, linearly typed, low-level language intended as an intermediate language for compiling reversible languages to reversible machines, replacing and generalizing RSSA (inspiration drawn from HSSA). Function types s → t ⊸ u record read-only, consumed, and produced values (notation from Agni). It has a formal type system and a bidirectional small-step semantics in which the direction of execution can change mid-run.",
    ],
    papers: [
      {
        title: "The reversible intermediate language L4, its type system, and its bidirectional small-step semantics",
        authors: "T. Æ. Mogensen",
        year: "2026",
        venue: "arXiv:2610.31201",
        url: "https://arxiv.org/abs/2610.31201",
      },
    ],
    implementations: [],
    sourceAvailable: false,
  },
  {
    slug: "revs",
    name: "Revs",
    year: "2016",
    sortYear: 2016,
    family: "Circuits",
    paradigm: "Classical F#-based language compiled to reversible circuits",
    reversibility: "Compiled to bijective circuits",
    summary:
      "An ML-like language whose programs compile to combinational reversible circuits; the source language of the verified ReVerC compiler.",
    description: [
      "Revs is a classical, irreversible-looking, ML-like language (embedded in F# quotations) that is compiled to combinational reversible circuits. It is the input language of ReVerC, the formally verified compiler: ReVerC minimizes ancilla bits, provably cleans temporary values, and can emit Q# or .qc circuits — the main route from high-level code to reversible hardware in the quantum toolchain.",
    ],
    papers: [
      {
        title: "Reversible circuit compilation with space constraints",
        authors: "A. Parent, M. Roetteler, K. M. Svore",
        year: "2016",
        url: "https://arxiv.org/abs/1206.0758",
      },
      {
        title: "Verified compilation of space-efficient reversible circuits",
        authors: "M. Amy, M. Roetteler, K. M. Svore",
        year: "2017",
        venue: "CAV 2017, LNCS 10427",
        url: "https://arxiv.org/abs/1603.01635",
      },
    ],
    implementations: [
      {
        name: "ReVerC (verified compiler, F⋆)",
        kind: "Compiler (verified)",
        url: "https://github.com/msr-quarc/ReVerC",
      },
    ],
    sourceAvailable: true,
    examples: [
      {
        title: "carryRippleAdder in Revs (F# quotation compiled to a reversible circuit)",
        lang: "fsharp",
        code: `let carryRippleAdder n =
    <@
    fun (a : bool array) (b : bool array) ->
      let compute_carry (a : bool) (b : bool) (c : bool) =
        (a && (b <> c)) <> (b && c) // a && b <> a && c <> b && c

      let result = Array.zeroCreate(n)
      let mutable carry = false
      result.[0] <- a.[0] <> b.[0]
      for i in 1 .. n-1 do
        carry <- compute_carry a.[i-1] b.[i-1] carry
        result.[i]  <-  a.[i] <> b.[i] <> carry
      result
    @>`,
        source: "ReVerC repository, examples/adderGen/AdderGen.fs (github.com/msr-quarc/ReVerC)",
        note: "ReVerC compiles this quotation to a combinational reversible circuit and emits Q# (adder.qs).",
      },
    ],
  },
  {
    slug: "ricercar",
    name: "Ricercar",
    year: "2015",
    sortYear: 2015,
    family: "Circuits",
    paradigm: "Circuit description & rewriting language",
    reversibility: "Permutation semantics",
    summary:
      "Thomsen, Kaarsgaard & Soeken's language for describing and rewriting reversible circuits with ancillae, with a permutation semantics.",
    description: [
      "Ricercar is a language for describing and rewriting reversible circuits that use ancillae. It comes with a permutation semantics, which makes it useful for reasoning about circuit identities and equivalences.",
    ],
    papers: [
      {
        title: "Ricercar: a language for describing and rewriting reversible circuits with ancillae and its permutation semantics",
        authors: "M. K. Thomsen, R. Kaarsgaard, M. Soeken",
        year: "2015",
        venue: "RC 2015, LNCS 9138",
      },
    ],
    implementations: [],
    sourceAvailable: false,
  },
  {
    slug: "janus-circuit-compiler",
    name: "Janus → circuits compiler",
    year: "2015",
    sortYear: 2015,
    family: "Circuits",
    paradigm: "Compiler (Janus variant → reversible circuits)",
    reversibility: "Compiles to no-feedback reversible circuits",
    summary:
      "Alex Parent's open-source compiler from a Janus variant to reversible circuits (fixed-bound loops, no recursion).",
    description: [
      "A small open-source compiler (jcc/rcc) based on a slightly modified Janus compiles programs to a no-feedback reversible circuit model. Loops are supported only with fixed bounds; recursion is not supported in the circuit target.",
    ],
    papers: [
      {
        title: "A reversible programming language and its invertible self-interpreter",
        authors: "T. Yokoyama, R. Glück",
        year: "2007",
        venue: "PEPM 2007",
        url: "https://doi.org/10.1145/1244381.1244404",
      },
    ],
    implementations: [
      {
        name: "rcc / jcc",
        kind: "Open-source compiler",
        url: "https://github.com/aparent/rcc",
      },
    ],
    sourceAvailable: true,
  },
  {
    slug: "rcc-reverse-c-compiler",
    name: "rcc (Reverse C Compiler)",
    year: "1999",
    sortYear: 1999,
    family: "Retrofitted",
    paradigm: "Source-to-source C instrumentation",
    reversibility: "Reversibilization by logging (SAVE/RESTORE)",
    summary:
      "Perumalla & Fujimoto's source-to-source translator: emits a forward C program with SAVE statements and a reverse program with RESTORE statements.",
    description: [
      "The Reverse C Compiler (rcc) takes a sequential C program and produces two versions: a forward version instrumented with SAVE commands that record overwritten values (X = 2 becomes SAVE(X); X = 2), and a reverse version with RESTORE commands in inverted order. Conditionals save the boolean outcome; loops save a loop counter.",
      "It was built for optimistic parallel discrete-event simulation, where events must be rolled back. rcc was not publicly released; a later open line of work is Rever-C.",
    ],
    papers: [
      {
        title: "Efficient optimistic parallel simulations using reverse computation",
        authors: "K. S. Perumalla, R. M. Fujimoto",
        year: "1999",
        venue: "PADS 1999",
      },
    ],
    implementations: [],
    sourceAvailable: false,
    sourceNote: "Not publicly released.",
  },
  {
    slug: "rever-c",
    name: "Rever-C",
    year: "2010s",
    sortYear: 2012,
    family: "Retrofitted",
    paradigm: "Source-to-source C reversal compiler",
    reversibility: "Reversibilization by logging",
    summary:
      "Perumalla's source-to-source C reversal compiler and related Rever-* tools (Rever-BLAS, Rever-Apps) from the reverse-computation line of work.",
    description: [
      "Rever-C is a source-to-source compiler that automatically generates reverse functions from C functions, in the same spirit as rcc, developed for large-scale reversible simulation. Related artifacts include a BLAS extension (Rever-BLAS) and benchmark mini-apps (Rever-Apps).",
    ],
    papers: [
      {
        title: "Rever-C: source-to-source C reversal compiler (Rever Challenge series)",
        authors: "K. S. Perumalla et al.",
        year: "2010s",
        url: "https://science.osti.gov/-/media/ascr/ascac/pdf/meetings/nov11/Perumalla.pdf",
      },
    ],
    implementations: [],
    sourceAvailable: false,
  },
  {
    slug: "reversible-erlang",
    name: "Reversible Erlang",
    year: "2016",
    sortYear: 2016,
    family: "Retrofitted",
    paradigm: "Reversible semantics for Erlang",
    reversibility: "Reversible operational semantics + causal-consistent debugging",
    summary:
      "Lanese, Schultz, Ulidowski et al.'s reversible semantics for a subset of Erlang, used for causal-consistent debugging of distributed programs.",
    description: [
      "Rather than a new language, this line of work gives a reversible operational semantics to a subset of Erlang (actor-model concurrency). Combined with causal-consistent debugging (Fabbretti, Lanese, Stefani), it lets distributed Erlang programs be debugged by stepping backwards through causally consistent states.",
    ],
    papers: [
      {
        title: "A reversible semantics for Erlang",
        authors: "A. Palacios, G. Vidal",
        year: "2017",
        venue: "LOPSTR 2016",
        url: "http://gvidal.webs.upv.es/confs/lopstr16b/paper.pdf",
      },
      {
        title: "Reversible computing in debugging of Erlang programs",
        authors: "I. Lanese, U. P. Schultz, I. Ulidowski",
        year: "2022",
        venue: "IT Professional 24(1)",
        url: "https://doi.org/10.1109/MITP.2021.3117550",
      },
      {
        title: "Causal-consistent debugging of distributed Erlang programs",
        authors: "G. Fabbretti, I. Lanese, J.-B. Stefani",
        year: "2021",
        venue: "RC 2021",
      },
    ],
    implementations: [],
    sourceAvailable: false,
  },
  {
    slug: "reversible-m",
    name: "Reversible M",
    year: "2022",
    sortYear: 2022,
    family: "Retrofitted",
    paradigm: "Imperative concurrent language with reversible semantics",
    reversibility: "Reversible semantics for a concurrent imperative language",
    summary:
      "A reversible semantics for “M”, an imperative language with interleaving parallelism, contrasting reversible languages with reversibilized existing ones.",
    description: [
      "The paper “Reversing an Imperative Concurrent Programming Language M” (arXiv 2205.01171) defines reversible execution for M, a simple imperative concurrent language, and surveys the two approaches to reversibility: designing reversible languages (Janus, R-WHILE, …) versus adding reversibility to existing languages (rcc, checkpointing, reversible Erlang).",
    ],
    papers: [
      {
        title: "Reversing an imperative concurrent programming language M",
        authors: "— et al.",
        year: "2022",
        venue: "arXiv:2205.01171",
        url: "https://arxiv.org/abs/2205.01171",
      },
    ],
    implementations: [],
    sourceAvailable: false,
  },
  {
    slug: "rccs",
    name: "RCCS",
    year: "2004",
    sortYear: 2004,
    family: "Retrofitted",
    paradigm: "Reversible CCS process calculus",
    reversibility: "Reversible semantics with per-process memories",
    summary:
      "Danos & Krivine's reversible CCS: each process carries a memory so communications can be undone; the basis of most reversible concurrent languages.",
    description: [
      "RCCS (Reversible CCS) equips each CCS process with a dedicated memory that records which processes were involved in each action, making reductions invertible. It is a process calculus rather than a programming language, but it is the theoretical foundation for reversible concurrency (CRIL, reversible Erlang, reversible π-calculus).",
    ],
    papers: [
      {
        title: "Reversible communicating systems",
        authors: "V. Danos, J. Krivine",
        year: "2004",
        venue: "CONCUR 2004",
      },
    ],
    implementations: [],
    sourceAvailable: false,
  },
  {
    slug: "ccsk",
    name: "CCSK",
    year: "2010s",
    sortYear: 2010,
    family: "Retrofitted",
    paradigm: "CCS with keys",
    reversibility: "Reversible semantics via keys",
    summary:
      "Phillips & Ulidowski's alternative reversible CCS using keys instead of memories; compared with RCCS by Medić et al.",
    description: [
      "CCSK (CCS with Keys) is an alternative approach to reversing CCS: instead of memories, actions carry keys that allow the inverse action to be identified. Medić, Lanese and colleagues have compared RCCS and CCSK and studied forward-reverse observational equivalences in CCSK.",
    ],
    papers: [
      {
        title: "CCS with keys / forward-reverse observational equivalences in CCSK",
        authors: "I. Phillips, I. Ulidowski, I. Lanese et al.",
        year: "2010s",
        url: "https://reversible-computation-2021.github.io/program",
      },
    ],
    implementations: [],
    sourceAvailable: false,
  },
  {
    slug: "qcl",
    name: "QCL",
    year: "2000",
    sortYear: 2000,
    family: "Quantum",
    paradigm: "Quantum programming language",
    reversibility: "Unitary (inherently reversible)",
    summary:
      "One of the earliest quantum programming languages, with classical control flow and explicit quantum operations.",
    description: [
      "QCL (Ömer, ~2000) is an early quantum programming language with classical control structures and quantum operators. Quantum languages are adjacent to reversible languages because unitary evolution is inherently reversible; measurement and initialization are the irreversible parts.",
    ],
    papers: [],
    implementations: [],
    sourceAvailable: false,
  },
  {
    slug: "quipper",
    name: "Quipper",
    year: "2013",
    sortYear: 2013,
    family: "Quantum",
    paradigm: "Quantum language embedded in Haskell",
    reversibility: "Unitary; classical parts via oracles",
    summary:
      "Green et al.'s quantum language embedded in Haskell for scalable circuit generation; classical functions are embedded via Bennett's method.",
    description: [
      "Quipper (Proc. R. Soc. A 2013) is a quantum programming language embedded in Haskell. High-level code with irreversible functions used as oracles is expanded into reversible circuits and combined into one large circuit; it lacks a linear type system, so reversibility of the classical embedding is not statically guaranteed.",
    ],
    papers: [
      {
        title: "Quipper: a scalable quantum programming language",
        authors: "A. Green et al.",
        year: "2013",
        venue: "Proc. R. Soc. A 470",
        url: "https://doi.org/10.1098/rspa.2013.0299",
      },
    ],
    implementations: [],
    sourceAvailable: true,
    sourceNote: "Quipper is publicly available from the Quipper project at Oxford.",
  },
  {
    slug: "qsharp",
    name: "Q#",
    year: "2017",
    sortYear: 2017,
    family: "Quantum",
    paradigm: "Microsoft quantum DSL",
    reversibility: "Unitary operations; functors for controlled/adjoint",
    summary:
      "Microsoft's quantum development kit language: classical control flow plus reversible unitary operations with adjoint/controlled functors.",
    description: [
      "Q# is Microsoft's domain-specific language for quantum computing (announced 2017, part of the Quantum Development Kit). Programs mix classical control flow with unitary quantum operations; the adjoint (Adjoint) and controlled (Controlled) functors expose reversibility explicitly. ReVerC can emit Q# circuits.",
    ],
    papers: [],
    implementations: [
      {
        name: "Microsoft Quantum Development Kit",
        kind: "Toolchain",
        url: "https://learn.microsoft.com/azure/quantum/",
      },
    ],
    sourceAvailable: true,
    logo: "/logos/qsharp.png",
    logoCredit: "Q# logo via Wikimedia Commons (CC BY-SA 4.0)",
  },
  {
    slug: "silq",
    name: "Silq",
    year: "2020",
    sortYear: 2020,
    family: "Quantum",
    paradigm: "High-level quantum language",
    reversibility: "Automatic uncomputation via linear types",
    summary:
      "Bichsel et al.'s high-level quantum language whose type system automatically inserts uncomputation — the closest quantum language to classical reversibility.",
    description: [
      "Silq (PLDI 2020) is a high-level quantum programming language with a linear type system that automatically uncomputes temporary values — conceptually very close to clean classical reversible computation. It is the most relevant quantum language if your interest is reversibility/uncomputation.",
    ],
    papers: [
      {
        title: "Silq: a high-level quantum language with a first-class notion of reversal",
        authors: "B. Bichsel et al.",
        year: "2020",
        venue: "PLDI 2020",
      },
    ],
    implementations: [],
    sourceAvailable: true,
    sourceNote: "Silq compiler is publicly available (silq.ethz.ch).",
    logo: "/logos/silq.svg",
    logoCredit: "Official Silq logo, ETH Zürich (CC BY-SA 4.0), silq.ethz.ch",
  },
  {
    slug: "proto-quipper",
    name: "Proto-Quipper",
    year: "2017",
    sortYear: 2017,
    family: "Quantum",
    paradigm: "Dependently typed quantum circuit core",
    reversibility: "Circuits as first-class, type-safe values",
    summary:
      "A dependently typed core language for quantum circuit description, in the line of Proto-Quipper-M / Proto-Quipper-D.",
    description: [
      "Proto-Quipper is a family of dependently typed core languages for describing quantum circuits, where circuits are first-class values and their types track the number of wires — a type-safe foundation for circuit generation.",
    ],
    papers: [],
    implementations: [],
    sourceAvailable: false,
  },
  {
    slug: "rever",
    name: "Rever",
    year: "2023",
    sortYear: 2023,
    family: "Imperative",
    paradigm: "Experimental reversible language (Rust)",
    reversibility: "Fully reversible operations only",
    summary:
      "An experimental open-source reversible language in Rust, inspired by Janus, Pascal, and Python; garbage handling is left to the programmer.",
    description: [
      "Rever is an in-development experimental reversible programming language implemented in Rust, with syntax inspired by Janus, Pascal, and Python. Only reversible operations are available, and the programmer is expected to handle garbage explicitly. Useful as a small, readable Janus-style interpreter.",
    ],
    papers: [],
    implementations: [
      {
        name: "Rever interpreter",
        kind: "Open-source interpreter (Rust)",
        url: "https://codeberg.org/1011X/rever",
      },
    ],
    sourceAvailable: true,
    logo: "/logos/rever.png",
    logoCredit: "logo.png from the Rever repository (0BSD), codeberg.org/1011X/rever",
  },
  {
    slug: "revpy",
    name: "RevPy",
    year: "2026",
    sortYear: 2026,
    family: "Library",
    paradigm: "Reversible programming embedded in Python",
    reversibility: "Fully reversible functions in ordinary Python syntax",
    summary:
      "A Python library for reversible programming: reversible if/fi and while/elihw constructs with static lifetime checks, inspired by Janus.",
    description: [
      "RevPy is a library that lets you write Python functions executable in both directions. It provides reversible if/fi and while/elihw constructs, a ReversibleFunction type, and a @reversible decorator that compiles a reversible program; variable lifetimes are checked statically (every variable must be destroyed exactly once). Inspired by Janus but living entirely inside Python.",
    ],
    papers: [],
    implementations: [
      {
        name: "revpy-lang",
        kind: "Python package (PyPI)",
        url: "https://pypi.org/project/revpy-lang",
      },
    ],
    sourceAvailable: true,
  },
  {
    slug: "rr",
    name: "rr",
    year: "2010s",
    sortYear: 2015,
    family: "Tools",
    paradigm: "Record-and-replay reverse debugger",
    reversibility: "Reverse execution via recorded trace",
    summary:
      "Mozilla's record-and-replay debugger: deterministic replay plus reverse execution (reverse-continue, reverse-step) under gdb.",
    description: [
      "rr records a native program's execution and allows deterministic replay and reverse debugging (reverse-continue, reverse-step, reverse-finish) under GDB. This is “undo” via a trace, not logical reversibility, but it is the everyday tool most developers use to run code backwards.",
    ],
    papers: [],
    implementations: [
      {
        name: "rr",
        kind: "Open-source debugger",
        url: "https://rr-project.org/",
      },
    ],
    sourceAvailable: true,
  },
  {
    slug: "gdb-reverse",
    name: "GDB reverse debugging",
    year: "2000s",
    sortYear: 2008,
    family: "Tools",
    paradigm: "Checkpoint-based reverse execution",
    reversibility: "Reverse execution via checkpoints",
    summary:
      "GNU GDB's built-in reverse execution: reverse-continue, reverse-step, reverse-next, backed by record/checkpoint.",
    description: [
      "GDB supports reverse debugging of natively recorded programs: reverse-continue, reverse-step, reverse-next, etc. It relies on recorded checkpoints rather than logical reversibility, but it is built into the standard toolchain.",
    ],
    papers: [],
    implementations: [
      {
        name: "GDB",
        kind: "Debugger (part of GNU toolchain)",
        url: "https://sourceware.org/gdb/current/onlinedocs/gdb.html/Reverse-Execution.html",
      },
    ],
    sourceAvailable: true,
  },
  {
    slug: "revkit",
    name: "RevKit",
    year: "2010s",
    sortYear: 2016,
    family: "Tools",
    paradigm: "Reversible & quantum logic synthesis toolkit",
    reversibility: "N/A — synthesis toolkit",
    summary:
      "Soeken's open-source toolkit for reversible and quantum logic synthesis, simulation, and verification.",
    description: [
      "RevKit is a C++ toolkit for reversible and quantum logic: circuit representation, synthesis (e.g. ESOP-based), simulation, and equivalence checking. It is the standard toolbox for the circuit side of reversible computing.",
    ],
    papers: [],
    implementations: [
      {
        name: "RevKit",
        kind: "Open-source toolkit",
        url: "https://github.com/msoeken/revkit",
      },
    ],
    sourceAvailable: true,
  },
  {
    slug: "bidicalc",
    name: "bidicalc",
    year: "2020s",
    sortYear: 2022,
    family: "Tools",
    paradigm: "Bidirectional spreadsheet",
    reversibility: "Bidirectional evaluation",
    summary:
      "A bidirectional spreadsheet: edit an output cell and it solves backwards through the formula chain for the inputs that produce it.",
    description: [
      "bidicalc is a small open-source (AGPL) bidirectional spreadsheet. Editing an output cell solves backwards through the formula chain to the inputs — a everyday example of bidirectional/invertible computation.",
    ],
    papers: [],
    implementations: [
      {
        name: "bidicalc",
        kind: "Open-source web app",
        url: "https://victorpoughon.github.io/bidicalc/",
      },
    ],
    sourceAvailable: true,
  },
  {
    slug: "asm-sequence-dsl",
    name: "Reversible assembly-sequence DSL",
    year: "2015",
    sortYear: 2015,
    family: "Domain-specific",
    paradigm: "DSL for reversible assembly sequences (robotics)",
    reversibility: "Fully reversible sequences",
    summary:
      "Schultz, Laursen, Ellekilde & Axelsen's reversible DSL for specifying assembly sequences in robotics — reversibility as a usability/correctness feature.",
    description: [
      "A domain-specific reversible language for assembly sequences in robotics (RC 2015). Reversible sequencing is useful here as a correctness and undo feature rather than for energy: assembly plans can be inverted step by step.",
    ],
    papers: [
      {
        title: "Towards a domain-specific language for reversible assembly sequences",
        authors: "U. P. Schultz, J. S. Laursen, L.-P. Ellekilde, H. B. Axelsen",
        year: "2015",
        venue: "RC 2015, LNCS 9138",
      },
    ],
    implementations: [],
    sourceAvailable: false,
  },
];

export function bySlug(slug: string): Language | undefined {
  return languages.find((l) => l.slug === slug);
}

/* ------------------------------------------------------------------ */
/* Groups & tags                                                       */
/* ------------------------------------------------------------------ */

export type Kind = "language" | "tool";

/** Top-level group: only "Languages" and "Tools" remain as sections. */
export function kindOf(l: Language): Kind {
  return l.family === "Tools" ? "tool" : "language";
}

const FAMILY_TAG: Partial<Record<Category, string>> = {
  Imperative: "imperative",
  Functional: "functional",
  "Object-oriented": "object-oriented",
  "Core language": "core",
  "Low-level & ISA": "low-level",
  Circuits: "circuits",
  "Domain-specific": "dsl",
  Retrofitted: "retrofitted",
  Quantum: "quantum",
  Library: "library",
  // Tools are their own section; no "tool" tag needed.
};

/** Extra per-language tags beyond the family tag. */
const EXTRA_TAGS: Record<string, string[]> = {
  cril: ["concurrent"],
  rccs: ["concurrent", "calculus"],
  ccsk: ["concurrent", "calculus"],
  "reversible-erlang": ["concurrent"],
  "reversible-m": ["concurrent", "imperative"],
  hermes: ["crypto"],
  "asm-sequence-dsl": ["robotics"],
  nilang: ["julia"],
  revpy: ["python"],
  revkit: ["synthesis"],
  rr: ["reverse-debugging"],
  "gdb-reverse": ["reverse-debugging"],
  bidicalc: ["bidirectional"],
};

export function tagsOf(l: Language): string[] {
  const tags: string[] = [];
  const ft = FAMILY_TAG[l.family];
  if (ft) tags.push(ft);
  tags.push(...(EXTRA_TAGS[l.slug] ?? []));
  if (l.examples && l.examples.length > 0) tags.push("example");
  if (l.papers.length > 0) tags.push("papers");
  return [...new Set(tags)];
}

export const TAG_ORDER = [
  "imperative",
  "functional",
  "object-oriented",
  "core",
  "low-level",
  "circuits",
  "dsl",
  "retrofitted",
  "quantum",
  "library",
  "concurrent",
  "calculus",
  "crypto",
  "robotics",
  "julia",
  "python",
  "synthesis",
  "reverse-debugging",
  "bidirectional",
  "example",
  "papers",
];

export function allTags(): { tag: string; count: number }[] {
  const m = new Map<string, number>();
  for (const l of languages) {
    for (const t of tagsOf(l)) m.set(t, (m.get(t) ?? 0) + 1);
  }
  return TAG_ORDER.filter((t) => m.has(t)).map((t) => ({ tag: t, count: m.get(t)! }));
}
