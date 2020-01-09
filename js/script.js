$(function() {
    // TODO ローカルストレージに格納されている値を難易度にする
    // 難易度 初級0、中級1、上級2
    const diff = 0;
    var form, timer, sub_property_1, sub_property_2;
    var answer = {
        "width":"",
        "height":"",
        "filter":"",
        "opacity":"",
        "transform":"",
        "background":"",
    };
    var history = {
        "form":[],
        "time":[],
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
            var reg = new RegExp('[^0-9]', 'g');
            var stage = data["class"][diff][form];
            var result = inputCheck($('.input-css input'), stage["property"], data["config"]["regular"], data["config"]["sub-property"]);

            if(!result[0]) {
                setErrorMsg(result[1]);
                return;
            }

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
                if(key == "background") {
                    $('#object').css("border-style", "none");
                }
            }
            // $('#object').css("transform", "rotate(45deg)");

            // 答え合わせ
            clearJudge(result, stage["property"], data["config"]["sub-property"]);
        })
        .fail((data) => {
            console.log("通信に失敗しました。");
            console.log(data);
        });
    });

    $('.next-button button').on('click', function() {
        // $(".modal").css("display", "none");
        // $("#main-body").css("filter", "none");
        // $(".game-header").css("filter", "none");
        init();
    });

    /* --------------------------------------- */
    /*              問題文を生成
    /* --------------------------------------- */
    function createQuestion() {
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
                if(num == history["form"].length) {
                    history["form"].push(form);
                    break;
                }
            }
        }
        
        // TODO widthとheightの上限下限を決める
        answer["width"] = (Math.floor(Math.random() * 20) * 10) + 50;
        answer["height"] = (Math.floor(Math.random() * 20) * 10) + 50;
        
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

            if(diff == 2) {
                var transform = Math.floor(Math.random() * 3);
                var rotate_val = (Math.floor(Math.random() * 9) * 5) + 10;
                var translate_x = Math.floor(Math.random() * 10) + 1;
                var translate_y = Math.floor(Math.random() * 10) + 1;
                var scale_x = ((Math.floor(Math.random() * 9) + 1) / 10).toFixed(1);
                var scale_y = ((Math.floor(Math.random() * 9) + 1) / 10).toFixed(1);                
                sub_property_2 = 0;
                // Math.floor(Math.random() * 2);

                switch(transform) {
                    case 0:
                        answer["transform"] = { "rotate" : rotate_val };
                        break;
                    case 1:
                        answer["transform"] = { "translate" : { "x" : translate_x, "y" : translate_y } };
                        break;
                    case 2:
                        answer["transform"] = { "scale" : { "x" : scale_x, "y" : scale_y } };
                        break;
                }

                if(sub_property_2) {
                    answer["border-style"];
                } else if(form != 0) {
                    var reverse_color_3 = answer["color-3"].replace(/#/, '').split("");
                    var reverse_color_6 = answer["color-6"].replace(/#/, '').split("");
                    answer["background"] = { "color_3" : [ answer["color-3"], "#" ],
                                             "color_6" : [ answer["color-6"], "#" ] };

                    for(var i = 0; i < reverse_color_3.length; i++) {
                        switch(reverse_color_3[i]) {
                            case "f":
                                answer["background"]["color_3"][1] += "0";
                                break;
                            case "0":
                                answer["background"]["color_3"][1] += "f";
                                break;
                        }
                    }

                    for(var i = 0; i < reverse_color_6.length; i++) {
                        switch(reverse_color_6[i]) {
                            case "f":
                                answer["background"]["color_6"][1] += "0";
                                break;
                            case "0":
                                answer["background"]["color_6"][1] += "f";
                                break;
                        }
                    }
                }
            }
        }

        ajax()
        .done((data) => {
            var stage = data["class"][diff][form];
            var config = data["config"];

            // 問題文の作成
            var question = "<p>横" + answer["width"] + "px、縦" + answer["height"] + "px";

            if(diff != 0) {
                question += "、色は";

                if(answer["background"].length != 0) {
                    question += "上から<span style=\"color: " + answer["color-3"] + "; filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.4));\">" + data["config"]["color"][answer["color-3"]] + "</span>";
                    question += "と<span style=\"color: " + answer["background"]["color_3"][1] + "; filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.4));\">" + data["config"]["color"][answer["background"]["color_3"][1]] + "</span>のグラデーション";
                } else {
                    question += "<span style=\"color: " + answer["color-3"] + "; filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.4));\">" + data["config"]["color"][answer["color-3"]] + "</span>";
                }

                if(sub_property_1) {
                    question += "で影付き";
                } else {
                    question += "で半透明";
                }

                if(diff == 2) {
                    for(key in answer["transform"]) {
                        switch(key) {
                            case "rotate":
                                question += "<br>傾きが" + answer["transform"][key] + "度の";
                                break;
                            case "translate":
                                question += "<br>中心から横に" + answer["transform"][key]["x"] + "px、縦に" + answer["transform"][key]["y"] + "px移動させた";
                                break;
                            case "scale":
                                question += "<br>さらに横の長さを"  + answer["transform"][key]["x"] + "倍に、縦の長さを" + answer["transform"][key]["y"] + "倍にした";
                                break;
                        }
                    }
                } else {
                    question += "の";
                }
            }

            question += stage["type"] + "を作成してください。</p>";
            
            if(sub_property_1 == 1) {
                question += "<br><p>影は本体から右に" + answer["filter"] + "px、下に" + answer["filter"] + "pxです";
                question += "（※影のぼかしと色の指定は不要）</p>";
            }

            $('.question-text').append(question);
            
            // 難易度によってプロパティが増えていくので、増分の値を決める
            var num = 0;

            if(diff != 0) {
                num = 1;
                // 三角形の場合、transformまで
                if(diff == 2 && form != 0) {
                    if(answer["background"].length == 0) {
                        num = 2;
                    }
                }
            }

            // inputタグを生成
            setElement(stage["property"].length + num);
        })
        .fail((data) => {
            console.log("通信に失敗しました。");
            console.log(data);
        });
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
        var cnt = 0;
        var property;
        var result = [];
        var result_array = [];

        // 難易度ごとにプロパティを増やす
        if(diff != 0) {
            stage.push(sub[0][sub_property_1]);
            if(diff != 1 && form != 0) {
                // background-colorとbackgroundは共存できないため、backgroundが指定された場合background-colorを削除する
                if(answer["background"].length != 0) {
                    stage = stage.filter(function(val) {
                        return val !== "background-color";
                    });
                }
                stage.push(sub[1][sub_property_2]);
            }
        }

        for(var i = 0; i < input.length; i = i + 2) {
            cnt = 0;
            // 入力されたプロパティが存在するかどうか判定
            $.each(stage, function(index, p) {
                if(input[i].value == "") {
                    property = "Empty";
                    return;
                } else if(input[i].value == p) {
                    return;
                }

                cnt++;
                property = input[i].value;
            });

            // for文が回りきったら今回は必要のないプロパティとみなす
            if(stage.length == cnt) {
                return [false, {"error" : property + "は不必要なプロパティです。"}];
            } else if(property == "Empty") {
                return [false, {"error" : "全て入力してください。"}];
            }

            // 判定に使うための文字列を作成
            var regexp;

            if(input[i].value == "transform") {
                for(key in answer[input[i].value]) {
                    regexp = new RegExp(reg[input[i].value][key], 'g');
                }
            } else {
                regexp = new RegExp(reg[input[i].value], 'g');
            }

            // プロパティに与えられた値が正しいか判定
            if(input[i + 1].value == "") {
                return [false, {"error" : input[i].value + "の値が空です。"}];
            } else if(!input[i + 1].value.match(regexp)) {
                return [false, {"error" : input[i].value + "の値が不正です。"}];
            }

            // ここまで来たら今回使用される正しいプロパティなので配列へ格納する
            result_array[input[i].value] = input[i + 1].value;
        }

        // プロパティの被りを省く
        for(key in result_array) {
            result.push(key);
        }

        return [result, result_array];
    }

    /* --------------------------------------- */
    /*      正解の値が入力されているか判定
    /* --------------------------------------- */
    function clearJudge(result, stage, sub) {
        var reg = new RegExp('[^0-9]', 'g');
        var clearFlg = true;
        var error_msg = {};

        // 被りがある値をこの時点で省いているので、値を比較して異なっていたらプロパティが重複しているとみなす
        if(result[0].length != stage.length) {
            clearFlg = false;
            error_msg["LengthError"] = "※重複しているプロパティが存在します。";
        }

        // 答えと入力された値を正規表現で判定する
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
                    var border_width = result[1][key].replace(/[ ]/g, '').split("px");

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
                        clearFlg = false;
                        error_msg["OpacityError"] = "※半透明にしてください。";
                    }
                    break;
                case "filter":
                    var filter_offset = result[1][key].replace(/drop-shadow/g, '').replace(/[() ]/g, '').split("px");
                    filter_offset.pop();

                    if(filter_offset[0] != answer["filter"] || filter_offset[1] != answer["filter"]) {
                        clearFlg = false;
                        error_msg["FilterError"] = "※影の位置が違います。";
                        break;
                    }
                    break;
                case "transform":
                    for(key_ in answer["transform"]) {
                        switch(key_) { 
                            case "rotate":
                                if(Number(result[1][key].replace(/[^0-9]/g, '')) != answer["transform"][key_]) {
                                    clearFlg = false;
                                    error_msg["RotateError"] = "※傾きの角度が違います。";
                                }
                                break;
                            case "translate":
                                var translate_offset = String(result[1][key]).replace(/translate/g, '').replace(/[() ,]/g, '').split("px");
                                translate_offset.pop();

                                if(translate_offset[0] != answer["transform"][key_]["x"] || translate_offset[1] != answer["transform"][key_]["y"]) {
                                    clearFlg = false;
                                    error_msg["TranslateError"] = "※オブジェクトの位置が違います。";
                                }
                                break;
                            case "scale":
                                var scale_array = String(result[1][key]).replace(/scale/g, '').replace(/[() ]/g, '').split(",");

                                if(scale_array[0] != answer["transform"][key_]["x"] || scale_array[1] != answer["transform"][key_]["y"]) {
                                    clearFlg = false;
                                    error_msg["ScaleError"] = "※指定した倍率が違います。";
                                }
                                break;
                        }
                    }
                    break;
                case "background":
                    var background_array = result[1][key].replace(/linear-gradient/g, '').replace(/[() ]/g, '').split(",");

                    if(background_array[0] == answer[key]["color_3"][0]) {
                        
                    } else if(background_array[0] == answer[key]["color_6"][0]) {

                    } else {
                        clearFlg = false;
                        error_msg["BackgroundError"] = "※指定した色が間違っています。";
                    }

                    if(background_array[1] == answer[key]["color_3"][1]) {
                        
                    } else if(background_array[1] == answer[key]["color_6"][1]) {

                    } else {
                        clearFlg = false;
                        error_msg["BackgroundError"] = "※指定した色が間違っています。";
                    }
                    break;
            }
        }

        // クリアした場合タイマーを止めてNextボタンを出現させる
        // TODO 要調整
        if(clearFlg) {
            $(".modal").css("display", "block");
            $("#main-body").css("filter", "blur(8px)");
            
            clearInterval(timer);

            // 履歴にタイムを格納する
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

    /* --------------------------------------- */
    /*              画面を初期化
    /* --------------------------------------- */
    // TODO 要調整
    function init() {
        answer = {
            "width":"",
            "height":"",
            "filter":"",
            "opacity":"",
            "transform":"",
            "background":"",
        };
        time = 0;

        $('.question-text').empty();
        $('.input-css').empty();
        $('#object').removeAttr('style');

        createQuestion();
    }
});
