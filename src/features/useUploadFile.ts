import { useRef, useState, type ChangeEvent } from "react";

export const useUploadFile = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");

  const handleInputClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const targetFile = e.target.files?.[0];

    if (targetFile === undefined) return alert("선택된 파일이 없습니다!");
    if (targetFile.name.endsWith(".zip") === false)
      return alert("zip파일만 업로드 가능합니다!");

    setFileName(targetFile.name);
  };

  return { inputRef, fileName, handleInputClick, handleFileChange };
};
