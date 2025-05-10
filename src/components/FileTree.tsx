import type { ITreeNode } from "../shared/ITreeNode";

export const FileTree = ({ zipEntries }: { zipEntries: ITreeNode[] }) => {
  const renderTree = (node: ITreeNode) => {
    return (
      <li key={node.path}>
        <span style={{ whiteSpace: "nowrap" }}>
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
