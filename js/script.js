$(function() {
    var form = Math.floor(Math.random() * 1);
    var width = (Math.floor(Math.random() * 10) * 10) + 10;
    var height = (Math.floor(Math.random() * 10) * 10) + 10;

    ajax()
    .done((data) => {
        var json_data = data["class"][form][form];
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
            var stage = data["class"][form][form];
            var result = inputCheck($('.input-css input'), stage);

            if(result) {
                // error
                console.log("checkが終わったよ");
                console.log(result);
                // return;
            }

            $('.object')
            .css({
                'width':'0',
                'height':'0',
                'border-style':'solid',
                'border-color':'transparent transparent #000 transparent',
                // 'border-radius':'50%',
                // 'border-color':'#fff',
                // 'background':'#fff',
                'position':'absolute',
                'top':'50%',
                'left':'50%',
                'transform':'translate(-50%, -50%)'
            });
            // TODO 答え合わせを実装
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
