import { Link, useParams } from "react-router";
import useLocalStorage from "./lib/useLocalStorage";
import { FolderProps, foldersSeed, NotesProps } from "./lib/types";

export default function FoldersLayout() {
  const { id } = useParams();

  const [folders, setFolders] = useLocalStorage<FolderProps[]>(
    "folders",
    foldersSeed
  );

  const [notes, setNotes] = useLocalStorage<NotesProps[]>("notes", [
    { id: "1", folderId: "1", title: "Correct note" },
    { id: "2", folderId: "2", title: "Poland note" },
    { id: "3", folderId: "3", title: "Egypt note" },
  ]);

  const folder = folders.find((folder) => folder.id === id);
  const subFolders = folders.filter((folder) => folder.folderId === id);
  const folderNotes = notes.filter((note) => note.folderId === id);

  return (
    <section>
      <div className="wrapper py-3">
        <div className="px-3">
          <h1 className="mb-4">{folder ? folder.title : "Folder not found"}</h1>
        </div>

        <div className="px-3">
          {subFolders.map((subFolder) => (
            <Link key={subFolder.id} to={`/folders/${subFolder.id}`}>
              {subFolder.title}
            </Link>
          ))}
        </div>

        <div className="px-3">
          {folderNotes.map((notes) => (
            <Link key={notes.id} to={`/notes/${notes.id}`}>
              {notes.title}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
