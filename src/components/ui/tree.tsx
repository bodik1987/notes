import { IFolder, INote } from "@/lib/store";
import { useState } from "react";
import { Link } from "react-router";
import { File, Folder, FolderOpen } from "lucide-react";

type TreeNodeType = {
  id: string;
  title: string;
  type: "folder" | "note";
  children?: TreeNodeType[];
};

interface TreeNodeProps {
  node: TreeNodeType;
}

function TreeNode({ node }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasChildren = node.children && node.children.length > 0;

  return (
    <div style={{ marginLeft: "20px" }}>
      {/* Родительская папка */}
      {node.type === "folder" && (
        <div
          style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <FolderOpen size={20} /> : <Folder size={20} />}
          <span className="ml-1">{node.title}</span>
        </div>
      )}

      {/* Ссылка для заметки */}
      {node.type === "note" && (
        <Link to={`/notes/${node.id}`} className="note ml-1">
          <File size={20} /> {node.title}
        </Link>
      )}

      {/* Вложенные элементы */}
      {isExpanded && hasChildren && (
        <div>
          {node.children?.map((child) => (
            <TreeNode key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}

interface TreeProps {
  data: TreeNodeType[];
}

export function buildTree(
  folders: IFolder[],
  notes: INote[],
  parentId: string | null = null
): TreeNodeType[] {
  return [
    ...folders
      .filter((folder) => (folder.folderId ?? null) === parentId)
      .map((folder) => ({
        id: folder.id,
        title: folder.title,
        type: "folder" as const,
        children: buildTree(folders, notes, folder.id),
      })),
    ...notes
      .filter((note) => note.folderId === parentId)
      .map((note) => ({
        id: note.id,
        title: note.title,
        type: "note" as const,
      })),
  ];
}

export default function Tree({ data }: TreeProps) {
  return (
    <>
      {data.map((node) => (
        <TreeNode key={node.id} node={node} />
      ))}
    </>
  );
}
