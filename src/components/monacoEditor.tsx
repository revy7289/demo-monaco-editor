import { useRef, useEffect, type Dispatch, type SetStateAction } from "react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import type { ITreeNode } from "../shared/ITreeNode";

interface IMonacoEditorProps {
  content: string;
  setOpenTabs: Dispatch<SetStateAction<ITreeNode[]>>;
  activeTab: ITreeNode;
}

export const MonacoEditor: React.FC<IMonacoEditorProps> = ({
  content,
  setOpenTabs,
  activeTab,
}) => {
  // ✅ editor가 instance로 생성되기 때문에 ref로 참조하여 간접적으로 관리
  const containerRef = useRef(null);
  const instanceRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (!containerRef.current || instanceRef.current) return;
    // ✅ div를 ref하지 못하거나 instance를 이미 ref하고 있다면 early exit하여 중복 방지

    instanceRef.current = monaco.editor.create(containerRef.current, {
      value: content,
      // "function x() {", '\tconsole.log("Hello world!");', "}"].join("\n"),
      language: "typescript",
    });

    const editor = instanceRef.current;

    const model = editor.getModel();
    const changeListener = editor.onDidChangeModelContent(() => {
      const newValue = model?.getValue();
      if (newValue !== undefined) {
        setOpenTabs((prev) =>
          prev.map((tab) =>
            tab.path === activeTab.path ? { ...tab, content: newValue } : tab
          )
        );
      }
    });

    return () => {
      changeListener.dispose();
      editor.dispose();
      instanceRef.current = null;
    };
  }, []); // ✅ 공배열로 mount 시점 1회 실행

  return (
    <div style={{ width: "100%", height: "100%" }} ref={containerRef}></div>
  );
};
