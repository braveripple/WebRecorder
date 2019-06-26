function doGet(e) {

  cacheTimestamp();
  return outputPage();
}

function cacheTimestamp() {

  const now = Moment.moment();
  const cache = CacheService.getUserCache();
  cache.put("timestamp", now.format("YYYY/MM/DD HH:mm:ss"));

}

function outputPage() {
  
  const htmlOutput = HtmlService.createTemplateFromFile('index').evaluate();
  htmlOutput
    .setTitle('Webレコーダー')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  
  return htmlOutput;

}

// ユーザーの記録から本日のデータのみ取り出す
function getData(locationData) {
  
  recordData(locationData);
  
  const user = UsersSS.get().getUser(Session.getActiveUser().getEmail());
  
  const todayTimestamps = (function() {
    const records = RecorderSS.get(user.id).getRecords();
    const today = Moment.moment();
    return records
        .filter(function(elem) { return Moment.moment(elem.timestamp).isSame(today, 'day')})
        .map(function(elem) { return elem.timestamp });
  }());
  
  const data = {
    userId :  user.id,
    startTime : Moment.moment(todayTimestamps[0]).format("HH:mm"),
    endTime : (function() {
      if (todayTimestamps.length == 1) {
        return "--:--";
      } else {
        return Moment.moment(todayTimestamps.slice(-1)[0]).format("HH:mm");
      }
    }())
  }
  return JSON.stringify(data);
}

function recordData(locationData) {

  const cache = CacheService.getUserCache();
  const timestamp = cache.get("timestamp");

  const user = UsersSS.get().getUser(Session.getActiveUser().getEmail());
  RecorderSS.get(user.id).push([timestamp, locationData.latitude, locationData.longitude]);

}

function doCancelRecord() {
  const user = UsersSS.get().getUser(Session.getActiveUser().getEmail());
  RecorderSS.get(user.id).pop();
}
