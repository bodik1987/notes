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
  FORMAT_TEXT_COMMAND,
} from "lexical";
import { useDebouncedCallback } from "use-debounce";
import {
  ALargeSmall,
  Heading1Icon,
  Heading2Icon,
  HighlighterIcon,
  ListOrdered,
  RedoIcon,
  UndoIcon,
} from "lucide-react";
import { INote, useAppStore } from "@/lib/store";

export default function Toolbars({ note }: { note: INote | undefined }) {
  const { updateNote } = useAppStore();
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const handleSave = useDebouncedCallback((content: string) => {
    if (note) {
      updateNote(note.id, { body: content });
    }
  }, 500);

  useEffect(() => {
    const unregisterUpdateListener = editor.registerUpdateListener(
      ({ editorState, dirtyElements, dirtyLeaves }) => {
        if (dirtyElements.size === 0 && dirtyLeaves.size === 0) {
          return;
        }
        handleSave(JSON.stringify(editorState));
      }
    );

    const unregisterCanUndo = editor.registerCommand(
      CAN_UNDO_COMMAND,
      (payload) => {
        setCanUndo(payload);
        return false;
      },
      1
    );

    const unregisterCanRedo = editor.registerCommand(
      CAN_REDO_COMMAND,
      (payload) => {
        setCanRedo(payload);
        return false;
      },
      1
    );

    return () => {
      unregisterUpdateListener();
      unregisterCanUndo();
      unregisterCanRedo();
    };
  }, [editor, handleSave]);

  const handleHeading = (level: "h1" | "h2" | "h3") => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        const element = anchorNode.getTopLevelElementOrThrow();
        if ($isHeadingNode(element) && element.getTag() === level) {
          $setBlocksType(selection, () => $createParagraphNode());
        } else {
          $setBlocksType(selection, () => $createHeadingNode(level));
        }
      }
    });
  };

  const toggleRedTextColor = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
  };

  return (
    <div className="sticky top-0 right-4 flex gap-4 items-center py-2 bg-white">
      <button onClick={() => handleHeading("h1")}>
        <Heading1Icon />
      </button>
      <button onClick={() => handleHeading("h2")}>
        <Heading2Icon size={21} />
      </button>

      <button onClick={toggleRedTextColor} aria-label="Toggle Red Text Color">
        <ALargeSmall stroke="red" />
      </button>

      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "highlight")}
        aria-label="Highlight"
      >
        <HighlighterIcon size={20} fill="yellow" />
      </button>

      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className="toolbar-item spaced disabled:opacity-20"
        aria-label="Undo"
      >
        <UndoIcon />
      </button>
      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className="toolbar-item spaced disabled:opacity-20"
        aria-label="Redo"
      >
        <RedoIcon />
      </button>
    </div>
  );
}
