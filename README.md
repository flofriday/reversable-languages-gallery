# Reversible Programming Languages

A curated, comprehensible catalog of programming languages and language-like
systems in which computation is deterministic **both forwards and backwards**.

The list is grouped by paradigm, with a short explanation of what each language
contributes, its implementation status, and pointers to primary sources. It also
separates *true reversible languages* from adjacent work (reverse debuggers,
reversibility retrofitted onto existing languages, and quantum languages).

> **Terminology note.** "Reversible" here means *logically reversible*: the
> program's state transition is injective, so the previous state can be recovered
> from the current one without consulting an external history. This is different
> from "undo" or "reverse debugging", where a trace or checkpoint is kept.

A machine-readable version of the catalog is in [`languages.csv`](languages.csv).

---

## 🌐 Website: Reversible Language Gallery

This repository also contains a static website that presents the catalog:
an overview of all 53 entries with tag-pill filters, and a detail page per
language (description, key constructs, verified code examples with a
dropdown and CodeMirror 6 highlighting, papers, implementations, logos).

- **Stack**: Astro 7 (static) + React + shadcn/ui components (Radix + cva),
  Tailwind CSS v4, CodeMirror 6 for code blocks, Libertinus Serif +
  JetBrains Mono fonts.
- **Data**: `src/data/languages.ts` — one entry per language; the site is
  generated from it.

### Run locally

```bash
npm ci
npm run dev        # http://localhost:4321
npm run build      # static output in dist/
npm run preview    # serve dist/
```

### Deploy to GitHub Pages

Push this repository to GitHub and enable **Pages → Build and deployment →
GitHub Actions** in the repo settings. The workflow
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds the
site on every push to `main` and deploys `dist/` to Pages automatically.
The Astro `base` path is derived from `GITHUB_REPOSITORY`, so it works for
both `https://<user>.github.io/<repo>/` project pages and
`https://<user>.github.io/` user pages. No secrets needed.

---

## Contents

