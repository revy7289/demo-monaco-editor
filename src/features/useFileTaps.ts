import { useEffect, useState } from "react";
import type { ITreeNode } from "../shared/ITreeNode";

export const useFileTaps = () => {
  const [openTabs, setOpenTabs] = useState<ITreeNode[]>([]);
  const [activeTab, setActiveTab] = useState<ITreeNode>();
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (activeTab?.blob) {
      const url = URL.createObjectURL(activeTab.blob);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImageUrl(undefined);
    }
  }, [activeTab?.blob]);

  const handleFileClick = (file: ITreeNode) => {
    if (file.type === "folder") return;
    if (file.isText === false && file.isImage === false)
      return alert("수정할 수 없는 파일입니다!");

    setOpenTabs((prev) => {
      const alreadyOpen = prev.find((tab) => tab.path === file.path);
      if (alreadyOpen) return prev;
      return [...prev, file];
    });

    setActiveTab(file);
  };

  const handleTapClick = (selectedTab: ITreeNode) => {
    if (selectedTab.path === activeTab?.path) {
      // ✅ 중복 클릭하면 탭 닫기
      const newTabs = openTabs.filter((tab) => tab.path !== selectedTab.path);
      setOpenTabs(newTabs);

      // 🔁 activeTab 변경 (탭이 사라졌으니 이전 탭을 active로)
      const lastTab = newTabs[newTabs.length - 1];
      setActiveTab(lastTab);
    }
    // ✅ 다른 탭 클릭하면 activeTab만 변경
    setActiveTab(selectedTab);
  };

  return {
    handleFileClick,
    handleTapClick,
    openTabs,
    activeTab,
    imageUrl,
  };
};
