// トークンの設定
var channel_access_token = "Lineのアクセストークン";

//LineBotからのメッセージ受信
function doPost(e) {
  
var events = JSON.parse(e.postData.contents).events;

  events.forEach(function(event) {
  
    if(event.type == "message"){
　　　 if (event.message.type == 'text'){
      } else if (event.message.type == 'image'){
        ImageUrl = getImageUrlByLine(event.message.id)
        imageBlob = getImageBlobByImageUrl(ImageUrl);
        message = GetOcrTextByimageBlob(imageBlob)
      }

      lineReply(event,message);

    }
    else if(event.type == "follow"){
      /* 友だち追加・ブロック解除 */ 
    }
    else if(event.type == "unfollow"){
      /* ブロック */ 
    }
  });
}


//イメージ画像のURLを取得する
function getImageUrlByLine(message_id) {
  var url = 'https://api.line.me/v2/bot/message/' + message_id + '/content';
  return url;
}

//URLから画像を取り出す
function getImageBlobByImageUrl(url){

    var res = UrlFetchApp.fetch(url, {
      'headers': {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + channel_access_token,
      },
      'method': 'get'
    });

    var imageBlob = res.getBlob().getAs("image/png").setName("temp.png")
    return imageBlob;
}

//画像をOCRで文字起こしを行う
function GetOcrTextByimageBlob(imageBlob) {
  var resource = {
    title: imageBlob.getName(),
    mimeType: imageBlob.getContentType()
  };
  var options = {
    ocr: true,
  };

  var file = Drive.Files.insert(resource, imageBlob, options);
  
  var doc = DocumentApp.openById(file.id);
  var text = doc.getBody().getText();

  return text
}

//メッセージを追加する
function GetTransByText(text) {
  message = "読み上げるクマ"
  message += "\n"
  return message;
}

//Lineのメッセージを返却する
function lineReply(event,message) {

   var postData = {
    "replyToken" : event.replyToken,
    "messages" : [
      {
        "type" : "text",
        "text" : message
      }
    ]
  };

  var options = {
    "method" : "post",
    "headers" : {
      "Content-Type" : "application/json",
      "Authorization" : "Bearer " + channel_access_token
    },
    "payload" : JSON.stringify(postData)
  };

  UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", options);
}
