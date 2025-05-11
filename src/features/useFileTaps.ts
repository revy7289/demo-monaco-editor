import { useState } from "react";
import type { ITreeNode } from "../shared/ITreeNode";

export const useFileTaps = () => {
  const [openTabs, setOpenTabs] = useState<ITreeNode[]>([]);
  const [activeTab, setActiveTab] = useState<ITreeNode>();

  const handleFileClick = (file: ITreeNode) => {
    if (file.type === "folder") return;
    if (file.isEditable === false) return alert("수정할 수 없는 파일입니다!");

    setOpenTabs((prev) => {
      const alreadyOpen = prev.find((tab) => tab.path === file.path);
      if (alreadyOpen) return prev;
      return [...prev, file];
    });

    setActiveTab(file);
  };

  return { handleFileClick, setActiveTab, openTabs, activeTab };
};
