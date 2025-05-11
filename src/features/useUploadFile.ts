import { useRef, useState, type ChangeEvent } from "react";
import type { ITreeNode } from "../shared/ITreeNode";
import { useJSZip } from "./useJSZip";

export const useUploadFile = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [fileTree, setFileTree] = useState<ITreeNode[]>();

  const handleInputClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const targetFile = e.target.files?.[0];

    if (targetFile === undefined) return alert("선택된 파일이 없습니다!");
    if (targetFile.name.endsWith(".zip") === false)
      return alert("zip파일만 업로드 가능합니다!");

    setFileName(targetFile.name);

    const zipEntries = await useJSZip(targetFile);
    setFileTree(zipEntries);
  };

  // const arrayBuffer = await targetFile.arrayBuffer();
  // const rootEntries = await useParser(arrayBuffer);
  // setZipEntries(rootEntries);

  return { inputRef, fileName, fileTree, handleInputClick, handleFileChange };
};
