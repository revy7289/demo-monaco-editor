import type { ChangeEvent, RefObject } from "react";

interface IUploaderProps {
  inputRef: RefObject<HTMLInputElement | null>;
  fileName: string;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

// ✅ ref와 event handler를 전달받아 파일을 업로드하는 로직 구현
export const FileUploader = ({
  inputRef,
  fileName,
  handleFileChange,
}: IUploaderProps) => {
  return (
    <>
      <div>{fileName || "File Upload Handler"}</div>

      <input
        style={{ display: "none" }}
        type="file"
        accept=".zip"
        ref={inputRef}
        onChange={handleFileChange}
      />
    </>
  );
};
