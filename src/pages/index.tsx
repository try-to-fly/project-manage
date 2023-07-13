import { listen, once } from "@tauri-apps/api/event"
import { invoke } from "@tauri-apps/api/tauri"
import type { NextPage } from "next"
import { useState } from "react"

const Home: NextPage = () => {
  const [list, setList] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const onButtonClick = () => {
    console.log("click")
    setLoading(true) // 设置loading为true

    void once<string[]>("scan_result", (event) => {
      setList(event.payload)
    })

    invoke<string[]>("get_scan_directory")
      .then((value) => {
        console.log(value)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setLoading(false) // 请求完成后，设置loading为false
      })
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <button
        onClick={onButtonClick}
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading} // 当loading为true时禁用按钮
      >
        {loading ? "加载中..." : "扫描"}
      </button>

      <ul className="mt-4 space-y-2">
        {list.map((item) => {
          return (
            <li
              key={item}
              className="flex items-center bg-gray-100 hover:bg-gray-200 rounded py-2 px-4"
            >
              <span className="text-gray-800">{item}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Home
