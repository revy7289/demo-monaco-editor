import type { ChangeEvent, RefObject } from "react";

interface IUploaderProps {
  inputRef: RefObject<HTMLInputElement | null>;
  fileName: string;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

/**
 * @remarks `useUploadFile` 훅을 통해 상태와 기능을 전달받아 동작합니다. 꼭 함께 사용해주세요.
 * @param inputRef `input`을 참조시켜 파일 업로드를 트리거 합니다.
 * @param fileName 업로드된 파일을 분석하여 `state`로 파일명을 관리합니다.
 * @param handleFileChange 파일을 업로드할 때 호출할 함수입니다.
 * @remarks `handleInputClick` 상위에서 자유롭게 `div에 onClick`으로 전달하여 트리거를 설정합니다.
 */
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
