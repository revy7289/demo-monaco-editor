import type { ITreeNode } from "../shared/ITreeNode";

interface ITapProps {
  openTabs: ITreeNode[];
  activeTab: ITreeNode | undefined;
  handleTapClick: (tab: ITreeNode) => void;
  handleRezipClick: () => void;
}

// ✅ 파일트리에서 선택된 파일을 tab-bar에 담고 마지막에 선택한 파일을 현재상태로 관리
export const Tab = ({
  openTabs,
  activeTab,
  handleTapClick,
  handleRezipClick,
}: ITapProps) => {
  return (
    <>
      <div className="tab_bar">
        {openTabs.map((tab) => (
          <span
            key={tab.path}
            onClick={() => handleTapClick(tab)}
            className={tab.path === activeTab?.path ? "tab active" : "tab"}
          >
            {tab.name}
          </span>
        ))}
      </div>
      {activeTab && (
        <button className="downloader" onClick={handleRezipClick}>
          re-zip
        </button>
      )}
    </>
  );
};
