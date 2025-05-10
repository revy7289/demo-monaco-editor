import type { ITreeNode } from "../shared/ITreeNode";

interface ITapProps {
  openTabs: ITreeNode[];
  activeTab: ITreeNode | undefined;
  setActiveTab: (tab: ITreeNode) => void;
}

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
