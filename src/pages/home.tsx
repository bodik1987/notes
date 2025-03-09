import { useAppStore } from "@/lib/store";
import { Folder } from "lucide-react";
import { Link } from "react-router";

export default function Home() {
  const folders = useAppStore((state) => state.folders);

  return (
    <section className="wrapper py-3">
      <div className="px-3">
        {folders
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
