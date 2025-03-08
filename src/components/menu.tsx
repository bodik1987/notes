import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
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
import useLocalStorage from "@/lib/useLocalStorage";
import { FolderProps, NotesProps } from "@/lib/types";
import { ArrowLeft } from "lucide-react";

export function MenubarPanel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [folderTitle, setFolderTitle] = useState("");
  const [folders, setFolders] = useLocalStorage<FolderProps[]>("folders", []);
  const [notes, setNotes] = useLocalStorage<NotesProps[]>("notes", []);

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
                  setFolders([
                    ...folders,
                    { id: uuidv4(), title: folderTitle },
                  ]);
                }
                if (pathname.includes("/folders/")) {
                  setFolders([
                    ...folders,
                    { id: uuidv4(), title: folderTitle, folderId: id },
                  ]);
                }
                setOpen(false);
              }}
            >
              New folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Menubar>
        <div className="wrapper flex items-center">
          <MenubarMenu>
            <MenubarTrigger>Nav</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onSelect={() => navigate("/")}>Home</MenubarItem>
              {/* <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>Share</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>Email link</MenubarItem>
                <MenubarItem>Messages</MenubarItem>
                <MenubarItem>Notes</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarItem>
              Print... <MenubarShortcut>⌘P</MenubarShortcut>
            </MenubarItem> */}
            </MenubarContent>
          </MenubarMenu>
          {pathname === "/" && (
            <MenubarMenu>
              <MenubarTrigger>Folder</MenubarTrigger>
              <MenubarContent>
                <MenubarItem onSelect={() => setOpen(true)}>
                  New folder
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          )}

          {pathname.includes("/folders/") && (
            <MenubarMenu>
              <MenubarTrigger>Add</MenubarTrigger>
              <MenubarContent>
                <MenubarItem onSelect={() => setOpen(true)}>
                  New folder
                </MenubarItem>
                <MenubarItem
                  onSelect={() => {
                    if (id) {
                      const newNoteId = uuidv4();
                      const newNote: NotesProps = {
                        id: newNoteId,
                        folderId: id,
                        title: "Untitled",
                        body: `{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":null,"format":"","indent":0,"type":"root","version":1}}`,
                      };
                      setNotes([...notes, newNote]);
                      navigate(`/notes/${newNoteId}`);
                    }
                  }}
                >
                  New note
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          )}

          {pathname !== "/" && (
            <Button onClick={goBack} className="h-7 ml-auto">
              <ArrowLeft />
            </Button>
          )}
        </div>
      </Menubar>
    </>
  );
}
