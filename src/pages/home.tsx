import { FolderProps } from "@/lib/types";
import useLocalStorage from "@/lib/useLocalStorage";
import { Folder } from "lucide-react";
import { Link } from "react-router";

export default function Home() {
  const [folers] = useLocalStorage<FolderProps[]>("folders", []);

  return (
    <section className="wrapper py-3">
      <div className="px-3">
        {folers
          .filter((folder) => !folder.folderId)
          .map((folder) => (
            <Link
              key={folder.id}
              to={`/folders/${folder.id}`}
              className="folder"
            >
              <Folder /> {folder.title}
            </Link>
          ))}
      </div>
    </section>
  );
}
