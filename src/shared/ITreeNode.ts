export interface ITreeNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: ITreeNode[];
  content?: string;
  blob?: Blob;
  isText?: boolean;
  isImage?: boolean;
}
