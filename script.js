$(function(){
    var gameCount = 1;
    const gameCountMax = 3;
    var gameCountText = gameCount + "/" + gameCountMax;

    //スタートボタン
    $(".start-button button").click(function(){
        $(".start-before-area").css("display","none");
        $(".game-area").css("display","block");
    });

    //実行ボタン
    $(".run-button button").click(function(){
        var clearFlg = true;
        //判定処理
        
        if(clearFlg === true){
            if(gameCount === gameCountMax){
                $(".modal-result").css("display", "block");
                $("#main-body").css("filter", "blur(8px)");
            }else{
                $(".modal").css("display", "block");
                $("#main-body").css("filter", "blur(8px)");
            }
        }else{
            //エラーメッセージ出力処理

        }
        
    });
    $(".game-count span").text(gameCountText);
    $(".next-button button").click(function(){
        gameCount++;
        gameCountText = gameCount + "/" + gameCountMax;
        $(".game-count span").text(gameCountText);
        $(".modal").css("display", "none");
        $("#main-body").css("filter", "none");
    });

    $(".html-tab").click(function(){
        $(".html-tab").css("background-color", "rgb(90, 90, 90)");
        $(".css-tab").css("background-color", "rgb(70, 70, 70)");
        $(".html-tab span").css("opacity", "1");
        $(".css-tab span").css("opacity", "0.5");
        $(".code-area .html").css("display", "block");
        $(".code-area .css").css("display", "none");
    });
    $(".css-tab").click(function(){
        $(".css-tab").css("background-color", "rgb(90, 90, 90)");
        $(".html-tab").css("background-color", "rgb(70, 70, 70)");
        $(".css-tab span").css("opacity", "1");
        $(".html-tab span").css("opacity", "0.5");
        $(".code-area .html").css("display", "none");
        $(".code-area .css").css("display", "block");
    });

    //１レベルごとに必要な経験値
    const levelUpExp = 1000;
    //合計獲得経験値（仮データ）
    var totalExp = 1280;
    var nextLevelExp = totalExp % levelUpExp;
    var expBarWidth = levelUpExp / nextLevelExp * 10;
    $(".exp-bar").css("width", expBarWidth+"%");
});