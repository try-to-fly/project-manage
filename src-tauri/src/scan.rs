// scan.rs
use std::env;
use std::ffi::OsStr;
use walkdir::{DirEntry, WalkDir};
use tauri::Window;  // Don't forget to import Window in this module

fn is_excluded(entry: &DirEntry) -> bool {
    entry.file_name() != OsStr::new("Library") && entry.file_name() != OsStr::new("Pictures") && entry.file_name() != OsStr::new(".Trash")
}

pub async fn scan_directory(window: &Window) {
    let path = std::env::var("HOME").unwrap_or_else(|_| "".into());

    let walker = WalkDir::new(&path).into_iter().filter_entry(is_excluded);

    for entry in walker {
        match entry {
            Ok(entry) => {
                let path = entry.path();
                if path.ends_with(".git") {
                    if let Some(parent_path) = path.parent() {
                        if let Some(parent_path_str) = parent_path.to_str() {
                            window.emit("scan_result", Some(parent_path_str.to_owned())).unwrap();
                        }
                    }
                }
            },
            Err(err) => {
                eprintln!("Warning: could not access path: {}, error: {}", err.path().unwrap_or(&std::path::PathBuf::new()).display(), err);
            }
        }
    }
}

pub async fn get_scan_directory(window: &Window) {
    scan_directory(window).await;
}
