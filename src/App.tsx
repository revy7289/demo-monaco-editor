import "./App.css";
import { FileTree } from "./components/FileTree";
import { FileUploader } from "./components/FileUploader";
import { MonacoEditor } from "./components/MonacoEditor";
import { useUploadFile } from "./features/useUploadFile";

function App() {
  const { inputRef, fileName, zipEntries, handleInputClick, handleFileChange } =
    useUploadFile();

  return (
    <>
      <div className="main">
        <div>Zip File Editor</div>

        <div className="main_content">
          <div className="content_uploader" onClick={handleInputClick}>
            <FileUploader
              inputRef={inputRef}
              fileName={fileName}
              handleFileChange={handleFileChange}
            />
          </div>

          <div className="content_workspace">
            <div className="workspace_tree">
              {zipEntries ? <FileTree zipEntries={zipEntries} /> : "File Tree"}
            </div>
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
