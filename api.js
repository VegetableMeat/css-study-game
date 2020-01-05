$(function () {
    // 登録ボタン
    $(".register-button button").click(function () {
        // 各フィールドから値を取得してJSONデータを作成
        var data = {
            user_id: $('[type=text]').val(),
            password: $('[type=password]').val()
        };

        // 通信実行
        $.ajax({
            type: "post",                // method = "POST"
            url: "http://126.60.26.165:80/signup",        // POST送信先のURL
            data: JSON.stringify(data),  // JSONデータ本体
            contentType: 'application/json', // リクエストの Content-Type
            dataType: "json",           // レスポンÏスをJSONとしてパースする
            success: function (json_data) {   // 200 OK時
                console.log(json_data)
            },
            error: function (json_data) {
                console.log(json_data)
            },
            complete: function () {      // 成功・失敗に関わらず通信が終了した際の処理
            }
        });
    });

    // ログインボタン
    $(".login-button button").click(function () {
        // 各フィールドから値を取得してJSONデータを作成
        var data = {
            user_id: $('[type=text]').val(),
            password: $('[type=password]').val()
        };

        // 通信実行
        $.ajax({
            type: "post",                // method = "POST"
            url: "http://126.60.26.165:80/login",        // POST送信先のURL
            data: JSON.stringify(data),  // JSONデータ本体
            contentType: 'application/json', // リクエストの Content-Type
            dataType: "json",           // レスポンÏスをJSONとしてパースする
            success: function (json_data) {   // 200 OK時
                console.log(json_data)
            },
            error: function (json_data) {
                console.log(json_data)
            },
            complete: function () {      // 成功・失敗に関わらず通信が終了した際の処理
            }
        });
    });
});