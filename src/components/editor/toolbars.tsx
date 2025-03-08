import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode, $isHeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { mergeRegister } from "@lexical/utils";
import { useDebouncedCallback } from "use-debounce";
import { Heading1Icon, RedoIcon, UndoIcon } from "lucide-react";
import useLocalStorage from "@/lib/useLocalStorage";

export default function Toolbars() {
  const [_, setNote] = useLocalStorage(
    "note",
    `{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":null,"format":"","indent":0,"type":"root","version":1}}`
  );
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const handleSave = useDebouncedCallback((content: string) => {
    setNote(content);
  }, 500);

  useEffect(() => {
    mergeRegister(
      editor.registerUpdateListener(
        ({ editorState, dirtyElements, dirtyLeaves }) => {
          if (dirtyElements.size === 0 && dirtyLeaves.size === 0) {
            return;
          }
          handleSave(JSON.stringify(editorState));
        }
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        1
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        1
      )
    );
  }, [editor]);

  const handleHeading = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        const element = anchorNode.getTopLevelElementOrThrow();
        if ($isHeadingNode(element)) {
          $setBlocksType(selection, () => $createParagraphNode());
        } else {
          $setBlocksType(selection, () => $createHeadingNode("h1"));
        }
      }
    });
  };

  return (
    <div className="fixed bottom-4 right-4 flex gap-4 items-center bg-panel dark:bg-dark-panel backdrop-blur-md p-4 rounded-full">
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className="toolbar-item spaced disabled:opacity-50"
        aria-label="Undo"
      >
        <UndoIcon />
      </button>
      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className="toolbar-item spaced disabled:opacity-50"
        aria-label="Redo"
      >
        <RedoIcon />
      </button>
      <button onClick={handleHeading} className={`rounded-md`}>
        <Heading1Icon />
      </button>
    </div>
  );
}
