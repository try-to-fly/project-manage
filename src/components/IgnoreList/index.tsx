import { useEffect, useState } from "react";

import { pathStore } from "@/utils/store";
import { toast } from "@/utils/toast";

export const IgnoreList = () => {
  const [list, setList] = useState<string[]>([]);

  useEffect(() => {
    void (async () => {
      const projects = await pathStore.getIgnoredPaths();
      setList(projects);
    })();
  }, []);

  const handleAdd = async (path: string) => {
    await pathStore.addPath(path);
    await toast("添加成功");
  };

  const handleIgnore = async (path: string) => {
    await pathStore.ignorePath(path);
    await toast("忽略成功");
  };

  return (
    <ul className="mt-4 space-y-2">
      {list.map((item) => {
        return (
          <li
            key={item}
            className="flex items-center bg-gray-100 hover:bg-gray-200 rounded py-2 px-4"
          >
            <span className="text-gray-800">{item}</span>
            <button
              onClick={() => {
                void handleAdd(item);
              }}
              className="ml-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded-sm"
            >
              添加
            </button>
            <button
              onClick={() => {
                void handleIgnore(item);
              }}
              className="ml-2 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded-sm"
            >
              忽略
            </button>
          </li>
        );
      })}
    </ul>
  );
};
