// シート内容をJSONデータに変換
function getJSONFromSheet(sheet) {
  const rows = sheet.getDataRange().getValues();
  const keys = rows.splice(0, 1)[0];
  return rows.map(function(row) {
    const obj = {}
    row.map(function(item, index) {
      obj[keys[index]] = item;
    });
    return obj;
  });
};

// 特定フォルダにスプレッドシートを作成
function createSSInFolder(name, folderId) {
  const ss = SpreadsheetApp.create(name);
  const ssFile = DriveApp.getFileById(ss.getId());
  const folder = DriveApp.getFolderById(folderId);
  folder.addFile(ssFile);
  DriveApp.getRootFolder().removeFile(ssFile);
  return SpreadsheetApp.openById(ss.getId());
};
