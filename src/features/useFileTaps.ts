import { useEffect, useState } from "react";
import type { ITreeNode } from "../shared/ITreeNode";
import { useJSZip } from "./useJSZip";

export const useFileTaps = () => {
  const [openTabs, setOpenTabs] = useState<ITreeNode[]>([]);
  const [activeTab, setActiveTab] = useState<ITreeNode | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  const { makeZip } = useJSZip();

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
      setActiveTab(undefined);
    } else {
      // ✅ 다른 탭 클릭하면 activeTab만 변경
      setActiveTab(selectedTab);
    }
  };

  const handleRezipClick = async () => {
    const zipBlob = await makeZip(openTabs);

    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "edited.zip";
    a.click();

    URL.revokeObjectURL(url);
  };

  return {
    handleFileClick,
    handleTapClick,
    handleRezipClick,
    setOpenTabs,
    openTabs,
    activeTab,
    imageUrl,
  };
};
