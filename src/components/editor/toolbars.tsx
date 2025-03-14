import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createHeadingNode,
  $isHeadingNode,
  $createQuoteNode,
  $isQuoteNode,
} from "@lexical/rich-text";
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
  Heading1Icon,
  Heading2Icon,
  RedoIcon,
  UndoIcon,
  TextQuoteIcon,
  HomeIcon,
  ArrowLeft,
  BoldIcon,
} from "lucide-react";
import { INote, useAppStore } from "@/lib/store";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";

export default function Toolbars({ note }: { note: INote | undefined }) {
  const { updateNote } = useAppStore();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const handleSave = useDebouncedCallback((content: string) => {
    if (note) {
      updateNote(note.id, { body: content });
      console.log(content);
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

  const toggleQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        const element = anchorNode.getTopLevelElementOrThrow();
        if ($isQuoteNode(element)) {
          $setBlocksType(selection, () => $createParagraphNode());
        } else {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      }
    });
  };

  const toggleRedTextColor = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
  };

  return (
    <div className="sticky top-0 right-4 pb-1.5 mt-1.5 bg-white">
      <div className="flex justify-between items-center">
        <Button variant={"outline"} onClick={() => navigate("/")}>
          <HomeIcon />
        </Button>

        <div className="flex justify-between items-center gap-4">
          <button
            disabled={!canUndo}
            onClick={() => {
              editor.dispatchCommand(UNDO_COMMAND, undefined);
            }}
            className="toolbar-item spaced disabled:opacity-20 ml-auto"
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

          <Button variant={"secondary"} onClick={goBack} className="ml-4">
            <ArrowLeft />
          </Button>
        </div>
      </div>

      <div className="mt-3 flex gap-4 items-center justify-end">
        <button
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
          aria-label="Bold"
        >
          <BoldIcon size={18} />
        </button>

        <button onClick={() => handleHeading("h1")}>
          <Heading1Icon size={20} />
        </button>
        <button onClick={() => handleHeading("h2")}>
          <Heading2Icon size={18} />
        </button>

        <button onClick={toggleQuote} aria-label="Toggle Quote">
          <TextQuoteIcon size={18} />
        </button>

        <button
          onClick={toggleRedTextColor}
          className="text-[#9A56CA] bg-[#F6E4FF] px-1.5 rounded-md"
        >
          Aa
        </button>

        <button
          onClick={() =>
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "highlight")
          }
          className="h-5 w-5 bg-[#FFFF00] border border-yellow-400 rounded-full"
        ></button>
      </div>
    </div>
  );
}
