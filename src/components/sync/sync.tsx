import { useState } from "react";
import UserForm from "./user-form";
import SyncCore from "./sync-core";
import useLocalStorage from "@/lib/useLocalStorage";
import { IUser } from "@/lib/store";
import { Button } from "../ui/button";

export default function Sync() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [user, saveUser] = useLocalStorage<IUser | null>("user", null);
  const [userForm, setUserForm] = useState(false);

  return (
    <>
      <div className="flex justify-between gap-3">
        <h2>{user ? user.name : "Нет пользователя"}</h2>
        <div className="flex gap-3">
          {loading && <div>Загрузка...</div>}

          {success && <div>{success}</div>}

          {error && <div className="text-red-500">{error}</div>}
        </div>
      </div>

      {user ? (
        <SyncCore
          user={user}
          setLoading={setLoading}
          setSuccess={setSuccess}
          setError={setError}
        />
      ) : (
        <>
          {userForm ? (
            <UserForm
              saveUser={saveUser}
              setLoading={setLoading}
              setSuccess={setSuccess}
              setError={setError}
            />
          ) : (
            <>
              <Button
                onClick={() => setUserForm(true)}
                className="mt-4 button primary-button"
              >
                Войти
              </Button>
            </>
          )}
        </>
      )}
    </>
  );
}
