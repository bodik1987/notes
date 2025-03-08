import useLocalStorage from "@/lib/useLocalStorage";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

export default function LoadState() {
  const [note] = useLocalStorage(
    "note",
    `{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":null,"format":"","indent":0,"type":"root","version":1}}`
  );
  const [editor] = useLexicalComposerContext();
  //
  useEffect(() => {
    const newState = editor.parseEditorState(note);
    editor.setEditorState(newState);
    editor.setEditable(true);
  }, []);

  return <></>;
}
