import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./layout.tsx";
import Note from "./pages/note.tsx";
import Home from "./pages/home.tsx";
import "./index.css";
import Folders from "./pages/folders.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />

        <Route path="folders">
          <Route element={<Folders />}>
            <Route index element={<div>Folders</div>} />
            <Route path=":id" element={<div>Folder Id</div>} />
          </Route>
        </Route>

        <Route path="notes">
          <Route element={<Note />}>
            <Route index element={<div>Notes</div>} />
            <Route path=":id" element={<div>Note 1</div>} />
          </Route>
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);
