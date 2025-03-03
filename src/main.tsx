import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./layout.tsx";
import NotesLayout from "./notes-layout.tsx";
import Home from "./pages/home.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />

        <Route path="notes">
          <Route element={<NotesLayout />}>
            <Route index element={<div>1</div>} />
            <Route path=":id" element={<Home />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);
