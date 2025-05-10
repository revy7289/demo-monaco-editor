import "./App.css";
import { MonacoEditor } from "./components/monacoEditor";

function App() {
  return (
    <>
      <div className="main">
        <div>Zip File Editor</div>

        <div className="main_content">
          <div className="content_uploader">File Upload Handler</div>

          <div className="content_workspace">
            <div className="workspace_tree">File Tree</div>
            <div className="workspace_editor">
              <div className="editor_tabs">tabs</div>
              <div className="editor_view">
                <MonacoEditor />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
