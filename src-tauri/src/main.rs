#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::env;
use tauri::Manager;

// 扫描home目录下的所有包含.git的目录
async fn scan_directory() -> Vec<String> {
    let path = std::env::var("HOME").unwrap_or_else(|_| "".into());
    let mut result = Vec::new();
    for entry in walkdir::WalkDir::new(&path) {
        match entry {
            Ok(entry) => {
                let path = entry.path();
                if path.ends_with(".git") {
                    if let Some(parent_path) = path.parent() {
                        if let Some(parent_path_str) = parent_path.to_str() {
                            result.push(parent_path_str.to_owned());
                        }
                    }
                }
            },
            Err(_err) => {
                // 如果出现错误，我们只是打印一个警告，而不是让整个程序崩溃
                eprintln!("Warning: could not access a path");
            }
        }
    }
    result
}

#[tauri::command]
async fn get_scan_directory(window: tauri::Window) {
  let result = scan_directory().await;
  // log
    println!("scan result: {:?}", result);
  window.emit("scan_result", Some(result)).unwrap();
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_scan_directory])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
