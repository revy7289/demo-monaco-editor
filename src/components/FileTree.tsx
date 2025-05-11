import type { ITreeNode } from "../shared/ITreeNode";

interface IFileTreeProps {
  fileTree: ITreeNode[];
  handleFileClick: (node: ITreeNode) => void;
}

export const FileTree = ({ fileTree, handleFileClick }: IFileTreeProps) => {
  // ✅ 파일의 유형에 따라 아이콘 부여
  const getFileIcon = (node: ITreeNode): string => {
    switch (true) {
      case node.type === "folder":
        return "📁";
      case node.isText:
        return "📄";
      case node.isImage:
        return "🖼️";
      default:
        return "📦";
    }
  };

  // ✅ 폴더 트리를 재귀적으로 순환하여 네스팅된 파일트리 구조 형성
  const renderTree = (node: ITreeNode) => {
    return (
      <li key={node.path}>
        <span
          style={{ whiteSpace: "nowrap" }}
          onClick={() => handleFileClick(node)}
        >
          {getFileIcon(node)} {node.name}
        </span>
        {node.children && node.children.length > 0 && (
          <ul>{node.children.map((child) => renderTree(child))}</ul>
        )}
      </li>
    );
  };

  return <>{fileTree.map((node) => renderTree(node))}</>;
};
