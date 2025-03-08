export type FolderProps = {
  id: string;
  title: string;
  folderId?: string;
};

export type NotesProps = {
  id: string;
  title: string;
  body?: string;
  folderId: string;
};

export const foldersSeed: FolderProps[] = [
  { id: "1", title: "Work" },
  { id: "2", title: "Travel" },
  { id: "3", title: "Egypt", folderId: "2" },
];
