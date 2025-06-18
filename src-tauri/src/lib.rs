use log;
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  let app_data_dir = tauri::path::BaseDirectory::AppData;
  log::info!("appdata: {:?}", app_data_dir);
  tauri::Builder::default()
    .plugin(tauri_plugin_log::Builder::new()
        .level(log::LevelFilter::Info).build())
    .plugin(tauri_plugin_sql::Builder::new()
        .build())
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_opener::init())
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
