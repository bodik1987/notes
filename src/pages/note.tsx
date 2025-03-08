import Editor from "../components/editor/editor";

export default function Note() {
  return (
    <section>
      <div className="wrapper py-3">
        <div className="px-3 relative">
          <Editor />
        </div>
      </div>
    </section>
  );
}
