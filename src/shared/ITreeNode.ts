export interface ITreeNode {
  name: string;
  path: string;
  type: "file" | "folder";
  ext: string | null;
  isText: boolean;
  isImage: boolean;
  isEditable: boolean;
  offset: number;
  compressedSize: number;
  uncompressedSize: number;
  children?: ITreeNode[];
  content?: string | Blob | null;
}
