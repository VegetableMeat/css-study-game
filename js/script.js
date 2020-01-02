$(function() {
    // TODO 難易度をどういう基準で変更するか考える
    // 難易度
    var diff = 0;
    // 形を決める
    var form = 1;

    if(form == 2) {
        var width = height = (Math.floor(Math.random() * 14) * 10) + 20;
    } else {
        var width = (Math.floor(Math.random() * 14) * 10) + 20;
        var height = (Math.floor(Math.random() * 14) * 10) + 20;
    }

    ajax()
    .done((data) => {
        var json_data = data["class"][diff][form];
        $('.question-text p')[0].innerHTML = "横" + width + "px、縦" + height + "pxの" + json_data["type"] + "を作成してください。";

        setElement(json_data["parameter"].length);
    })
    .fail((data) => {
        console.log("通信に失敗しました。");
        console.log(data);
    });

    $('.run-button button').on('click', function() {
        ajax()
        .done((data) => {
            var stage = data["class"][diff][form];
            var result = inputCheck($('.input-css input'), stage);

            if(result) {
                console.log("checkが終わったよ");
                console.log(result);
            }

            $('.object')
            .css({
                'width':'0',
                'height':'0',
                'border-style':'solid',
                'position':'absolute',
                'top':'50%',
                'left':'50%',
                'transform':'translate(-50%, -50%)'
            });
            // TODO 答え合わせを実装
            for(key in data["class"][diff][form]["default"]) {
                $('.object').css(key, data["class"][diff][form]["default"][key]);
            }

            for(key in result[1]) {
                console.log("key: " + key);
                console.log("result[key]: " + result[1][key]);
                $('.object').css(key, result[1][key]);
            }            
        })
        .fail((data) => {
            console.log("通信に失敗しました。");
        });
    });

    function ajax() {
        return $.ajax({
            url: "json/test.json",
            type: "GET",
            dataType: "json",
            data: { name: "type" },
        })
    }

    function setElement(num) {
        $('.input-css').append("<span>border-style: 'solid'</span><br>");
        for(var i = 0; i < num; i++) {
            $('.input-css').append($('<input> : <input>;<br>'));
        }
    }

    function inputCheck(input, data) {
        var cnt;
        var result = [];
        var result_array = [];

        for(var i = 0; i < input.length; i = i + 2) {
            cnt = 0;
            // 入力されたパラメータが存在するかどうか判定
            $.each(data["parameter"], function(index, d) {
                if(input[i].value == d) {
                    console.log(index + " パラメータ：あってます");
                    return;
                }
                cnt++;
            });

            if(data["parameter"].length == cnt) {
                // error: ないよ
                console.log("今回は不必要なパラメータです");
                return;
            }

            // パラメータに与えられた値が正しいかどうか判定
            var regexp = new RegExp(data["regular"][input[i].value], 'g');
            if(input[i + 1].value.match(regexp)) {
                console.log("値：あってます");
            } else {
                // error: 
                console.log("値が異常です");
                return;
            }

            result_array[input[i].value] = input[i + 1].value;
        }

        for(key in result_array) {
            result.push(key);
        }

        return [result, result_array]
    }
});
