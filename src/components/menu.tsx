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
import { FilePlus, FolderPlus, HomeIcon } from "lucide-react";
import { useAppStore } from "@/lib/store";

export function MenubarPanel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [folderTitle, setFolderTitle] = useState("");
  const { addFolder, addNote } = useAppStore();

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New folder</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <Input
            value={folderTitle}
            onChange={(e) => setFolderTitle(e.target.value)}
          />
          <DialogFooter>
            <Button
              onClick={() => {
                if (pathname === "/") {
                  addFolder(folderTitle);
                }
                if (pathname.includes("/folders/")) {
                  addFolder(folderTitle, id);
                }
                setOpen(false);
                setFolderTitle(""); // Очистка поля ввода
              }}
            >
              New folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div
        className={`${
          pathname.includes("/notes/") && "hidden"
        } wrapper flex items-center gap-2 px-3 h-12`}
      >
        <Button variant={"outline"} onClick={() => navigate("/")}>
          <HomeIcon />
        </Button>

        {pathname === "/" && (
          <Button variant={"outline"} onClick={() => setOpen(true)}>
            <FolderPlus />
          </Button>
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
      </div>
    </>
  );
}
