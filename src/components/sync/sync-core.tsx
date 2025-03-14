import { child, get, ref, remove, set } from "firebase/database";
import {
  DATABASE,
  RD_PROJECT_ITEMS,
  RD_PROJECT_USERS,
} from "../../../firebase";
import { IFolder, INote, IUser, useAppStore } from "@/lib/store";
import { Button } from "../ui/button";

type Props = {
  user: IUser;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccess: React.Dispatch<React.SetStateAction<string>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
};

export default function SyncCore({
  user,
  setLoading,
  setSuccess,
  setError,
}: Props) {
  // , addFolder, addNote
  const { folders, notes } = useAppStore();
  const deleteLocalUser = () => {
    localStorage.clear();
    window.location.reload();
  };

  // CREATE
  const uploadToDatabase = () => {
    setSuccess("");
    setError("");
    setLoading(true);
    try {
      if (user) {
        set(ref(DATABASE, RD_PROJECT_ITEMS + user.name), {
          folders,
          notes,
        }).then(() => {
          setLoading(false);
        });
        setSuccess("Выгружено");
      }
    } catch (error) {
      console.log(error);
      setError("Error. Try later");
    }
  };

  // DOWNLOAD
  const downloadFromDatabase = () => {
    if (confirm("Восстановить? Текущие данные будут удалены!") === true) {
      setSuccess("");
      setError("");
      setLoading(true);
      try {
        if (user) {
          const dbRef = ref(DATABASE);
          get(child(dbRef, `${RD_PROJECT_ITEMS}/${user.name}`))
            .then((snapshot) => {
              if (snapshot.exists()) {
                const result: {
                  folders: IFolder[];
                  notes: INote[];
                } = snapshot.val();

                // Clear existing local data
                useAppStore.setState({ folders: [], notes: [] });

                // Add folders to the local store
                if (result.folders) {
                  result.folders.forEach((folder) => {
                    useAppStore
                      .getState()
                      .addFolder(folder.title, folder.folderId);
                  });
                }

                // Add notes to the local store
                if (result.notes) {
                  result.notes.forEach((note) => {
                    useAppStore
                      .getState()
                      .addNote(note.id, note.folderId, note.title, note.body);
                  });
                }

                setSuccess("Загружено");
              } else {
                setError("No data available");
              }
              setLoading(false);
            })
            .catch((error) => {
              console.error(error);
              setError(error);
            });
        }
      } catch (error) {
        console.log(error);
        setError("Error. Try later");
      }
    }
  };

  const deleteUser = () => {
    setSuccess("");
    setError("");
    setLoading(true);
    if (user) {
      if (confirm(`Удалить?`) === true) {
        remove(ref(DATABASE, RD_PROJECT_ITEMS + user.name))
          .then(() => {
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error removing item:", error);
            setLoading(false);
            setError(error);
          });
        remove(ref(DATABASE, RD_PROJECT_USERS + user.name))
          .then(() => {
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error removing item:", error);
            setLoading(false);
            setError(error);
          });
        deleteLocalUser();
      } else {
        setLoading(false);
      }
    }
  };

  return (
    <div className="mt-4 w-full flex flex-col justify-center gap-2">
      <div className="flex gap-3">
        <Button
          variant={"destructive"}
          onClick={deleteUser}
          className="button disabled:bg-accent/50 text-white bg-red-500"
        >
          Удалить все
        </Button>

        <Button onClick={deleteLocalUser}>Выйти</Button>
      </div>

      <Button onClick={downloadFromDatabase} className="mt-4">
        Восстановить
      </Button>

      <Button onClick={uploadToDatabase} className="mt-4">
        Сделать резервную копию
      </Button>
    </div>
  );
}
