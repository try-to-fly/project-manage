#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::env;
use tauri::Manager;

async fn scan_directory(window: &tauri::Window) {
    let path = std::env::var("HOME").unwrap_or_else(|_| "".into());

    for entry in walkdir::WalkDir::new(&path) {
        match entry {
            Ok(entry) => {
                let path = entry.path();
                if path.ends_with(".git") {
                    if let Some(parent_path) = path.parent() {
                        if let Some(parent_path_str) = parent_path.to_str() {
                            // Emit each scanned path
                            window.emit("scan_result", Some(parent_path_str.to_owned())).unwrap();
                        }
                    }
                }
            },
            Err(err) => {
                // Log the specific file path in case of an access error
                eprintln!("Warning: could not access path: {}, error: {}", err.path().unwrap_or(&std::path::PathBuf::new()).display(), err);
            }
        }
    }
}

#[tauri::command]
async fn get_scan_directory(window: tauri::Window) {
    // Invoke the scan_directory function with the window object.
    scan_directory(&window).await;
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_scan_directory])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
