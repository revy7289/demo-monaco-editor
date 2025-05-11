import { useEffect } from "react";
import "./App.css";
import { FileTree } from "./components/FileTree";
import { FileUploader } from "./components/FileUploader";
import { MonacoEditor } from "./components/MonacoEditor";
import { Tab } from "./components/Tab";
import { useFileTaps } from "./features/useFileTaps";
import { useUploadFile } from "./features/useUploadFile";

function App() {
  // ✅ 세로 스크롤을 가로 스크롤로 전환하는 효과
  useEffect(() => {
    const elements = [
      document.querySelector(".editor_tabs"),
      document.querySelector(".workspace_tree"),
    ].filter((el): el is HTMLElement => el !== null); // 타입 가드

    const onWheel = (e: Event) => {
      const wheelEvent = e as WheelEvent;
      if (wheelEvent.deltaY !== 0) {
        e.preventDefault();
        (e.currentTarget as HTMLElement).scrollLeft += wheelEvent.deltaY;
      }
    };

    elements.forEach((el) =>
      el.addEventListener("wheel", onWheel, { passive: false })
    );

    return () => {
      elements.forEach((el) => el.removeEventListener("wheel", onWheel));
    };
  }, []);

  const { inputRef, fileName, zipEntries, handleInputClick, handleFileChange } =
    useUploadFile();

  const { handleFileClick, setActiveTab, openTabs, activeTab } = useFileTaps();

  if (activeTab) {
    console.log(activeTab.content);
  }

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
              {zipEntries ? (
                <FileTree
                  zipEntries={zipEntries}
                  handleFileClick={handleFileClick}
                />
              ) : (
                "File Tree"
              )}
            </div>
            <div className="workspace_editor">
              <div className="editor_tabs">
                <Tab
                  openTabs={openTabs}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              </div>
              <div className="editor_view">
                {activeTab ? (
                  <MonacoEditor content={String(activeTab.content)} />
                ) : (
                  <div className="view_null">no contents</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
