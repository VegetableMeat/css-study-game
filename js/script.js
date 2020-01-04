$(function() {
    // TODO ローカルストレージに格納されている値を難易度にする
    // 難易度
    var diff = 0;
    // 形を決める
    var form = 0;

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

        setElement(json_data["property"].length);
    })
    .fail((data) => {
        console.log("通信に失敗しました。");
        console.log(data);
    });

    $('.run-button button').on('click', function() {
        ajax()
        .done((data) => {
            var error_msg = {};
            var stage = data["class"][diff][form];
            var result = inputCheck($('.input-css input'), stage);

            if(!result) {
                console.log("checkが終わったよ");
                console.log(result);
                return;
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
            
            for(key in data["class"][diff][form]["default"]) {
                $('.object').css(key, data["class"][diff][form]["default"][key]);
            }

            for(key in result[1]) {
                console.log("key: " + key);
                console.log("result[key]: " + result[1][key]);
                $('.object').css(key, result[1][key]);
            }

            // TODO 答え合わせを実装
            clearJudge(result, stage["property"]);
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
            $.each(data["property"], function(index, d) {
                if(input[i].value == d) {
                    console.log(index + " パラメータ：あってます");
                    return;
                }
                cnt++;
            });

            if(data["property"].length == cnt) {
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

        return [result, result_array];
    }

    function clearJudge(result, stage) {
        // 同じ配列にエラーメッセージを入れているので、個別の配列を用意する
        var reg = new RegExp('[^0-9]', 'g');
        var clearFlg = true;
        var error_msg = {};
        
        if(result[0].length != stage.length) {
            clearFlg = false;
            error_msg["LengthError"] = "※重複しているプロパティが存在します！";
        }

        for(key in result[1]) {
            switch(key) {
                case "width":
                    if(Number(result[1][key].replace(reg, '')) > width) {
                        clearFlg = false;
                        error_msg["WidthLargeError"] = "※横の値が大きいかも...";
                    } else if(Number(result[1][key].replace(reg, '')) < width) {
                        clearFlg = false;
                        error_msg["WidthSmallError"] = "※横の値が小さいかも...";
                    }
                    break;
                case "height":
                    if(Number(result[1][key].replace(reg, '')) > height) {
                        clearFlg = false;
                        error_msg["HeightLargeError"] = "※縦の値が大きいかも...";
                    } else if(Number(result[1][key].replace(reg, '')) < height) {
                        clearFlg = false;
                        error_msg["HeightSmallError"] = "※縦の値が小さいかも...";
                    }
                    break;
                case "border-width":
                    var border_width = result[1][key].split(" ");

                    if(Number(border_width[1].replace(reg, '')) + Number(border_width[3].replace(reg, '')) > width) {
                        clearFlg = false;
                        error_msg["WidthLargeError"] = "※横の値が大きいかも...";
                    } else if(Number(border_width[1].replace(reg, '')) + Number(border_width[3].replace(reg, '')) < width){
                        clearFlg = false;
                        error_msg["WidthSmallError"] = "※横の値が小さいかも...";
                    }

                    if(Number(border_width[2].replace(reg, '')) > height) {
                        clearFlg = false;
                        error_msg["HeightLargeError"] = "※縦の値が大きいかも...";
                    } else if(Number(border_width[2].replace(reg, '')) < height) {
                        clearFlg = false;
                        error_msg["HeightSmallError"] = "※縦の値が小さいかも...";
                    }
                    break;
                case "border-radius":
                    if(Number(result[1][key].replace(reg, '')) < 50) {
                        clearFlg = false;
                        error_msg["RadiusError"] = "※Radiusの値が小さいかも...";
                    }
                    break;
                default:
                    console.log("なんでここにきてんねん。");
                    return;
                    break;
            }
        }

        $('.error-message').empty();

        if(clearFlg) {
            $(".modal").css("display", "block");
            $("#main-body").css("filter", "blur(8px)");
        } else {
            // TODO エラーの文面を簡潔にする？
            for(key in error_msg) {
                $('.error-message').append($('<h3>' + key + '</h3><p>' + error_msg[key] + '</p>'));
            }
        }
        return;
    }
});
