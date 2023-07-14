// main.rs
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod scan;

#[tauri::command]
async fn get_scan_directory(window: tauri::Window) {
    scan::get_scan_directory(&window).await;
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![get_scan_directory])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
