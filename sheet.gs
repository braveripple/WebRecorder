/** ユーザー情報スプレッドシート操作クラス */
(UsersSS = function(ss) {
  this.ss = ss;
}).prototype = {
  getUsersSheet : function() {
    // メモ化
    if (!this.usersSheet) {
      this.usersSheet = this.ss.getSheetByName("Users");
    }
    return this.usersSheet;
  },
  getUsers : function() {
    return getJSONFromSheet(this.getUsersSheet());
  },
  getUser : function(email) {
    const userData = this.getUsers().filter(function(elem){ return elem.email == email });
    return userData.length > 0 ? userData[0] : undefined;
  },
  isExistsUser : function(email) {
    const userData = this.getUserData(email);
    return userData !== undefined;
  }
};

UsersSS.get = function() {
  if (!UsersSS._ss) {
    UsersSS._ss = SpreadsheetApp.openById("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
  }
  return new UsersSS(UsersSS._ss);
};

/** レコーダースプレッドシート操作クラス */
(RecorderSS = function(ss) {
  this.ss = ss;
}).prototype = {
  getRecordSheet : function() {
    // メモ化
    if (!this.recordSheet) {
      this.recordSheet = this.ss.getSheets()[0];
    }
    return this.recordSheet;
  },
  getRecords : function() {
    return getJSONFromSheet(this.getRecordSheet());
  },
  push : function(data) {
    this.getRecordSheet().appendRow(data);
  },
  pop : function() {
    this.getRecordSheet().getLastRow();
  }
};

RecorderSS.get = function(id) {
  if (!RecorderSS._ss) {
    RecorderSS._ss = (function() {
      const PROJECT_FOLDER_ID = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
      const folder = DriveApp.getFolderById(PROJECT_FOLDER_ID);
      Logger.log(id);
      const iter = folder.searchFiles(
        "mimeType = '" + MimeType.GOOGLE_SHEETS + "' and title contains '" + id + "'")
      
      if (iter.hasNext()) {
        const file = iter.next();
        return SpreadsheetApp.open(file);
      } else {
        const ss = createSSInFolder(id, PROJECT_FOLDER_ID);
        const sheet = ss.getSheets()[0];
        sheet.appendRow(["timestamp","latitude","longitude"]);
        return ss;
      }
    }());  
  }
  return new RecorderSS(RecorderSS._ss);
};
