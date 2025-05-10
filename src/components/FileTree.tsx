import type { ITreeNode } from "../shared/ITreeNode";

export const FileTree = ({ zipEntries }: { zipEntries: ITreeNode[] }) => {
  const renderTree = (node: ITreeNode) => {
    return (
      <li key={node.path}>
        <span>{node.name}</span>
        {node.children && node.children.length > 0 && (
          <ul>{node.children.map((child) => renderTree(child))}</ul>
        )}
      </li>
    );
  };

  return <ul>{zipEntries.map((node) => renderTree(node))}</ul>;
};
