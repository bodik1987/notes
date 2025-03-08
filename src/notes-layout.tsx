import { useParams } from "react-router";
import useLocalStorage from "./lib/useLocalStorage";
import { FolderProps, foldersSeed, NotesProps } from "./lib/types";
import Editor from "./components/editor/editor";

export default function NotesLayout() {
  const { id } = useParams();

  const [folders, setFolders] = useLocalStorage<FolderProps[]>(
    "folders",
    foldersSeed
  );

  const [notes, setNotes] = useLocalStorage<NotesProps[]>("notes", [
    { id: "1", folderId: "1", title: "Correct" },
    { id: "2", folderId: "2", title: "Poland" },
    { id: "3", folderId: "3", title: "Egypt note" },
  ]);

  const note = notes.find((note) => note.id === id);

  return (
    <section>
      <div className="wrapper py-3">
        <div className="px-3">
          {/* <h1 className="mb-4">{note ? note.title : "Note not found"}</h1> */}

          <Editor note={note ? note.title : "Note not found"} />
        </div>
      </div>
    </section>
  );
}
