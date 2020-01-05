$(function () {
    // アクセス先WebAPI URL
    const apiUrl = "http://126.60.26.165:80";

    // 登録ボタン押下時に実行
    $(".register-button button").click(function () {
        // 各フォームから値を取得してJSONデータを作成
        let data = {
            user_id: $('[type=text]').val(),
            password: $('[type=password]').val()
        };

        // WebAPIアクセス実行
        $.ajax({
            type: "post",
            url: `${apiUrl}/signup`,
            data: JSON.stringify(data),
            contentType: 'application/json',
            dataType: "json",
            success: function (json_data) {
                console.log(json_data)
            },
            error: function (json_data) {
                console.log(json_data)
            },
            complete: function () {
            }
        });
    });

    // ログインボタン押下時に実行
    $(".login-button button").click(function () {
        // 各フォームから値を取得してJSONデータを作成
        let data = {
            user_id: $('[type=text]').val(),
            password: $('[type=password]').val()
        };

        // WebAPIアクセス実行
        $.ajax({
            type: "post",
            url: `${apiUrl}/login`,
            data: JSON.stringify(data),
            contentType: 'application/json',
            dataType: "json",
            success: function (json_data) {
                console.log(json_data)
            },
            error: function (json_data) {
                console.log(json_data)
            },
            complete: function () {
            }
        });
    });
});