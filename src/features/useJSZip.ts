import JSZip from "jszip";
import type { ITreeNode } from "../shared/ITreeNode";

export const useJSZip = () => {
  const parseZip = (file: File): Promise<ITreeNode[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const zipData = e.target?.result;
          const zip = await JSZip.loadAsync(zipData);

          const root: ITreeNode[] = [];

          const getOrCreateFolder = (
            pathParts: string[],
            nodes: ITreeNode[]
          ): ITreeNode[] => {
            const folderName = pathParts[0];
            let existing = nodes.find(
              (n) => n.name === folderName && n.type === "folder"
            );

            if (!existing) {
              existing = {
                name: folderName,
                path: pathParts.slice(0, 1).join("/") + "/",
                type: "folder",
                children: [],
              };
              nodes.push(existing);
            }

            if (pathParts.length === 1) return existing.children!;
            return getOrCreateFolder(pathParts.slice(1), existing.children!);
          };

          const entries = Object.values(zip.files);

          for (const entry of entries) {
            const { name } = entry;

            // 폴더 엔트리 무시 (파일이 아닌 순수 디렉토리 엔트리는 name이 "/"로 끝남)
            if (entry.dir) continue;

            const pathParts = name.split("/");
            const fileName = pathParts.pop()!;
            const currentDir =
              pathParts.length > 0 ? getOrCreateFolder(pathParts, root) : root;

            const ext = fileName.split(".").pop()?.toLowerCase() || "";
            const isText = [
              "txt",
              "md",
              "json",
              "js",
              "ts",
              "html",
              "css",
            ].includes(ext);
            const isImage = [
              "png",
              "jpg",
              "jpeg",
              "gif",
              "webp",
              "svg",
            ].includes(ext);

            const node: ITreeNode = {
              name: fileName,
              path: name,
              type: "file",
              isText,
              isImage,
            };

            if (isText) {
              node.content = await entry.async("string");
            } else if (isImage) {
              node.blob = await entry.async("blob");
            }

            currentDir.push(node);
          }

          resolve(root);
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const makeZip = async (tree: ITreeNode[]): Promise<Blob> => {
    const zip = new JSZip();

    const addToZip = (nodes: ITreeNode[], pathPrefix = "") => {
      for (const node of nodes) {
        const currentPath = `${pathPrefix}${node.name}`;

        if (node.type === "folder" && node.children) {
          addToZip(node.children, `${currentPath}/`);
        } else if (node.type === "file") {
          if (node.isText && node.content !== undefined) {
            zip.file(currentPath, node.content);
          } else if (node.blob) {
            zip.file(currentPath, node.blob);
          }
        }
      }
    };

    addToZip(tree);

    const content = await zip.generateAsync({ type: "blob" });
    return content;
  };

  return {
    parseZip,
    makeZip,
  };
};