1. [What makes a language reversible?](#1-what-makes-a-language-reversible)
2. [The essential dozen](#2-the-essential-dozen)
3. [Full catalog](#3-full-catalog)
   - [3.1 Imperative and procedural](#31-imperative-and-procedural)
   - [3.2 Object-oriented](#32-object-oriented)
   - [3.3 Functional](#33-functional)
   - [3.4 Core, flowchart, and teaching languages](#34-core-flowchart-and-teaching-languages)
   - [3.5 Intermediate languages and reversible ISAs](#35-intermediate-languages-and-reversible-isas)
   - [3.6 Circuit and hardware description](#36-circuit-and-hardware-description)
   - [3.7 Domain-specific languages](#37-domain-specific-languages)
   - [3.8 Reversibility added to existing languages](#38-reversibility-added-to-existing-languages)
   - [3.9 Quantum languages (adjacent)](#39-quantum-languages-adjacent)
   - [3.10 Community and experimental implementations](#310-community-and-experimental-implementations)
4. [Timeline](#4-timeline)
5. [How the pieces fit together](#5-how-the-pieces-fit-together)
6. [Where to start](#6-where-to-start)
7. [Open problems](#7-open-problems)
8. [Sources](#8-sources)

---

## 1. What makes a language reversible?

A reversible programming language guarantees that every well-typed program
denotes a **partial injective function** (a bijection between its domain and
range). Running the program backwards is a first-class operation, not a debugging
trick.

Most designs enforce this through **local invertibility**:

| Concept | Irreversible version | Reversible replacement |
|---|---|---|
| Assignment | `x = e` (destroys the old `x`) | `x += e`, `x -= e`, `x ^= e`, `x <=> y` |
| Conditional | `if e then s1 else s2` | `if e1 then s1 else s2 fi e2` — entry test **and** exit assertion |
| Loop | `while e do s` | `from e1 do s1 loop s2 until e2` — entry assertion and exit test |
| Procedure call | `call p` | `call p` / `uncall p` (or `rcall`) |
| Local variable | allocate/free | `local x = e1 in s delocal x = e2` — final value is part of the syntax |
| Data | overwrite/delete | swap, move, or compute-then-uncompute |

Two important quality measures:

- **Clean / garbage-free**: the inverse computation consumes exactly the
  intermediate values the forward computation produced, leaving no ancilla
  garbage. This is what makes a language physically interesting.
- **r-Turing complete**: the language can simulate every reversible Turing
  machine cleanly. Janus was the first high-level language proved to have this
  property (Yokoyama & Glück, 2007).

There are also two broad implementation strategies:

1. **Reversible by construction** — the language only admits locally invertible
   primitives (Janus, RFun, Theseus, ROOPL, ...).
2. **Reversibilization** — an ordinary language is instrumented or given a
   reversible semantics, usually by logging lost information (Eel, rcc,
   reversible Erlang, ...).

A third, newer strategy is **global invertibility without local invertibility**:
allow irreversible operations, but statically prove that the whole program is
still injective (Jeopardy, Sparcl).

---

## 2. The essential dozen

If you only look at twelve things, look at these.

| Language | Year | Why it matters |
|---|---:|---|
| **Janus** | 1982 | The canonical reversible imperative language; still the reference point for almost all work. |
| **R (MIT)** | 1997 | Frank's Lisp-like reversible language, co-designed with the Pendulum/PISA reversible processor. |
| **RFun** | 2011 | The canonical reversible functional language; untyped, first-order, Lisp-flavoured. |
| **Theseus** | 2012 | Typed functional reversible language based on type isomorphisms; all functions are partial isomorphisms. |
| **CoreFun** | 2018 | Small typed reversible core language; type system statically guarantees reversibility. |
| **Sparcl** | 2020 | Partially invertible functional language with linear types; practical bidirectional programming. |
| **ROOPL** | 2017 | First reversible object-oriented language (classes, inheritance, subtype polymorphism). |
| **Eel** | 2016 | First *partially* reversible language; explicit energy/space trade-off via a log stack. |
| **NiLang** | 2020 | Reversible Julia eDSL used for reverse-mode automatic differentiation. |
| **PISA** | 1999 | The Pendulum instruction set: a real reversible ISA, target of Janus and R. |
| **Revs / ReVerC** | 2016 | F#-based language and verified compiler to reversible circuits. |
| **Jeopardy** | 2022 | Reversible functional language that permits local irreversibility if the whole program is invertible. |

---

## 3. Full catalog

### 3.1 Imperative and procedural

| Language | Year | Status | One-liner |
|---|---:|---|---|
| **Janus** | 1982 | Interpreters, compilers | Reversible imperative language with `call`/`uncall`; r-Turing complete. |
| **R (MIT)** | 1997 | Compiler to PISA | Frank's S-expression reversible language for the Pendulum processor. |
| **Eel** | 2016 | Compiler + interpreter (Java) | Partially reversible language with a log stack and energy accounting. |
| **Hermes** | 2020 | Prototype | Reversible DSL for lightweight encryption with secret/public types. |
| **SRL** | 2003 | Formal model | Simple reversible language with stacks/arrays; total integer functions. |
| **S-CORE** | 2025 | Formal model | Stack-based reversible core extending SRL. |

#### Janus

Designed by Christopher Lutz and Howard Derby at Caltech in 1982 (the famous
letter to Rolf Landauer is from 1986), later rediscovered and formalized by
Tetsuo Yokoyama and Robert Glück. Janus is the *lingua franca* of reversible
programming:

- Global store of integers and fixed-size arrays; some versions add stacks.
- Reversible updates (`+=`, `-=`, `^=`), swap (`<=>`), and structured reversible
  conditionals and loops with entry assertions / exit tests.
- Procedures are called forwards with `call` and backwards with `uncall`.
- `local ... delocal` blocks make local variables reversible by recording their
  final value in the program text.
- Yokoyama and Glück proved it r-Turing complete by writing an invertible
  self-interpreter (PEPM 2007).

Implementations: the DIKU PIRC online interpreter, a compiler to PISA, and a
compiler to RSSA. Janus syntax is also the basis of Alex Parent's reversible
circuit compiler.

#### R (MIT)

Michael P. Frank's language from the MIT Reversible Computing project (PhD thesis
1999; language memo 1997). It is **not** the statistical language R. R has
Lisp-like S-expressions but C-like arrays and pointer arithmetic, and was
designed together with the Pendulum processor and its PISA instruction set. It
supports `call`/`rcall`, reversible updates, and `let` bindings whose variables
must be restored before scope exit.

#### Eel

Energy-Efficient Language by Nirvan Tyagi, Jayson Lynch, and Erik Demaine
(RC 2016). Eel is the first language explicitly designed for **partial**
reversibility: ordinary irreversible operations are allowed, but they cost
energy (in the Landauer sense), and a **log stack** records the information
needed to reverse them. It has three language levels, high-level control
operators (protected vs. general conditionals and loops), and an interpreter
that annotates energy costs. It is the practical counterpart to the
energy-efficient algorithms work of Demaine et al.

#### Hermes

Torben Ægidius Mogensen's domain-specific reversible language for lightweight
encryption (RC 2020; Science of Computer Programming 2022). You write the
encryption routine once; decryption is the same program run backwards. A type
system separates secret and public values and guarantees that secret data is
cleared and that execution time is independent of secret values, removing
several side-channel classes. A prototype compiler/interpreter exists.

#### SRL and S-CORE

- **SRL** (Armando Matos, 2003) is a minimal reversible language with stacks and
  arrays. Its programs are total and its integer variables range over ℤ, so
  increment and decrement are always mutually inverse.
- **S-CORE** (Matteo Palazzo and Luca Roversi, 2025/2026) extends SRL with a
  stack-based core and a notion of "reversible management of failures".

---

### 3.2 Object-oriented

| Language | Year | Status | One-liner |
|---|---:|---|---|
| **ROOPL** | 2017 | Compiler to PISA | First reversible object-oriented language: classes, inheritance, subtype polymorphism. |
| **ROOPL++** | 2018 | Compiler to PISA/HSSA | ROOPL plus dynamic memory management and fixed-size arrays. |

#### ROOPL

Tue Haulund's MSc thesis (DIKU, 2017) introduced the first reversible
object-oriented programming language. It is statically typed, supports
user-defined classes, encapsulation, inheritance, and dynamic dispatch, and
provides direct access to the inverse of each method (`uncall`). The thesis
includes a garbage-free translation to PISA and an r-Turing-completeness
argument via a reversible Turing machine simulator.

#### ROOPL++

Martin Holm Cservenka's follow-up (2018) adds dynamic memory management (a
buddy allocator) and fixed-size arrays, making non-trivial structures such as
binary trees and doubly linked lists feasible. It compiles to PISA and, in later
work, to HSSA.

---

### 3.3 Functional

| Language | Year | Status | One-liner |
|---|---:|---|---|
| **Psi-Lisp** | 1992 | Proposal | Baker's reversible Linear Lisp; injective primitives and swaps. |
| **Inv** | 2004 | Research language | Point-free reversible language aimed at document construction. |
| **RFun** | 2011 | Haskell interpreter | Untyped first-order reversible functional language with Lisp-style data. |
| **Theseus** | 2012 | Prototype | Typed functional language; every function is a partial isomorphism. |
| **RCFUN** | 2014 | Sketch / translation to Janus | Reversible functional language with reference counting. |
| **CoreFun** | 2018 | Prototype | Typed reversible core language; static guarantee of reversibility. |
| **Sparcl** | 2020 | Interpreter + Agda formalization | Partially invertible computation with linear types. |
| **Agni** | 2021 | Research language | Reversible functional array programming. |
| **Jeopardy** | 2022 | Prototype | Global invertibility without local invertibility. |
| **Chardonnet–Lemonnier–Valiron language** | 2024 | Formal language | Theseus-based, higher-order, inductive types, Turing-complete. |
| **PisoLang** | 2026 | Prototype | User-friendly reversible functional language with inductive types and type inference. |

#### Psi-Lisp

Henry G. Baker's 1992 proposal for a reversible variant of Linear Lisp. Every
cons cell has a single reference; primitive operations are injective; swapping
is used heavily because it is self-inverse. Psi-Lisp was never fully
implemented, but it is the historical root of the linear-typed approach to
reversible functional programming.

#### Inv

Mu, Hu, and Takeichi's reversible language (2004), point-free in style and
intended for document construction. It is one of the languages cited as an
ancestor of Sparcl and Yarel.

#### RFun

Introduced by Tetsuo Yokoyama, Holger Bock Axelsen, and Robert Glück ("Towards a
reversible functional language", RC 2011; journal version 2012). RFun is
untyped, first-order, and uses Lisp-style symbols and constructors. Bound
variables must be used linearly; functions are partial injections; the language
is syntactically closed under inversion and has a program inverter. A Haskell
interpreter exists. Later work by Kaarsgaard and Thomsen ("RFun Revisited",
2017) added types and a more Haskell-like surface syntax.

#### Theseus

Roshan P. James and Amr Sabry's typed functional reversible language (RC 2014),
built on the Π / Π⁰ reversible combinator calculus. All functions are partial
isomorphisms, patterns must be exhaustive and non-overlapping, and the type
system distinguishes reversible from irreversible arrows. It is the main
inspiration for later typed reversible functional languages.

#### RCFUN

Mogensen's sketch of a reversible functional language with reference counting
(RC 2014), translated into Janus. It is mainly interesting as a demonstration
that heap management can be made reversible.

#### CoreFun

Jacobsen, Kaarsgaard, and Thomsen (RC 2018). A small, explicitly typed
functional core language whose type system combines unrestricted and linear
reasoning to guarantee reversibility. It is r-Turing complete, has a formal
semantics, and is intended as a core into which higher-level features (variants,
type classes) can be desugared.

#### Sparcl

Kazutaka Matsuda and Meng Wang's "system for partially reversible computation
with linear types" (ICFP 2020; JFP 2024). Unlike fully reversible languages,
Sparcl lets some parts of a program be ordinary irreversible functions while
the invertible parts are statically guaranteed bijective. It has an Agda
formalization and an interpreter. Key constructs (`unlift`, `pin`) mediate
between the invertible and ordinary worlds.

#### Agni

Mogensen's reversible functional array language (RC 2021). It is notable for
treating arrays as first-class reversible data and for a type notation that
records which values are consumed and which are produced — a notation later
reused in the L4 intermediate language.

#### Jeopardy

Kristensen, Kaarsgaard, and Thomsen (arXiv 2022; RC 2024). Jeopardy is a
first-order functional language with algebraic data types and an `invert`
keyword. Its distinguishing feature is that it does **not** require local
invertibility: it allows uninvertible, even nondeterministic, operations as long
as an analysis (available implicit arguments) can show that the whole program is
globally invertible. This makes reversible programs look much more like ordinary
functional programs.

#### Chardonnet–Lemonnier–Valiron language

A Theseus-based higher-order reversible language with inductive types, general
recursion, and pattern matching (FSCD 2024). The authors prove it can encode any
reversible Turing machine and give a sound and adequate categorical semantics in
join inverse categories. A companion line of work by Chardonnet, Saurin, and
Valiron establishes a Curry–Howard correspondence with linear logic extended
with least fixed points (μMALL).

#### PisoLang

Onodera, Nakano, Asada, and Kikuchi (RC 2026). A user-oriented reversible
functional language built on the Chardonnet et al. calculus, adding features
that make everyday programming more convenient: more conventional syntax,
polymorphism, type inference, and inductive types. It is one of the most recent
signs that reversible functional languages are moving from core calculi toward
usable languages.

---

### 3.4 Core, flowchart, and teaching languages

These are small languages used to isolate the essential ingredients of
reversibility, prove metatheorems, and teach the paradigm.

| Language | Year | One-liner |
|---|---:|---|
| **RL** | — | Unstructured reversible language with jumps (cited in the flowchart literature). |
| **SRL** | 2003 | Reversible language with stacks and arrays; total functions. |
| **R-CORE** | 2015 | Minimal r-Turing complete core: reversible assignment, reversible while, dynamic data. |
| **R-WHILE** | 2015 | Reversible WHILE with tree-structured data, procedures, and a linear-time self-interpreter. |
| **RFCL** | 2015 | Reversible flowchart language; the common semantic skeleton of Janus-like languages. |
| **S-CORE** | 2025 | Stack-based extension of SRL. |

#### R-CORE

Glück and Yokoyama's minimal core language. It has just three ingredients:
reversible assignment, a reversible while loop, and dynamic data structures
built from one binary constructor and one symbol. Despite its minimality it is
r-Turing complete. It is the "assembly language" of reversible imperative
semantics.

#### R-WHILE

A reversible version of Jones's WHILE language, with structured control flow,
symbolic tree-structured data (S-expressions), recursive procedures, and
reversible replacements. It is r-Turing complete and has a linear-time
reversible self-interpreter (Glück & Yokoyama, 2016). Its denotational semantics
is a standard example in the categorical semantics literature.

#### RFCL

The Reversible Flowchart Language (Yokoyama, Axelsen, Glück, 2015). It is the
diagrammatic common core of structured reversible imperative languages: sequence,
reversible conditional, and reversible loop. Janus without recursion, R-WHILE,
and R-CORE are all instances. The "Structured Reversible Program Theorem" says
that unstructured reversible flowcharts can be structured using only these
three constructs.

---

### 3.5 Intermediate languages and reversible ISAs

These are the compilation targets and low-level languages that make reversible
high-level languages executable.

| Language / ISA | Year | Kind | One-liner |
|---|---:|---|---|
| **PISA** | 1999 | Instruction set | Pendulum ISA: 12-bit reversible RISC with direction and branch bits. |
| **BobISA** | 2010s | Instruction set | Small reversible processor ISA; target for RFun. |
| **RIL** | 2015 | IR | Reversible intermediate language used for memory analysis. |
| **RSSA** | 2016 | IR | Reversible SSA form for compiling reversible languages. |
| **CRIL** | 2023 | IR | Concurrent reversible intermediate language with P/V synchronization. |
| **HSSA** | 2024 | IR | Hybrid SSA: mixes reversible and classical code. |
| **L4** | 2026 | IR | Generic linearly typed reversible low-level language; intended successor to RSSA. |

#### PISA / Pendulum

The Pendulum processor was a 12-bit, RISC-inspired, fully reversible
microprocessor implemented in 0.5 μm CMOS at MIT. Its instruction set, PISA,
includes a direction bit (`DIR`), a branch bit (`BR`), reversible branches
(`BEZ`/`RBEZ`, `BLTZ`/`RBLTZ`), a reversible exchange instruction (`EXCH`), and
arithmetic/logic operations whose behaviour depends on the direction bit. It is
the target of Frank's R compiler and of Janus-to-PISA compilers.

#### RSSA

Mogensen's reversible variant of SSA (2016). Making SSA reversible is
non-trivial because SSA's single-assignment discipline is incompatible with the
reversible updates and exchanges used by Janus-like languages, and because
φ-nodes are needed at both joins and splits of control flow. RSSA solves this by
letting selected uses destroy variables and by adding parameters to labels. It
supports copy propagation, constant propagation, and register allocation.

#### HSSA

Hybrid SSA (Gail & Meyer, RC 2024). HSSA is a partially reversible intermediate
language that can mix reversible and classical code, and it is the target of a
ROOPL++ compiler. It is a pragmatic bridge between reversible languages and
conventional compilation pipelines.

#### L4

Mogensen's 2026 generic, linearly typed, low-level reversible language, intended
to replace and generalize RSSA. It has a formal type system and a bidirectional
small-step semantics in which the direction of execution can change mid-run. Its
function types distinguish read-only, consumed, and produced values — a notation
borrowed from Agni.

#### CRIL

Oguchi and Yuen's Concurrent Reversible Intermediate Language (EXPRESS/SOS 2023).
CRIL extends RIL with multiple concurrent blocks and P/V-style synchronization.
Its operational semantics uses an annotation DAG to preserve causal safety and
causal liveness when executing backwards.

---

### 3.6 Circuit and hardware description

Reversible circuits are the hardware counterpart of reversible languages. These
languages describe circuits or compile high-level code into them.

| Language / tool | Year | One-liner |
|---|---:|---|
| **Revs** | 2016 | F#-based language compiled to combinational reversible circuits. |
| **ReVerC** | 2017 | Formally verified (F⋆) compiler from Revs to reversible circuits. |
| **Ricercar** | 2015 | Research language for describing and rewriting reversible circuits with ancillae. |
| **Janus-to-circuit compiler** | 2015 | Alex Parent's compiler from a Janus variant to reversible circuits. |
| **RevKit** | 2010s | Toolkit for reversible and quantum logic synthesis (not a language). |

#### Revs and ReVerC

Revs is a classical, F#-based language whose programs are compiled to
combinational reversible circuits. ReVerC (Amy, Roetteler, Svore; CAV 2017) is
the verified compiler: it is written and proved correct in F⋆, minimizes
ancilla bits, and provably cleans temporary values. It can emit Q# or `.qc`
circuits. This is the main route from high-level code to reversible hardware in
the quantum-computing toolchain.

#### Ricercar

Thomsen, Kaarsgaard, and Soeken's language for describing and rewriting
reversible circuits with ancillae (RC 2015). It comes with a permutation
semantics, which makes it useful for reasoning about circuit identities.

---

### 3.7 Domain-specific languages

| Language | Year | Domain | One-liner |
|---|---:|---|---|
| **Hermes** | 2020 | Cryptography | Reversible encryption; decryption for free; side-channel-resistant types. |
| **NiLang** | 2020 | Automatic differentiation | Reversible Julia eDSL; reverse-mode AD without a tape. |
| **Reversible assembly-sequence DSL** | 2015 | Robotics/assembly | Reversible sequencing of assembly operations. |
| **bidicalc** (tool) | 2020s | Spreadsheets | Bidirectional spreadsheet: edit an output and solve for inputs. |

#### NiLang

Jin-Guo Liu and Taine Zhao's reversible embedded DSL in Julia (arXiv 2020). Any
NiLang program is differentiable: reverse-mode automatic differentiation is
implemented by running the program backwards, so no tape of intermediate values
is needed. It supports floating-point numbers, complex numbers, arrays, and a
reversible logarithmic number system, and has been used for sparse matrices,
normalizing flows, and physics simulations. It is one of the most practically
used reversible languages today.

#### Reversible assembly-sequence DSL

Schultz, Laursen, Ellekilde, and Axelsen (RC 2015) proposed a domain-specific
reversible language for specifying assembly sequences in robotics. It is a good
example of reversibility as a correctness/usability feature rather than an
energy feature.

---

### 3.8 Reversibility added to existing languages

These systems do not define a new reversible language from scratch; they add
reversible execution to an existing language, usually by logging or by a
reversible operational semantics.

| System | Year | Base language | Approach |
|---|---:|---|---|
| **rcc / Reverse C Compiler** | 1999 | C | Source-to-source instrumentation: `SAVE`/`RESTORE` statements. |
| **Rever-C** | 2010s | C | Perumalla's source-to-source C reversal compiler. |
| **Reversible Erlang** | 2020s | Erlang | Reversible semantics and causal-consistent debugger. |
| **Reversible M** | 2022 | M (imperative concurrent) | Reversible semantics for a concurrent imperative language. |
| **RCCS** | 2004 | CCS | Reversible process calculus with memories. |
| **CCSK** | 2010s | CCS | CCS with keys; alternative reversible process calculus. |
| **rr** | 2010s | Native code | Record-and-replay reverse debugger. |
| **GDB reverse debugging** | 2000s | Native code | `reverse-continue`, `reverse-step`, etc. |

#### rcc and Rever-C

The Reverse C Compiler (Perumalla & Fujimoto, 1999) transforms a C program into
two versions: a forward version with `SAVE` statements that record overwritten
values, and a reverse version with `RESTORE` statements that undo each
assignment. This is the classic "reversibilization by logging" approach. Rever-C
is a later source-to-source C reversal compiler from the same line of work.

#### Reversible Erlang

Lanese, Schultz, and Ulidowski and colleagues have given reversible operational
semantics to Erlang and built causal-consistent debuggers on top. This is
reversibility for debugging and fault tolerance rather than for energy.

#### RCCS and CCSK

Reversible CCS (Danos & Krivine, 2004) equips each process with a memory so that
communications can be undone. CCSK (Phillips & Ulidowski) uses keys instead.
These are process calculi, not programming languages, but they are the
theoretical basis for most reversible concurrent languages.

---

### 3.9 Quantum languages (adjacent)

Quantum computing is inherently reversible at the unitary level, so quantum
languages are often mentioned alongside reversible languages. They are a
different category: measurement and initialization are irreversible, and the
type systems are usually linear but not "clean reversible" in the classical
sense.

| Language | Year | One-liner |
|---|---:|---|
| **QCL** | 2000 | Early quantum programming language with classical control. |
| **Quipper** | 2013 | Quantum language embedded in Haskell; circuit generation. |
| **Q#** | 2017 | Microsoft's quantum DSL with classical control and functors. |
| **Silq** | 2020 | High-level quantum language with automatic uncomputation and linear types. |
| **Proto-Quipper** | 2017+ | Dependently typed core for quantum circuit description. |

If your interest is *classical* reversible computation, these are useful
neighbours but not the core of the list. Silq is the most relevant to
reversibility because its type system automatically inserts uncomputation.

---

### 3.10 Community and experimental implementations

These are smaller, non-peer-reviewed projects. They are included because they
show what reversible programming looks like outside the research lab, and
because they are easy to try.

| Language / library | Year | One-liner |
|---|---:|---|
| **Rever** | 2023– | Experimental reversible language in Rust, inspired by Janus, Pascal, and Python. |
| **RevPy** | 2026 | Reversible programming library embedded in Python, with `if/fi` and `while/elihw`. |

#### Rever

An open-source experimental language implemented in Rust. Its syntax borrows
from Janus, Pascal, and Python; it supports reversible arithmetic, procedures,
and printing, and deliberately makes the programmer handle garbage. It is a
useful small implementation to read if you want to see how a Janus-style
interpreter is built.

#### RevPy

A Python library that lets you write reversible functions using ordinary Python
syntax. It provides reversible `if`/`fi` and `while`/`elihw` constructs and
statically checks variable lifetimes. It is a library, not a standalone
language, but it is one of the lowest-friction ways to experiment with the
reversible style in a mainstream language.

---

## 4. Timeline

```
1982  Janus (Lutz & Derby)
1992  Psi-Lisp (Baker)
1997  R (Frank, MIT)
1999  PISA / Pendulum (MIT); rcc Reverse C Compiler
2003  SRL (Matos)
2004  Inv (Mu, Hu, Takeichi); RCCS (Danos & Krivine)
2011  RFun (Yokoyama, Axelsen, Glück)
2012  Theseus (James & Sabry)
2014  RCFUN (Mogensen)
2015  R-CORE, R-WHILE, RFCL (Glück, Yokoyama, Axelsen)
2015  Ricercar (Thomsen, Kaarsgaard, Soeken)
2016  Eel (Tyagi, Lynch, Demaine); RSSA (Mogensen); Revs (Amy et al.)
2017  ROOPL (Haulund); ReVerC (Amy, Roetteler, Svore)
2018  CoreFun (Jacobsen, Kaarsgaard, Thomsen); ROOPL++ (Cservenka)
2019  Yarel (Grandi, Moshiri, Roversi)
2020  Sparcl (Matsuda & Wang); NiLang (Liu & Zhao); Hermes (Mogensen)
2021  Agni (Mogensen)
2022  Jeopardy (Kristensen, Kaarsgaard, Thomsen)
2023  CRIL (Oguchi & Yuen)
2024  HSSA (Gail & Meyer); Chardonnet–Lemonnier–Valiron language
2026  PisoLang (Onodera et al.); L4 (Mogensen)
```

---

## 5. How the pieces fit together

A typical reversible software stack looks like this:

```
high-level reversible language
        │
        ├── Janus, R, ROOPL++, Hermes, Eel, ...
        │
        ▼
reversible intermediate language
        │
        ├── RSSA, HSSA, RIL, CRIL, L4
        │
        ▼
reversible instruction set / circuit
        │
        ├── PISA / Pendulum, BobISA
        └── Revs → ReVerC → Q# / .qc
```

Functional languages (RFun, Theseus, CoreFun, Sparcl, Jeopardy, PisoLang) tend
to stay at the source level and use program inversion rather than a low-level
ISA. Imperative and object-oriented languages (Janus, R, ROOPL, ROOPL++) have
the most complete compilation chains.

The two research communities overlap but are distinct:

- **Reversible computing** (Glück, Yokoyama, Axelsen, Thomsen, Kaarsgaard,
  Mogensen, ...) focuses on clean, garbage-free, r-Turing complete languages and
  their semantics.
- **Bidirectional programming / lenses** (Matsuda, Wang, ...) focuses on
  invertible transformations and practical data synchronization. Sparcl is the
  bridge between the two.

---

## 6. Where to start

**If you want to write reversible programs today:**

1. **Janus** — use the DIKU PIRC online interpreter. It is small enough to learn
   in an afternoon and teaches the core discipline (reversible updates,
   assertions, `uncall`).
2. **NiLang** — if you want a practical, actively used reversible language, try
   the Julia package. It is the easiest way to see reversibility pay off in
   automatic differentiation.
3. **Sparcl** — if you want partial invertibility and a more ordinary functional
   style, the interpreter and Agda formalization are available.
4. **Jeopardy** — if you want to see how far one can get without local
   invertibility.

**If you want to study the theory:**

1. Glück & Yokoyama, *Reversible computing from a programming language
   perspective* (TCS 2023) — the best modern survey.
2. Yokoyama & Glück, *A reversible programming language and its invertible
   self-interpreter* (PEPM 2007) — the Janus landmark.
3. James & Sabry, *Theseus: A high level language for reversible computing*
   (RC 2014).
4. Kaarsgaard, *The Logic of Reversible Computing* (PhD thesis, 2017) — the
   categorical view.
5. The Reversible Computation (RC) conference proceedings — the annual venue
   where most new languages appear.

**If you want to build hardware:**

1. Start with PISA / Pendulum for the ISA level.
2. Read the ReVerC paper for verified compilation to circuits.
3. Look at RevKit for synthesis and optimization.

---

## 7. Open problems

- **Usability.** Reversible languages still force programmers to think about
  assertions, ancillae, and uncomputation. PisoLang, Jeopardy, and Sparcl are
  recent attempts to close this gap.
- **Data structures.** Dynamic memory, garbage collection, and mutable data
  structures are hard to make cleanly reversible. ROOPL++ and RCFUN are
  milestones, but practical libraries are still missing.
- **Concurrency.** CRIL, reversible Erlang, RCCS, and CCSK are early steps;
  causal-consistent reversible concurrency remains an active area.
- **Compilation.** RSSA, HSSA, and L4 are recent, but there is no mature
  optimizing compiler from a high-level reversible language to a reversible ISA.
- **Semantics.** Many languages still lack mechanized proofs of reversibility;
  categorical semantics (join inverse categories) is promising but not yet
  standard.
- **Applications.** NiLang shows that reversible AD is practical. Other
  candidates include reversible debugging, cryptography (Hermes), low-power
  computing, and quantum circuit generation.

---

## 8. Sources

### Surveys and overviews

- R. Glück and T. Yokoyama, *Reversible computing from a programming language
  perspective*, Theoretical Computer Science 953 (2023), 113429.
  <https://doi.org/10.1016/j.tcs.2022.06.010>
- Wikipedia, *Reversible programming language*.
  <https://en.wikipedia.org/wiki/Reversible_programming_language>
- The Reversibility Institute, *Open Source* list.
  <https://reversibility.org/programming/open-source>
- V. Choudhury, *Reversible Programming Languages* (2018).
  <https://vikraman.org/files/reversible-languages.pdf>

### Primary sources by language

- **Janus**: C. Lutz, *Janus: a time-reversible language* (1986); T. Yokoyama and
  R. Glück, *A reversible programming language and its invertible
  self-interpreter*, PEPM 2007.
- **R (MIT)**: M. P. Frank, *Reversibility for Efficient Computing*, PhD thesis,
  MIT, 1999.
- **Psi-Lisp**: H. G. Baker, *NREVERSAL of Fortune — The Thermodynamics of
  Garbage Collection*, IWMM 1992.
- **Inv**: S. Mu, Z. Hu, and M. Takeichi, *An Injective Language for Reversible
  Computation*, MPC 2004.
- **RFun**: T. Yokoyama, H. B. Axelsen, and R. Glück, *Towards a reversible
  functional language*, RC 2011; *Fundamentals of reversible flowchart
  languages*, TCS 2015.
- **Theseus**: R. P. James and A. Sabry, *Theseus: A high level language for
  reversible computing*, RC 2014.
- **CoreFun**: P. A. H. Jacobsen, R. Kaarsgaard, and M. K. Thomsen, *CoreFun: A
  typed functional reversible core language*, RC 2018.
- **Sparcl**: K. Matsuda and M. Wang, *Sparcl: A language for partially
  invertible computation*, ICFP 2020; JFP 34 (2024), e2.
- **Jeopardy**: J. T. Kristensen, R. Kaarsgaard, and M. K. Thomsen, *Jeopardy: An
  invertible functional programming language*, RC 2024.
- **PisoLang**: K. Onodera, K. Nakano, K. Asada, and K. Kikuchi, *PisoLang: a
  user-friendly reversible programming language with inductive types*, RC 2026.
- **ROOPL**: T. Haulund, *Design and Implementation of a Reversible
  Object-Oriented Programming Language*, MSc thesis, DIKU, 2017.
- **ROOPL++**: M. H. Cservenka, *Design and Implementation of Dynamic Memory
  Management in a Reversible Object-Oriented Programming Language*, MSc thesis,
  DIKU, 2018.
- **Eel**: N. Tyagi, J. Lynch, and E. D. Demaine, *Toward an Energy Efficient
  Language and Compiler for (Partially) Reversible Algorithms*, RC 2016.
- **Hermes**: T. Æ. Mogensen, *Hermes: A reversible language for lightweight
  encryption*, Science of Computer Programming 215 (2022), 102746.
- **NiLang**: J.-G. Liu and T. Zhao, *Differentiate Everything with a Reversible
  Programming Language*, arXiv:2003.04617 (2020).
- **Agni**: T. Æ. Mogensen, *Reversible Functional Array Programming*, RC 2021.
- **Yarel**: C. Grandi, D. Moshiri, and L. Roversi, *Introducing Yet Another
  REversible Language*, arXiv:1902.05369 (2019).
- **R-CORE / R-WHILE**: R. Glück and T. Yokoyama, *A linear-time self-interpreter
  of a reversible imperative language*, JSSST 2016; *Reversible Programs Have
  Reversible Semantics*, LMCS 2018.
- **RFCL**: T. Yokoyama, H. B. Axelsen, and R. Glück, *Fundamentals of reversible
  flowchart languages*, TCS 2015.
- **SRL**: A. B. Matos, *Linear programs in a simple reversible language*, TCS
  290 (2003).
- **S-CORE**: M. Palazzo and L. Roversi, *Reversible Computation with Stacks and
  "Reversible Management of Failures"*, EPTCS 441 (2026).
- **PISA**: C. Vieri, *Reversible Computer Engineering and Architecture*, PhD
  thesis, MIT, 1999.
- **RSSA**: T. Æ. Mogensen, *RSSA: a reversible SSA form*, PSI 2015.
- **HSSA**: L. Gail and U. Meyer, *Connecting Reversible and Classical Computing
  through Hybrid SSA*, RC 2024.
- **L4**: T. Æ. Mogensen, *The Reversible Intermediate Language L4, its Type
  System, and its Bidirectional Small-Step Semantics*, arXiv:2610.31201 (2026).
- **CRIL**: S. Oguchi and S. Yuen, *CRIL: A Concurrent Reversible Intermediate
  Language*, EXPRESS/SOS 2023.
- **Revs / ReVerC**: M. Amy, M. Roetteler, and K. M. Svore, *Verified compilation
  of space-efficient reversible circuits*, CAV 2017.
- **Ricercar**: M. K. Thomsen, R. Kaarsgaard, and M. Soeken, *Ricercar: A
  Language for Describing and Rewriting Reversible Circuits with Ancillae*, RC
  2015.
- **rcc**: K. S. Perumalla and R. M. Fujimoto, *Efficient Optimistic Parallel
  Simulations Using Reverse Computation*, PADS 1999.
- **Reversible Erlang**: I. Lanese, U. P. Schultz, and I. Ulidowski, *Reversible
  Computing in Debugging of Erlang Programs*, IT Professional 2022.
- **RCCS**: V. Danos and J. Krivine, *Reversible Communicating Systems*, CONCUR
  2004.

### Implementations and tools

- Janus online interpreter: <https://topps.diku.dk/pirc/?id=janus>
- RFun online interpreter: <https://topps.diku.dk/pirc/?id=rfun>
- CoreFun: <https://github.com/diku-dk/coreFun>
- Hermes: <https://github.com/maltevelin/Hermes>
- NiLang: <https://github.com/GiggleLiu/NiLang.jl>
- Sparcl: <https://github.com/kztk-m/sparcl>
- Jeopardy: <https://github.com/jtkristensen/Jeopardy>
- ReVerC: <https://github.com/msr-quarc/ReVerC>
- RevKit: <https://github.com/msoeken/revkit>
- rr: <https://rr-project.org/>
- GDB reverse debugging:
  <https://sourceware.org/gdb/current/onlinedocs/gdb.html/Reverse-Execution.html>

---

*Compiled November 2026. Corrections and additions are welcome — this is a
fast-moving research area, and the list is intentionally broader than any single
survey.*
