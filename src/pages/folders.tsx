import { Link, useParams } from "react-router";
import { File, Folder } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function Folders() {
  const { id } = useParams();
  const { folders, notes } = useAppStore();

  const folder = folders.find((folder) => folder.id === id);
  const subFolders = folders.filter((folder) => folder.folderId === id);
  const folderNotes = notes.filter((note) => note.folderId === id);

  return (
    <section className="wrapper px-3">
      <div className="mt-5 flex items-center gap-2">
        <Folder size={22} fill="#FFD766" stroke="#E09F00" />
        <h1>{folder ? folder.title : "Folder not found"}</h1>
      </div>

      {subFolders.map((subFolder) => (
        <Link
          key={subFolder.id}
          to={`/folders/${subFolder.id}`}
          className="folder"
        >
          <Folder
            size={20}
            fill="#FFD766"
            stroke="#E09F00"
            className="ml-1 opacity-80"
          />{" "}
          {subFolder.title}
        </Link>
      ))}

      <div className="mt-4">
        {folderNotes.map((note) => (
          <Link key={note.id} to={`/notes/${note.id}`} className="note ml-1">
            <File size={20} /> {note.title}
          </Link>
        ))}
      </div>
    </section>
  );
}
