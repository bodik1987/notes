import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode } from "@lexical/rich-text";
import LoadState from "./loadState";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import Toolbars from "./toolbars";
import { useParams } from "react-router";
import useLocalStorage from "@/lib/useLocalStorage";
import { NotesProps } from "@/lib/types";
import { Input } from "../ui/input";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

function onError(error: any) {
  console.error(error);
}

export default function Editor() {
  const initialConfig = {
    namespace: "MyEditor",
    theme: exampleTheme,
    onError,
    nodes: [HeadingNode],
    editable: false,
  };

  const { id } = useParams();
  const [notes, setNotes] = useLocalStorage<NotesProps[]>("notes", []);
  const note = notes.find((note) => note.id === id);

  const [noteTitle, setNoteTitle] = useState(note ? note.title : "");

  const handleSave = useDebouncedCallback(() => {
    if (note) {
      const updatedNote = { ...note, title: noteTitle };
      setNotes((prevNotes) => {
        return prevNotes.map((n) =>
          n.id === updatedNote.id ? updatedNote : n
        );
      });
    }
  }, 500);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <LoadState note={note} />
      <Toolbars note={note} />
      <Input
        value={noteTitle}
        onChange={(e) => {
          setNoteTitle(e.target.value);
          handleSave();
        }}
        className="p-0 shadow-none focus-visible:ring-0 mb-2 outline-0 border-none !text-2xl font-medium"
      />
      <RichTextPlugin
        contentEditable={
          <ContentEditable spellCheck={false} className="focus:outline-none" />
        }
        placeholder={<div>Заметка...</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <CheckListPlugin />
      <AutoFocusPlugin />
    </LexicalComposer>
  );
}

const exampleTheme = {
  ltr: "ltr",
  rtl: "rtl",
  paragraph: "",
  quote: "editor-quote",
  heading: {
    h1: "text-xl font-bold",
    h2: "editor-heading-h2",
    h3: "editor-heading-h3",
    h4: "editor-heading-h4",
    h5: "editor-heading-h5",
    h6: "editor-heading-h6",
  },
  list: {
    nested: {
      listitem: "editor-nested-listitem",
    },
    ol: "editor-list-ol",
    ul: "editor-list-ul",
    listitem: "editor-listItem",
    listitemChecked: "editor-listItemChecked",
    listitemUnchecked: "editor-listItemUnchecked",
  },
  hashtag: "editor-hashtag",
  image: "editor-image",
  link: "editor-link",
  text: {
    bold: "font-bold",
    code: "editor-textCode",
    italic: "italic",
    strikethrough: "editor-textStrikethrough",
    subscript: "editor-textSubscript",
    superscript: "editor-textSuperscript",
    underline: "editor-textUnderline",
    underlineStrikethrough: "editor-textUnderlineStrikethrough",
  },
  code: "editor-code",
  codeHighlight: {
    atrule: "editor-tokenAttr",
    attr: "editor-tokenAttr",
    boolean: "editor-tokenProperty",
    builtin: "editor-tokenSelector",
    cdata: "editor-tokenComment",
    char: "editor-tokenSelector",
    class: "editor-tokenFunction",
    "class-name": "editor-tokenFunction",
    comment: "editor-tokenComment",
    constant: "editor-tokenProperty",
    deleted: "editor-tokenProperty",
    doctype: "editor-tokenComment",
    entity: "editor-tokenOperator",
    function: "editor-tokenFunction",
    important: "editor-tokenVariable",
    inserted: "editor-tokenSelector",
    keyword: "editor-tokenAttr",
    namespace: "editor-tokenVariable",
    number: "editor-tokenProperty",
    operator: "editor-tokenOperator",
    prolog: "editor-tokenComment",
    property: "editor-tokenProperty",
    punctuation: "editor-tokenPunctuation",
    regex: "editor-tokenVariable",
    selector: "editor-tokenSelector",
    string: "editor-tokenSelector",
    symbol: "editor-tokenProperty",
    tag: "editor-tokenProperty",
    url: "editor-tokenOperator",
    variable: "editor-tokenVariable",
  },
};
