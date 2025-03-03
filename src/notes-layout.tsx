import { Outlet } from "react-router";

export default function NotesLayout() {
  return (
    <section>
      <div className="wrapper py-3">
        <Outlet />
      </div>
    </section>
  );
}
