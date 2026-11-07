import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

/** Editor chrome: transparent so it sits inside our cream code card. */
export const codeTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "transparent",
      color: "#27242f",
      fontSize: "13.5px",
    },
    ".cm-content": {
      fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
      padding: "0",
      caretColor: "#7a63a8",
    },
    ".cm-line": { padding: "0 4px" },
    ".cm-scroller": { overflow: "auto", lineHeight: "1.65" },
    ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
      backgroundColor: "#eae4f7",
    },
    ".cm-gutters": {
      backgroundColor: "transparent",
      color: "#a49db3",
      border: "none",
      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
    },
  },
  { dark: false }
);

/** Pastel highlight style matching the site palette. */
export const codeHighlight = HighlightStyle.define([
  { tag: tags.keyword, color: "#63509b", fontWeight: "600" },
  { tag: tags.atom, color: "#3d6180", fontWeight: "600" },
  { tag: tags.bool, color: "#3d6180", fontWeight: "600" },
  { tag: tags.string, color: "#436b51" },
  { tag: tags.comment, color: "#8a8494", fontStyle: "italic" },
  { tag: tags.number, color: "#96552f" },
  { tag: tags.operator, color: "#7a63a8" },
  { tag: tags.punctuation, color: "#8a8494" },
  { tag: tags.variableName, color: "#27242f" },
  { tag: tags.definition(tags.variableName), color: "#4a7396" },
  { tag: tags.function(tags.variableName), color: "#4a7396" },
  { tag: tags.typeName, color: "#7f487f" },
  { tag: tags.propertyName, color: "#3f7a72" },
]);

export const codeHighlighting = syntaxHighlighting(codeHighlight);
