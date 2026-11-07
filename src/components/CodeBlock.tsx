import { useEffect, useRef } from "react";
import { EditorView, keymap, highlightActiveLineGutter } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { bracketMatching, foldGutter, indentOnInput } from "@codemirror/language";
import { getLanguageSupport } from "@/lib/cm-languages";
import { codeTheme, codeHighlighting } from "@/lib/cm-theme";

interface Props {
  code: string;
  lang: string;
}

/**
 * Read-only CodeMirror 6 viewer for a code example.
 * Renders a plain <pre> fallback on the server; upgrades to a CM6
 * EditorView on mount. Set `editable` later for in-browser editing
 * (e.g. when we run interpreters via WASM).
 */
export default function CodeBlock({ code, lang }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const fallbackRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const langSupport = getLanguageSupport(lang);
    const state = EditorState.create({
      doc: code,
      extensions: [
        history(),
        indentOnInput(),
        bracketMatching(),
        foldGutter({ openText: "▾", closedText: "▸" }),
        highlightActiveLineGutter(),
        langSupport ?? [],
        codeHighlighting,
        codeTheme,
        EditorView.lineWrapping,
        keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
        // read-only viewer for now:
        EditorState.readOnly.of(true),
        EditorView.editable.of(false),
      ],
    });
    const view = new EditorView({ state, parent: ref.current });
    fallbackRef.current?.remove();
    return () => view.destroy();
  }, [code, lang]);

  return (
    <div ref={ref} className="cm-codeblock">
      <pre ref={fallbackRef} className="p-4 font-mono text-sm leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
