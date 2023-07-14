import { Store } from "tauri-plugin-store-api";

enum PathStatus {
  ADDED = "added",
  IGNORED = "ignored",
}

export type PathConfig = Record<
  string,
  {
    status: PathStatus;
  }
>;

class PathStore {
  store: Store;

  constructor(filename: string) {
    this.store = new Store(filename);
  }

  async addPath(path: string): Promise<void> {
    const currentPaths = await this.getAllPaths();
    currentPaths[path] = { status: PathStatus.ADDED };
    await this.store.set("paths", currentPaths);
    await this.store.save();
  }

  async ignorePath(path: string): Promise<void> {
    const currentPaths = await this.getAllPaths();
    currentPaths[path] = {
      status: PathStatus.IGNORED,
    };
    await this.store.set("paths", currentPaths);
    await this.store.save();
  }

  async getAllPaths() {
    return (await this.store.get<PathConfig>("paths")) ?? {};
  }

  async getAddedPaths(): Promise<string[]> {
    const paths = await this.getAllPaths();
    return (
      Object.entries(paths)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, config]) => config.status === PathStatus.ADDED)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(([path, _]) => path)
    );
  }

  async getIgnoredPaths(): Promise<string[]> {
    const paths = await this.getAllPaths();
    return (
      Object.entries(paths)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, config]) => config.status === PathStatus.IGNORED)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(([path, _]) => path)
    );
  }
}

export const pathStore = new PathStore(".project-manager.store.dat");
