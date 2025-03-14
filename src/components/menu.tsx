import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { v4 as uuidv4 } from "uuid";
import { Input } from "@/components/ui/input";
import { useNavigate, useLocation, useParams } from "react-router";
import { Button } from "./ui/button";
import { useState } from "react";
import {
  ArrowLeft,
  FilePlus,
  FolderPlus,
  FolderSyncIcon,
  FolderTreeIcon,
  HomeIcon,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import Sync from "./sync/sync";
import Tree, { buildTree } from "./ui/tree";

export function MenubarPanel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [sync, setSync] = useState(false);
  const [tree, setTree] = useState(false);
  const [folderTitle, setFolderTitle] = useState("");
  const { folders, notes, addFolder, addNote } = useAppStore();

  const treeData = buildTree(folders, notes);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add folder</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <Input
            value={folderTitle}
            onChange={(e) => setFolderTitle(e.target.value)}
          />
          <DialogFooter>
            <Button
              disabled={folderTitle.trim().length === 0}
              onClick={() => {
                if (pathname === "/") {
                  addFolder(uuidv4(), folderTitle);
                }
                if (pathname.includes("/folders/")) {
                  addFolder(uuidv4(), folderTitle, id);
                }
                setOpen(false);
                setFolderTitle(""); // Очистка поля ввода
              }}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={sync} onOpenChange={setSync}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sync</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <Sync />
        </DialogContent>
      </Dialog>

      <Dialog open={tree} onOpenChange={setTree}>
        <DialogContent>
          <div className="hidden">
            <DialogHeader>
              <DialogTitle></DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
          </div>
          <Tree data={treeData} />
        </DialogContent>
      </Dialog>

      <div
        className={`${
          pathname.includes("/notes/") && "hidden"
        } wrapper flex items-center gap-2 px-3 h-12`}
      >
        <Button
          variant={"outline"}
          disabled={pathname === "/"}
          className="disabled:opacity-100 disabled:border-transparent disabled:shadow-none"
          onClick={() => navigate("/")}
        >
          <HomeIcon />
        </Button>
        <Button variant={"secondary"} onClick={() => setTree(true)}>
          <FolderTreeIcon />
        </Button>

        {pathname === "/" && (
          <>
            <Button variant={"outline"} onClick={() => setOpen(true)}>
              <FolderPlus />
            </Button>
            <Button variant={"outline"} onClick={() => setSync(true)}>
              <FolderSyncIcon />
            </Button>
          </>
        )}

        {pathname.includes("/folders/") && (
          <>
            <Button variant={"outline"} onClick={() => setOpen(true)}>
              <FolderPlus />
            </Button>
            <Button
              variant={"outline"}
              onClick={() => {
                if (id) {
                  const newId = uuidv4();
                  addNote(
                    newId,
                    id,
                    "Untitled",
                    `{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":null,"format":"","indent":0,"type":"root","version":1}}`
                  );
                  navigate(`/notes/${newId}`);
                }
              }}
            >
              <FilePlus />
            </Button>
          </>
        )}
        {pathname !== "/" && (
          <Button variant={"secondary"} onClick={goBack} className="ml-auto">
            <ArrowLeft />
          </Button>
        )}
      </div>
    </>
  );
}
