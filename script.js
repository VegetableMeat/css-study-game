$(function(){
    var gameCount = 1;
    const gameCountMax = 3;
    var gameCountText = gameCount + "/" + gameCountMax;

    //１レベルごとに必要な経験値
    const levelUpExp = 1000;
    //合計獲得経験値（仮データ）
    var totalExp = 1800;

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
                //ゲーム結果画面出力
                $(".modal-result").css("display", "block");
                $("#main-body").css("filter", "blur(10px)");
                $(".game-header").css("filter", "blur(10px)");

                var getExp = 1500;
                getExpAnimation(getExp);

                
            }else{
                //ステージクリア画面出力
                $(".modal").css("display", "block");
                $("#main-body").css("filter", "blur(10px)");
                $(".game-header").css("filter", "blur(10px)");
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
        $(".game-header").css("filter", "none");
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

    
    //プロフィール画面　経験ゲージアニメーション
    nextLevelExp = totalExp % levelUpExp;
    expBarWidth =  nextLevelExp / levelUpExp * 100;
    $("#profile .exp-bar").css("width", expBarWidth + "%");

 
    
    function getExpAnimation(getExp){
        //ゲーム画面　ゲーム結果モーダルウィンドウ　経験値ゲージアニメーション
        var beforeTotalExp = totalExp;
        var beforeLevel = Math.floor(beforeTotalExp / 1000) * 1;
        var afterTotalExp = totalExp + getExp;
        var afterLevel = Math.floor(afterTotalExp / 1000) * 1;
        nextLevelExp = levelUpExp - afterTotalExp % levelUpExp;
        expBarWidth =  100 - nextLevelExp / levelUpExp * 100;
        $("#game .exp-bar").css("transition", "0s");
        $("#game .exp-bar").css("width", expBarWidth + "%");
        setTimeout(function(){
            $("#game .exp-bar").css("transition", "width 1s ease-in-out");
        }, 500);
        setTimeout(function(){
            if(beforeLevel != afterLevel){
                for(i = afterLevel - beforeLevel; i > 0; i--){
                    
                    $("#game .exp-bar").css("width", "100%");
                    $(".level-up-message").css({"transition" : "0.6s ease-in-out"});
                    setTimeout(function(){
                        $(".level-up-message").css({"opacity" : "1", "transform" : "translateY(-56px)"});
                    }, 1000);
                    setTimeout(function(){
                        $(".level-up-message").css({"transition" : "0s ease-in-out", "opacity" : "0", "transform" : "translateY(-120px)"});
                        $("#game .exp-bar").css("transition", "0s");
                        $("#game .exp-bar").css("width", "0");
                    }, 3000);
                    if(i >= 2){
                        setTimeout(function(){
                            $("#game .exp-bar").css("transition", "width 1s ease-in-out");
                            $("#game .exp-bar").css("width", "100%");
                        }, 3200);
                        setTimeout(function(){
                            $(".level-up-message").css({"transition" : "0.6s ease-in-out", "opacity" : "1", "transform" : "translateY(-56px)"});
                        }, 4200);
                    }else{
                        setTimeout(function(){
                            $(".level-up-message").css({"transition" : "0s ease-in-out", "opacity" : "0", "transform" : "translateY(-120px)"});
                            $("#game .exp-bar").css("transition", "0s");
                            $("#game .exp-bar").css("width", "0");
                        }, 6000);
                        setTimeout(function(){
                            $("#game .exp-bar").css("transition", "width 1s ease-in-out");
                            $("#game .exp-bar").css("width", expBarWidth + "%");
                        }, 6200);
                    }
                }
            }else{
                nextLevelExp = levelUpExp - afterTotalExp % levelUpExp;
                expBarWidth =  nextLevelExp / levelUpExp * 100;
                $("#game .exp-bar").css("width", expBarWidth + "%");
            }
        }, 1000);

        $("#game .level-area .get-exp span").text(getExp);
        $("#game .level-area .total-exp span").text(totalExp + getExp);
        $("#game .level-area .next-exp span").text(nextLevelExp);
    }
});

