import { NavLink, Outlet } from "react-router";

export default function Layout() {
  return (
    <main>
      <header className="bg-gray-100 h-10 flex w-full items-center">
        <div className="wrapper flex gap-4">
          <NavLink to={`/`}>Home</NavLink>
          <NavLink to={`/notes`}>Notes</NavLink>
        </div>
      </header>
      <Outlet />
    </main>
  );
}
