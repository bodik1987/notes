import { useAppStore } from "@/lib/store";
import { Folder } from "lucide-react";
import { Link } from "react-router";

export default function Home() {
  const folders = useAppStore((state) => state.folders);

  return (
    <section className="wrapper px-3">
      {folders
        .filter((folder) => !folder.folderId)
        .map((folder) => (
          <Link key={folder.id} to={`/folders/${folder.id}`} className="folder">
            <Folder size={22} fill="#FFD766" stroke="#E09F00" />
            {folder.title}
          </Link>
        ))}
    </section>
  );
}
