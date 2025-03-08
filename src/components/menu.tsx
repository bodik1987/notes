import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { v4 as uuidv4 } from "uuid";
import { Input } from "@/components/ui/input";

import { useNavigate, useLocation, useParams } from "react-router";
import { Button } from "./ui/button";
import { useState } from "react";
import useLocalStorage from "@/lib/useLocalStorage";
import { FolderProps, foldersSeed } from "@/lib/types";

export function MenubarPanel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [folderTitle, setFolderTitle] = useState("");
  const [folders, setFolders] = useLocalStorage<FolderProps[]>(
    "folders",
    foldersSeed
  );

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
        <div className="wrapper flex">
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
              <MenubarTrigger>Folder</MenubarTrigger>
              <MenubarContent>
                <MenubarItem onSelect={() => setOpen(true)}>
                  New folder
                </MenubarItem>
                <MenubarItem>New note</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          )}
        </div>
      </Menubar>
    </>
  );
}
