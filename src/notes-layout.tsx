import { Outlet } from "react-router";
import { MenubarPanel } from "./components/menu";

export default function NotesLayout() {
  return (
    <section>
      <div className="wrapper py-3">
        <Outlet />
        <div className="wrapper fixed inset-x-0 bottom-2">
          <MenubarPanel />
        </div>
      </div>
    </section>
  );
}
