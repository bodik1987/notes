import { Outlet } from "react-router";
import { MenubarPanel } from "./components/menu";

export default function Layout() {
  return (
    <main>
      <MenubarPanel />
      <Outlet />
    </main>
  );
}
