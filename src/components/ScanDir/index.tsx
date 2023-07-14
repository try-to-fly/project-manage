import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";

import { PathConfig, pathStore } from "@/utils/store";
import { toast } from "@/utils/toast";

export const ScanDir = () => {
  const [list, setList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [allpath, setAllpath] = useState<PathConfig>({});

  const updateAllPath = async () => {
    const paths = await pathStore.getAllPaths();
    setAllpath(paths);
  };

  useEffect(() => {
    void updateAllPath();
  }, []);

  const onButtonClick = async () => {
    setLoading(true); // 设置loading为true
    setList([]); // 清空list
    const unlisten = await listen<string>("scan_result", (event) => {
      setList((list) => [event.payload, ...list]);
    });

    invoke<string[]>("get_scan_directory")
      .then((value) => {
        console.log(value);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false); // 请求完成后，设置loading为false
        unlisten();
      });
  };

  const handleAdd = async (path: string) => {
    await pathStore.addPath(path);
    await updateAllPath();
    await toast("添加成功");
  };

  const handleIgnore = async (path: string) => {
    await pathStore.ignorePath(path);
    await updateAllPath();
    await toast("忽略成功");
  };

  return (
    <div className="flex min-h-screen flex-col bg-white flex-grow m-2 ">
      <button
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={() => onButtonClick()}
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading} // 当loading为true时禁用按钮
      >
        {loading ? "加载中..." : "扫描"}
      </button>

      <ul className="mt-4 space-y-2">
        {list
          .filter((item) => !(item in allpath))
          .map((item) => {
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
    </div>
  );
};
