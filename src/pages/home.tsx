import { FolderProps, foldersSeed } from "@/lib/types";
import useLocalStorage from "@/lib/useLocalStorage";
import { Link } from "react-router";

export default function Home() {
  const [folers, setFolders] = useLocalStorage<FolderProps[]>(
    "folders",
    foldersSeed
  );

  return (
    <section className="wrapper py-3">
      <div className="px-3">
        <h1 className="mb-4">Folders</h1>

        {folers
          .filter((folder) => !folder.folderId)
          .map((folder) => (
            <Link
              key={folder.id}
              to={`/folders/${folder.id}`}
              className="flex text-lg mt-2"
            >
              {folder.title}
            </Link>
          ))}
      </div>
    </section>
  );
}
