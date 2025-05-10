import type { ITreeNode } from "../shared/ITreeNode";

export const useParser = (buffer: ArrayBuffer): ITreeNode[] => {
  const view = new DataView(buffer);
  const byteArray = new Uint8Array(buffer);

  const EOCD_SIGNATURE = 0x06054b50;
  const CEN_SIGNATURE = 0x02014b50;

  let eocdIndex = -1;
  for (let i = byteArray.length - 22; i >= 0; i--) {
    if (view.getUint32(i, true) === EOCD_SIGNATURE) {
      eocdIndex = i;
      break;
    }
  }
  if (eocdIndex === -1) throw new Error("EOCD not found");

  const centralDirOffset = view.getUint32(eocdIndex + 16, true);
  let offset = centralDirOffset;

  const root: ITreeNode[] = [];

  const insertToTree = (tree: ITreeNode[], entry: ITreeNode) => {
    const parts = entry.path.split("/").filter(Boolean);
    let currentLevel = tree;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLeaf = i === parts.length - 1;
      const fullPath =
        parts.slice(0, i + 1).join("/") +
        (isLeaf && entry.type === "folder" ? "/" : "");

      let existing = currentLevel.find((node) => node.name === part);

      if (!existing) {
        existing = {
          name: part,
          path: fullPath,
          type: isLeaf ? entry.type : "folder",
          ext: isLeaf ? entry.ext : null,
          isText: isLeaf ? entry.isText : false,
          isImage: isLeaf ? entry.isImage : false,
          isEditable: isLeaf ? entry.isEditable : false,
          offset: entry.offset,
          compressedSize: entry.compressedSize,
          uncompressedSize: entry.uncompressedSize,
          ...(isLeaf ? {} : { children: [] }),
        };
        currentLevel.push(existing);
      }

      if (!isLeaf) {
        if (!existing.children) existing.children = [];
        currentLevel = existing.children;
      }
    }
  };

  while (view.getUint32(offset, true) === CEN_SIGNATURE) {
    const compressedSize = view.getUint32(offset + 20, true);
    const uncompressedSize = view.getUint32(offset + 24, true);
    const fileNameLen = view.getUint16(offset + 28, true);
    const extraLen = view.getUint16(offset + 30, true);
    const commentLen = view.getUint16(offset + 32, true);
    const localHeaderOffset = view.getUint32(offset + 42, true);

    const nameBytes = byteArray.slice(offset + 46, offset + 46 + fileNameLen);
    const filename = new TextDecoder().decode(nameBytes);
    const isDirectory = filename.endsWith("/");

    if (filename.startsWith(".") || filename.startsWith("_")) {
      offset += 46 + fileNameLen + extraLen + commentLen;
      continue; // 시스템 파일 무시
    }

    const extMatch = filename.match(/\.([a-zA-Z0-9]+)$/);
    const ext = extMatch ? `.${extMatch[1]}` : null;
    const isText = /\.(txt|js|css|html|md|json)$/i.test(filename);
    const isImage = /\.(png|jpe?g|gif|svg)$/i.test(filename);

    const entry: ITreeNode = {
      name: filename,
      path: filename,
      type: isDirectory ? "folder" : "file",
      ext,
      isText,
      isImage,
      isEditable: isText,
      offset: localHeaderOffset,
      compressedSize,
      uncompressedSize,
    };

    insertToTree(root, entry);

    offset += 46 + fileNameLen + extraLen + commentLen;
  }

  return root;
};
