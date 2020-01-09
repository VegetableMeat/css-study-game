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

 


    //ゲーム画面　ゲーム結果モーダルウィンドウ　経験値ゲージアニメーション
    function getExpAnimation(getExp){
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



    //ゲーム中の画面遷移などによるゲーム中断処理
    var linkUrl;
    $("#game .profile a").click(function(e){
        linkUrl = $(this).attr('href');
        discontinue(e,linkUrl);
    });
    $("#game .exit a").click(function(e){
        linkUrl = $(this).attr('href');
        discontinue(e,linkUrl);
    });
    $("#game header .center a").click(function(e){
        linkUrl = $(this).attr('href');
        discontinue(e,linkUrl);
    });
    function discontinue(e,linkUrl){
        e.preventDefault();
        swal({
            title: "注意",
            text: "画面を離れるとゲームが中断され、ゲームの再開や経験値の獲得ができません。\nよろしいですか？",
            icon: "warning",
            buttons: true,
            dangerMode: true,
            })
            .then((move) => {
            if (move) {
                action();
            } else {
                
            }
            });
        
        function action() {
            location.href = linkUrl;
        }
        setTimeout(action,999999);
    }


    const errorMessage = {
        "existId" : "*既に使用されているユーザーIDが入力されています。",
        "retypeDismatchPw" : "*再入力のパスワードが異なっています。",
        "unregisterId" : "*入力されたユーザーIDは登録されていません。",
        "diffPw" : "*パスワードが違います。",
        "badId" : "*ユーザーIDに不正な文字が使用されています。英数字のみで入力してください。",
        "longId" : "*ユーザーIDの文字数が超過しています。〜文字以内で入力してください。",
        "shortId" : "*ユーザーIDの文字数が少なすぎます。～文字以上で入力してください。",
        "badPw" : "*パスワードに不正な文字が使用されています。英数字のみで入力してください。",
        "longPw" : "*パスワードの文字数が超過しています。〜文字以内で入力してください。",
        "shortPw" : "*パスワードの文字数が少なすぎます。～文字以上で入力してください。"
    };
    const errorInput = {
        "existId" : "user-id",
        "retypeDismatchPw" : "user-pw-2",
        "unregisterId" : "user-id",
        "diffPw" : "user-pw-1",
        "badId" : "user-id",
        "longId" : "user-id",
        "shortId" : "user-id",
        "badPw" : "user-pw-1",
        "longPw" : "user-pw-1",
        "shortPw" : "user-pw-1"
    }
    var errorFlg = {
        "existId" : false,
        "retypeDismatchPw" : false,
        "unregisterId" : false,
        "diffPw" : false,
        "badId" : false,
        "longId" : false,
        "shortId" : false,
        "badPw" : false,
        "longPw" : false,
        "shortPw" : false
    };
    var allErrorFlg = false;
    var errorMessageHtml = "";

    //登録ボタン押下後の処理
    $(".register-button").click(function(){
        //初期化
        errorMessageHtml = "";
        allErrorFlg = false;
        for(key in errorFlg){
            errorFlg[key] = false;
            $("." + errorInput[key] + " input").css("border", "solid 1px white");
        }

        //入力チェック
        
        //テストエラーフラグ
        errorFlg["badId"] = true;
        errorFlg["longPw"] = true;

        for(key in errorFlg){
            if(errorFlg[key] === true){
                allErrorFlg = true;
                errorMessageHtml = errorMessageHtml + errorMessage[key] + "\n\n";

                $("." + errorInput[key] + " input").css("border", "solid 1px red");
            }
        }
        if(allErrorFlg === false){
            //エラーがなかった場合の処理
            window.location.href = "front.html";
        }else{
            //エラーがあった場合の処理
            //モーダルウィンドウでエラーメッセージ表示
            swal({
                title: "Error!",
                text: errorMessageHtml,
                icon: "warning"
                })
                .then((ok) => {
                if (ok) {
                    
                } else {
                    
                }
            });
        }
    });
});

