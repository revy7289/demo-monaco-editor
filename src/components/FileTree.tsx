import type { ITreeNode } from "../shared/ITreeNode";

interface IFileTreeProps {
  zipEntries: ITreeNode[];
  handleFileClick: (node: ITreeNode) => void;
}

export const FileTree = ({ zipEntries, handleFileClick }: IFileTreeProps) => {
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

  return <>{zipEntries.map((node) => renderTree(node))}</>;
};
