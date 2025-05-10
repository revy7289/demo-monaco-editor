import { useRef, useState, type ChangeEvent } from "react";
import { useParser } from "./useParser";
import type { ITreeNode } from "../shared/ITreeNode";

export const useUploadFile = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [zipEntries, setZipEntries] = useState<ITreeNode[]>([]);

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

    const arrayBuffer = await targetFile.arrayBuffer();
    try {
      const rootEntries = useParser(arrayBuffer);
      const nonSystemFiles = rootEntries.filter(
        (file) => !file.path.startsWith(".") && !file.path.startsWith("_")
      );

      setZipEntries(nonSystemFiles);
    } catch (error) {
      alert(".zip파일 분석 중 오류 발생:" + error);
    }
  };

  return { inputRef, fileName, zipEntries, handleInputClick, handleFileChange };
};
