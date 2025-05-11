import type { ITreeNode } from "../shared/ITreeNode";

interface ITapProps {
  openTabs: ITreeNode[];
  activeTab: ITreeNode | undefined;
  setActiveTab: (tab: ITreeNode) => void;
}

// ✅ 파일트리에서 선택된 파일을 tab-bar에 담고 마지막에 선택한 파일을 현재상태로 관리
export const Tab = ({ openTabs, activeTab, setActiveTab }: ITapProps) => {
  return (
    <>
      {openTabs.map((tab) => (
        <span
          key={tab.path}
          onClick={() => setActiveTab(tab)}
          className={tab.path === activeTab?.path ? "tab active" : "tab"}
        >
          {tab.name}
        </span>
      ))}
    </>
  );
};
