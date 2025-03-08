import { useParams } from "react-router";
import useLocalStorage from "../lib/useLocalStorage";
import { NotesProps } from "../lib/types";
import Editor from "../components/editor/editor";
import { Input } from "../components/ui/input";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function Note() {
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
    <section>
      <div className="wrapper py-3">
        <div className="px-3">
          <Input
            value={noteTitle}
            onChange={(e) => {
              setNoteTitle(e.target.value);
              handleSave();
            }}
          />

          <Editor />
        </div>
      </div>
    </section>
  );
}
