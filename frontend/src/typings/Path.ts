interface BasePath {
  name: string;
  path: string;
  size: number;
  lastModified: string;
}

interface File extends BasePath {
  type: 'file';
}

interface Folder extends BasePath {
  type: 'folder';
}

export type PathType = 'file' | 'folder' | 'drive' | 'computer' | 'parent';
export type Path = File | Folder;
export type { File as PathFile, Folder as PathFolder };
