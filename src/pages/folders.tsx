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
    <section>
      <div className="wrapper py-3 px-3">
        <div className="">
          <h1 className="mb-4">{folder ? folder.title : "Folder not found"}</h1>
        </div>

        <div className="">
          {subFolders.map((subFolder) => (
            <Link
              key={subFolder.id}
              to={`/folders/${subFolder.id}`}
              className="folder"
            >
              <Folder /> {subFolder.title}
            </Link>
          ))}
        </div>

        <div className="mt-5">
          {folderNotes.map((note) => (
            <Link key={note.id} to={`/notes/${note.id}`} className="note">
              <File size={18} /> {note.title}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
