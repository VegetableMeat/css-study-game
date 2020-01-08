$(function() {
    // TODO ローカルストレージに格納されている値を難易度にする
    // 難易度
    const diff = 1;
    // 形を決める
    var form, timer, sub_property_1, sub_property_2;
    var answer = {
        "width":"",
        "height":"",
        "filter":"",
        "opacity":""
    };
    var history = {
        "form":[],
        "time":[]
    };
    var time = 0;
    var time_add = function() {
        console.log(time + "秒");
        time++;
    };

    createQuestion();

    /* --------------------------------------- */
    /*      スタートボタンが押されたら時間を計測
    /* --------------------------------------- */
    $('.start-button button').on('click', function() {
        timer = setInterval(time_add, 1000);
    });

    /* --------------------------------------- */
    /*      実行ボタンが押されたら入力チェックをする
    /* --------------------------------------- */
    $('.run-button button').on('click', function() {
        $('.error-message').empty();

        ajax()
        .done((data) => {
            console.log(data);
            var reg = new RegExp('[^0-9]', 'g');
            var stage = data["class"][diff][form];
            var result = inputCheck($('.input-css input'), stage["property"], data["config"]["regular"], data["config"]["sub-property"]);

            if(!result[0]) {
                console.log(result);
                setErrorMsg(result[1]);
                return;
            }

            console.log(result[1]);
            $('#object')
            .css({
                'width':'0',
                'height':'0',
                'border-style':'solid',
                'position':'absolute',
            });

            // 中央に寄せるため必要
            if(form == 0) {
                var border_width = result[1]["border-width"].split(" ");

                $('#object')
                .css({
                    'top':'calc(50% - ' + (Number(border_width[2].replace(reg, '')) / 2) + 'px)',
                    'left':'calc(50% - ' + ((Number(border_width[1].replace(reg, '')) + Number(border_width[3].replace(reg, ''))) / 2) + 'px)',
                });
            } else {
                $('#object')
                .css({
                    'top':'calc(50% - ' + (Number(result[1]["height"].replace(reg, '')) / 2) + 'px)',
                    'left':'calc(50% - ' + (Number(result[1]["width"].replace(reg, '')) / 2) + 'px)',
                });
            }
            
            // 初級のみ色等の指定がないので#fff固定にする
            if(diff == 0) {
                for(key in stage["default"]) {
                    $('#object').css(key, stage["default"][key]);
                }
            }

            for(key in result[1]) {
                $('#object').css(key, result[1][key]);
                if(form == 0 && key == "border-color") {
                    $('#object').css(key, "transparent transparent " + result[1][key] + " transparent");
                }
                if(key == "background-color") {
                    $('#object').css("border-color", result[1][key]);
                }
            }
            // $('.object').css("ratate", "-45deg");

            // 答え合わせ
            clearJudge(result, stage["property"], data["config"]["sub-property"]);
        })
        .fail((data) => {
            console.log("通信に失敗しました。");
            console.log(data);
        });
    });

    /* --------------------------------------- */
    /*              問題文を生成
    /* --------------------------------------- */
    function createQuestion() {
        ajax()
        .done((data) => {
            console.log(form);
            var stage = data["class"][diff][form];
            var config = data["config"];
            var question = "横" + answer["width"] + "px、縦" + answer["height"] + "px";

            if(diff != 0) {
                question += "、色は<span style=\"color: " + answer["color-3"] + "; filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.4));\">" + data["config"]["color"][answer["color-3"]] + "</span>";

                if(sub_property_1) {
                    question += "で影付き";
                } else {
                    question += "で半透明";
                }

                if(diff == 2) {
                    // TODO 上級用に問題文を作成
                    console.log(diff);
                }
            }

            question += "の" + stage["type"] + "を作成してください。";
            
            if(sub_property_1 == 1) {
                question += "<br><p>影は本体から右に" + answer["filter"] + "px、下に" + answer["filter"] + "pxです";
                question += "（※影のぼかしと色の指定は不要）</p>";
            }

            $('.question-text p')[0].innerHTML = question;
            
            var num = 0;

            if(diff != 0) {
                num = 1;
                if(diff == 2) {
                    num += 2;
                }
            }

            setElement(stage["property"].length + num);
        })
        .fail((data) => {
            console.log("通信に失敗しました。");
            console.log(data);
        });

        /* --------------------------------------- */
        /*              問題を作成
        /* --------------------------------------- */
        if(history["form"] == "") {
            form = Math.floor(Math.random() * 3);
            history["form"].push(form);
        } else {
            while(true) {
                var num = 0;
                form = Math.floor(Math.random() * 3);

                for(var i = 0; i < history["form"].length; i++) {
                    if(history["form"][i] == form) {
                        break;
                    }
                    num++;
                }

                // 一度出た形は記憶しておく
                if(num == history.length) {
                    history["form"].push(form);
                    break;
                }
            }
        }
        

        answer["width"] = (Math.floor(Math.random() * 14) * 10) + 20;
        answer["height"] = (Math.floor(Math.random() * 14) * 10) + 20;

        if(form == 2) {
            answer["width"] = answer["height"] = (Math.floor(Math.random() * 14) * 10) + 20;
        }
        
        if(diff != 0) {
            // opacityかfilterか決定
            sub_property_1 = Math.floor(Math.random() * 2);

            var colors_3 = [];
            var colors_6 = [];

            if(sub_property_1) {
                answer["filter"] = Math.floor(Math.random() * 10) + 1;
            } else {
                answer["opacity"] = "0.5";
            }

            for(var i = 0; i < 3; i++) {
                if(Math.floor(Math.random() * 2)) {
                    colors_3[i] = "0";
                } else {
                    colors_3[i] = "f";
                }
            }

            for(var i = j = 0; i < 3; i++) {
                colors_6[j] = colors_3[i];
                colors_6[j + 1] = colors_3[i];
                j = j + 2;
            }

            answer["color-3"] = "#" + colors_3.join("");
            answer["color-6"] = "#" + colors_6.join("");
        }
    }

    /* --------------------------------------- */
    /*          jsonファイルへの接続情報
    /* --------------------------------------- */
    function ajax() {
        return $.ajax({
            url: "json/stage.json",
            type: "GET",
            dataType: "json",
            data: { name: "type" },
        })
    }

    /* --------------------------------------- */
    /*              inputタグを生成
    /* --------------------------------------- */
    function setElement(stage) {
        $('.input-css').append("<span>border-style: 'solid'</span><br>");

        for(var i = 0; i < stage; i++) {
            $('.input-css').append($('<input> : <input>;<br>'));
        }
    }

    /* --------------------------------------- */
    /*  ユーザが入力したプロパティ、値が正しいか判定
    /* --------------------------------------- */
    function inputCheck(input, stage, reg, sub) {
        console.log(reg);
        var cnt = 0;
        var property;
        var result = [];
        var result_array = [];

        if(diff != 0) {
            stage.push(sub[0][sub_property_1]);
            if(diff != 1) {
                stage.push(sub[1][sub_property_2]);
            }
        }
        console.log(stage);
        for(var i = 0; i < input.length; i = i + 2) {
            cnt = 0;
            // 入力されたパラメータが存在するかどうか判定
            $.each(stage, function(index, p) {
                if(input[i].value == "") {
                    console.log(input[i].value);
                    property = "Empty";
                    return;
                } else if(input[i].value == p) {
                    return;
                }

                cnt++;
                property = input[i].value;
            });

            if(stage.length == cnt) {
                return [false, {"error" : property + "は不必要なプロパティです。"}];
            } else if(property == "Empty") {
                return [false, {"error" : "プロパティを入力してください。"}];
            }

            // パラメータに与えられた値が正しいかどうか判定
            var regexp = new RegExp(reg[input[i].value], 'g');

            if(input[i + 1].value == "") {
                return [false, {"error" : input[i].value + "の値が空です。"}];
            } else if(!input[i + 1].value.match(regexp)) {
                return [false, {"error" : input[i].value + "の値が不正です。"}];
            }

            result_array[input[i].value] = input[i + 1].value;
        }

        for(key in result_array) {
            result.push(key);
        }

        return [result, result_array];
    }

    /* --------------------------------------- */
    /*      正解の値が入力されているか判定
    /* --------------------------------------- */
    function clearJudge(result, stage, sub) {
        // 同じ配列にエラーメッセージを入れているので、個別の配列を用意する
        var reg = new RegExp('[^0-9]', 'g');
        var clearFlg = true;
        var error_msg = {};

        // // 中級上級の場合プロパティを追加する
        // if(diff != 0) {
        //     stage.push(sub[diff - 1][sub_property_1]);
        //     // 上級の場合さらに追加
        //     if(diff != 1) {
        //         stage.push(sub[diff - 1][sub_property_2]);
        //     }
        // }
        console.log("重複してないぞーーーーーーー！！！！");
        console.log(result[0].length);
        console.log(result[0]);
        console.log(stage.length);
        console.log(stage);
        if(result[0].length != stage.length) {
            clearFlg = false;
            error_msg["LengthError"] = "※重複しているプロパティが存在します。";
        }

        for(key in result[1]) {
            switch(key) {
                case "width":
                    if(Number(result[1][key].replace(reg, '')) != answer["width"]) {
                        clearFlg = false;
                        error_msg["WidthError"] = "※横の値が違います。";
                    }
                    break;
                case "height":
                    if(Number(result[1][key].replace(reg, '')) != answer["height"]) {
                        clearFlg = false;
                        error_msg["HeightError"] = "※縦の値が違います。";
                    }
                    break;
                case "border-width":
                    var border_width = result[1][key].split(" ");

                    if(Number(border_width[1].replace(reg, '')) + Number(border_width[3].replace(reg, '')) != answer["width"]) {
                        clearFlg = false;
                        error_msg["WidthError"] = "※横の値が違います。";
                    }

                    if(Number(border_width[2].replace(reg, '')) != answer["height"]) {
                        clearFlg = false;
                        error_msg["HeightError"] = "※縦の値が違います。";
                    }
                    break;
                case "border-radius":
                    if(Number(result[1][key].replace(reg, '')) < 50) {
                        clearFlg = false;
                        error_msg["RadiusError"] = "※不完全な円です。";
                    }
                    break;
                case "border-color":
                case "background-color":
                    if(result[1][key] == answer["color-3"] || result[1][key] == answer["color-6"]) {
                        break;
                    }

                    clearFlg = false;
                    error_msg["ColorError"] = "※指定した色が間違っています。";
                    break;
                case "opacity":
                    if(Number(result[1][key].replace(/[^0-9.]/, '')) != 0.5 ) {
                        // console.log("オッケー！！");
                        clearFlg = false;
                        error_msg["OpacityError"] = "※半透明にしてください。";
                    }
                    break;
                case "filter":
                    var filter_offset = result[1][key].replace(/[^0-9 ]/g, '').split(" ");

                    if(filter_offset[0] != answer["filter"] || filter_offset[1] != answer["filter"]) {
                        clearFlg = false;
                        error_msg["FilterError"] = "※影の位置が違います。";
                        break;
                    }
                    break;
                default:
                    console.log("なんでここに入ってんねん。");
                    return;
                    break;
            }
        }

        if(clearFlg) {
            $(".modal").css("display", "block");
            $("#main-body").css("filter", "blur(8px)");
            
            clearInterval(timer);
            history["time"].push(time);
            console.log("履歴 :");
            console.log(history);
        } else {
            setErrorMsg(error_msg);
        }
    }

    /* --------------------------------------- */
    /*          エラーメッセージを出力
    /* --------------------------------------- */
    function setErrorMsg(error_msg) {
        for(key in error_msg) {
            $('.error-message').append($('<h3>エラー</h3><p>' + error_msg[key] + '</p>'));
        }
    }
});
