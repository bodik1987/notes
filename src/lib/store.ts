import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

export interface IUser {
  name: string;
  password: string;
}

export interface IFolder {
  id: string;
  title: string;
  folderId?: string;
}

export interface INote {
  id: string;
  folderId: string;
  title: string;
  body: string;
}

interface AppState {
  folders: IFolder[];
  notes: INote[];
  addFolder: (id: string, title: string, folderId?: string) => void;
  addNote: (id: string, folderId: string, title: string, body: string) => void;
  updateNote: (id: string, updatedFields: Partial<INote>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      folders: [],
      notes: [],
      addFolder: (id, title, folderId) => {
        set((state) => ({
          folders: [...state.folders, { id, title, folderId }],
        }));
      },
      addNote: (id, folderId, title, body) => {
        set((state) => ({
          notes: [...state.notes, { id, folderId, title, body }],
        }));
      },
      updateNote: (id, updatedFields) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, ...updatedFields } : note
          ),
        }));
      },
    }),
    {
      name: "app-storage", // Ключ для localStorage
    }
  )
);
