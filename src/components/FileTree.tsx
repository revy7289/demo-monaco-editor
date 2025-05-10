import type { ITreeNode } from "../shared/ITreeNode";

interface IFileTreeProps {
  zipEntries: ITreeNode[];
  handleFileClick: (node: ITreeNode) => void;
}

export const FileTree = ({ zipEntries, handleFileClick }: IFileTreeProps) => {
  const renderTree = (node: ITreeNode) => {
    return (
      <li key={node.path}>
        <span
          style={{ whiteSpace: "nowrap" }}
          onClick={() => handleFileClick(node)}
        >
          {node.type === "folder" ? "📁" : "📄"} {node.name}
        </span>
        {node.children && node.children.length > 0 && (
          <ul>{node.children.map((child) => renderTree(child))}</ul>
        )}
      </li>
    );
  };

  return <>{zipEntries.map((node) => renderTree(node))}</>;
};
