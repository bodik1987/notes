import { INote } from "@/lib/types";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

export default function LoadState({ note }: { note: INote | undefined }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (note?.body) {
      const newState = editor.parseEditorState(note?.body);
      editor.setEditorState(newState);
      editor.setEditable(true);
    }
  }, []);

  return <></>;
}
