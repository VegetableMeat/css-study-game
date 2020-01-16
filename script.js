$(function () {

    //１レベルごとに必要な経験値
    const levelUpExp = 1000;
    //合計獲得経験値（仮データ）
    var totalExp = 1800;



    $(".html-tab").click(function () {
        $(".html-tab").css("background-color", "rgb(90, 90, 90)");
        $(".css-tab").css("background-color", "rgb(70, 70, 70)");
        $(".html-tab span").css("opacity", "1");
        $(".css-tab span").css("opacity", "0.5");
        $(".code-area .html").css("display", "block");
        $(".code-area .css").css("display", "none");
    });
    $(".css-tab").click(function () {
        $(".css-tab").css("background-color", "rgb(90, 90, 90)");
        $(".html-tab").css("background-color", "rgb(70, 70, 70)");
        $(".css-tab span").css("opacity", "1");
        $(".html-tab span").css("opacity", "0.5");
        $(".code-area .html").css("display", "none");
        $(".code-area .css").css("display", "block");
    });




    //ゲーム中の画面遷移などによるゲーム中断処理
    var linkUrl;
    $("#game .profile a").click(function (e) {
        linkUrl = $(this).attr('href');
        discontinue(e, linkUrl);
    });
    $("#game .exit a").click(function (e) {
        linkUrl = $(this).attr('href');
        discontinue(e, linkUrl);
    });
    $("#game header .center a").click(function (e) {
        linkUrl = $(this).attr('href');
        discontinue(e, linkUrl);
    });
    function discontinue(e, linkUrl) {
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
        setTimeout(action, 999999);
    }

    const errorMessage = {
        "existId": "*既に使用されているユーザーIDが入力されています。",
        "retypeDismatchPw": "*再入力のパスワードが異なっています。",
        "unregisterId": "*入力されたユーザーIDは登録されていません。",
        "diffPw": "*ユーザー名、またはパスワードが違います。",
        "badId": "*ユーザーIDに不正な文字が使用されています。英数字のみで入力してください。",
        "longId": "*ユーザーIDの文字数が超過しています。30文字以内で入力してください。",
        "shortId": "*ユーザーIDの文字数が少なすぎます。6文字以上で入力してください。",
        "badPw": "*パスワードに不正な文字が使用されています。英数字のみで入力してください。",
        "longPw": "*パスワードの文字数が超過しています。30文字以内で入力してください。",
        "shortPw": "*パスワードの文字数が少なすぎます。6文字以上で入力してください。"
    };
    const errorInput = {
        "existId": "user-id",
        "retypeDismatchPw": "user-pw-2",
        "unregisterId": "user-id",
        "diffPw": "user-pw-1",
        "badId": "user-id",
        "longId": "user-id",
        "shortId": "user-id",
        "badPw": "user-pw-1",
        "longPw": "user-pw-1",
        "shortPw": "user-pw-1"
    }
    var errorFlg = {
        "existId": false,
        "retypeDismatchPw": false,
        "unregisterId": false,
        "diffPw": false,
        "badId": false,
        "longId": false,
        "shortId": false,
        "badPw": false,
        "longPw": false,
        "shortPw": false
    };

    const apiUrl = "http://126.60.26.165:80";
    var allErrorFlg = false;
    var errorMessageHtml = "";

    /**
     * 新規登録ボタン押下時に実行
     */
    $(".register-button").click(function () {
        const button = $(this);
        const userID = $('[type=text]').val();
        const password = $('.user-pw-1').find('[type=password]').val();
        const retypePassword = $('.user-pw-2').find('[type=password]').val();

        button.attr("disabled", true);

        resetError();
        vaidRegister(userID, password, retypePassword);
        errorFlagCheck();

        //エラーがなかった場合の処理
        if (allErrorFlg === false) {
            // 各フォームから値を取得してJSONデータを作成
            let data = {
                user_id: userID,
                password: password
            };

            // WebAPIアクセス実行
            $.ajax({
                type: "post",
                url: `${apiUrl}/signup`,
                data: JSON.stringify(data),
                contentType: 'application/json',
                dataType: "json",
                async: false,
            })
                .done(function (result) {
                    errorFlg["diffPw"] = false;
                    localStorage.setItem('token', result.token)
                    window.location.href = "front.html";
                }).fail(function () {
                    errorFlg["diffPw"] = true;
                    errorFlagCheck();
                    errorDisplay();
                });
        } else {
            errorDisplay();
        }

        button.attr("disabled", false)
    });

    /**
     * ログインボタン押下時に実行
     */
    $(".login-button button").click(function () {
        const button = $(this);
        const userID = $('[type=text]').val();
        const password = $('.user-pw-1').find('[type=password]').val();

        button.attr("disabled", true);

        resetError();
        vaidLogin(userID, password);
        errorFlagCheck();

        //エラーがなかった場合の処理
        if (allErrorFlg === false) {
            // 各フォームから値を取得してJSONデータを作成
            let data = {
                user_id: userID,
                password: password
            };

            // WebAPIアクセス実行
            $.ajax({
                type: "post",
                url: `${apiUrl}/login`,
                data: JSON.stringify(data),
                contentType: 'application/json',
                dataType: "json",
                async: false,
            })
                .done(function (result) {
                    errorFlg["diffPw"] = false;
                    localStorage.setItem('token', result.token)
                    localStorage.setItem('id', userID)
                    window.location.href = "front.html";
                })
                .fail(function () {
                    errorFlg["diffPw"] = true;
                    errorFlagCheck();
                    errorDisplay();
                });
        } else {
            errorDisplay();
        }

        button.attr("disabled", false)
    });

    /**
     * 関数 : エラーフラグとメッセージの初期化
     */
    function resetError() {
        errorMessageHtml = "";
        allErrorFlg = false;
        for (key in errorFlg) {
            errorFlg[key] = false;
            $("." + errorInput[key] + " input").css("border", "solid 1px white");
        }
    }

    /**
     * 関数 : エラーフラグからメッセージを生成
     */
    function errorFlagCheck() {
        for (key in errorFlg) {
            if (errorFlg[key] === true) {
                allErrorFlg = true;
                errorMessageHtml = errorMessageHtml + errorMessage[key] + "\n\n";

                $("." + errorInput[key] + " input").css("border", "solid 1px red");
            }
        }
    }

    /**
     * 関数 : エラーメッセージを表示
     */
    function errorDisplay() {
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

    /**
     * 関数 : 新規登録フォームのValidate
     * @param {string} userID 
     * @param {string} password 
     * @param {string} retypePassword 
     */
    function vaidRegister(userID, password, retypePassword) {
        if (userID.length < 6) {
            errorFlg["shortId"] = true;
        } else {
            errorFlg["shortId"] = false;
            if (userID.length > 30) {
                errorFlg["longId"] = true;
            } else {
                errorFlg["longId"] = false;
                if (!userID.match(/^[A-Za-z0-9]+$/)) {
                    errorFlg["badId"] = true;
                } else {
                    errorFlg["badId"] = false;
                    $.ajax({
                        type: "get",
                        url: `${apiUrl}/user_check/${userID}`,
                        contentType: 'application/json',
                        dataType: "json",
                        async: false,
                    })
                        .done(function (result) {
                            if (result.message == "OK") {
                                errorFlg["existId"] = false;
                            } else {
                                errorFlg["existId"] = true;
                            }
                        })
                        .fail(function () {
                        });
                }
            }
        }

        if (password.length < 6) {
            errorFlg["shortPw"] = true;
        } else {
            errorFlg["shortPw"] = false;
            if (password.length > 30) {
                errorFlg["longPw"] = true;
            } else {
                errorFlg["longPw"] = false;
                if (!password.match(/^[A-Za-z0-9]+$/)) {
                    errorFlg["badPw"] = true;
                } else {
                    errorFlg["badPw"] = false;
                    if (password != retypePassword) {
                        errorFlg["retypeDismatchPw"] = true;
                    } else {
                        errorFlg["retypeDismatchPw"] = false;
                    }
                }
            }
        }
    }

    /**
     * 関数 : ログインフォームのValidate
     * @param {string} userID 
     * @param {string} password 
     */
    function vaidLogin(userID, password) {
        if (userID.length < 6) {
            errorFlg["shortId"] = true;
        } else {
            errorFlg["shortId"] = false;
            if (userID.length > 30) {
                errorFlg["longId"] = true;
            } else {
                errorFlg["longId"] = false;
                if (!userID.match(/^[A-Za-z0-9]+$/)) {
                    errorFlg["badId"] = true;
                } else {
                    errorFlg["badId"] = false;
                }
            }
        }

        if (password.length < 6) {
            errorFlg["shortPw"] = true;
        } else {
            errorFlg["shortPw"] = false;
            if (password.length > 30) {
                errorFlg["longPw"] = true;
            } else {
                errorFlg["longPw"] = false;
                if (!password.match(/^[A-Za-z0-9]+$/)) {
                    errorFlg["badPw"] = true;
                } else {
                    errorFlg["badPw"] = false;
                }
            }
        }
    }

    // ログアウトアイコン押下に実行
    $(".fa-sign-out-alt").click(function () {
        swal({
            title: "確認",
            text: "ログアウトしてもよろしいですか？",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((move) => {
                if (move) {
                    localStorage.removeItem("token")
                    window.location.href = "login.html";
                } else {

                }
            });
    });

    /**
     * 各画面遷移時に実行
     */
    $(document).ready(function () {
        if ("token" in localStorage) {
            const accessToken = localStorage.getItem('token');

            $.ajax({
                type: "get",
                url: `${apiUrl}/play_history/list`,
                contentType: 'application/json',
                dataType: "json",
                async: false,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", accessToken);
                },
            })
                .fail(function () {
                    localStorage.removeItem("token")
                });
        }

        const pageID = document.body.id

        switch (pageID) {
            case "front":
                if (!("token" in localStorage)) {
                    window.location.href = "login.html";
                }
                break;
            case "game":
                if (!("token" in localStorage)) {
                    window.location.href = "login.html";
                }
                break;
            case "profile":
                if (!("token" in localStorage)) {
                    window.location.href = "login.html";
                } else {
                    setProfile();
                }
                break;
            case "login":
                if ("token" in localStorage) {
                    window.location.href = "front.html";
                }
                break;
            case "register":
                if ("token" in localStorage) {
                    window.location.href = "front.html";
                }
                break;
        }
    });

    let playHistories = {};
    let showTimeFlg = new Date()

    /**
     * 関数 : プロフィールの表示
     */
    function setProfile() {
        const accessToken = localStorage.getItem('token');
        $.ajax({
            type: "get",
            url: `${apiUrl}/user/me`,
            contentType: 'application/json',
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", accessToken);
            },
            async: false,
        })
            .done(function (result) {
                console.log(result);
                const nextLevelExp = result.NextExp;
                expBarWidth = (levelUpExp - nextLevelExp) / levelUpExp * 100;
                $("#profile .exp-bar").css("width", expBarWidth + "%");

                $(".level-value").append(`<span>${result.Level}</span>`);
                $(".total-exp").append(`<span>${result.TotalExp}</span>`);
                $(".next-exp").append(`<span>${result.NextExp}</span>`);
                $(".user-id").append(`<p><span>${result.UserID}</span></p>`);
                $(".status").append(`<p><span>${result.Title}</span></p>`);
                if (result.EasyHighScore === "") {
                    $(".easy-mode").append(`<p>初級編 : <span>記録なし</span></p>`);
                } else {
                    $(".easy-mode").append(`<p>初級編 : <span>${result.EasyHighScore}</span></p>`);
                }

                if (result.NormalHighScore === "") {
                    $(".normal-mode").append(`<p>中級編 : <span>記録なし</span></p>`);
                } else {
                    $(".normal-mode").append(`<p>中級編 : <span>${result.NormalHighScore}</span></p>`);
                }

                if (result.HardHighScore === "") {
                    $(".hard-mode").append(`<p>上級編 : <span>記録なし</span></p>`);
                } else {
                    $(".hard-mode").append(`<p>上級編 : <span>${result.HardHighScore}</span></p>`);
                }
            })
            .fail(function () {
                console.log("NG")
            });

        $.ajax({
            type: "get",
            url: `${apiUrl}/play_history/list`,
            contentType: 'application/json',
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", accessToken);
            },
        })
            .done(function (result) {
                playHistories = result
                showTimeFlg.setDate(showTimeFlg.getDate() - 31);
                showPlayHistories();
            });
    }

    // 表示期間切り替え時処理
    $('#period-menu').change(function () {
        showTimeFlg = new Date();
        var selectTime = $('option:selected').val();

        switch (selectTime) {
            case "1":
                showTimeFlg = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
                break;
            case "2":
                showTimeFlg.setDate(showTimeFlg.getDate() - 7);
                break;
            case "3":
                showTimeFlg.setDate(showTimeFlg.getDate() - 31);
                break;
            case "4":
                showTimeFlg.setDate(showTimeFlg.getDate() - 365);
                break;
            case "5":
                showTimeFlg.setFullYear("0")
                break;
        }


        showPlayHistories();
    })

    // プレイ履歴表示の判定と表示処理
    function showPlayHistories() {
        $(".history-list").replaceWith(
            `<div class="history-list">
                <div class="history-none">
                    <div class="history-card">
                        記録なし
                    </div>
                </div>
            </div>`
        );

        for (key in playHistories) {
            const playDay = new Date(playHistories[key].play_date);
            console.log(playDay)
            console.log(showTimeFlg)
            if (playDay >= showTimeFlg) {


                const year = playDay.getFullYear();
                const month = playDay.getMonth() + 1;
                const day = playDay.getDate();

                $(".history-none").remove();

                $(".history-list").append(
                    `<div class="history-card">
                        <div class="play-time">
                            プレイ日時　: <span>${year}年${month}月${day}日</span>
                        </div>
                        <div class="play-mode">
                            ゲームモード: <span>${playHistories[key].game_mode}</span>
                        </div>
                        <div class="goal-time">
                            クリアタイム: <span>${playHistories[key].clear_time}</span>
                        </div>
                        <div class="rank">
                            ランク　　　: <span>${playHistories[key].Rank}</span>
                        </div>
                        <div class="exp-points">
                            獲得経験値　: <span>${playHistories[key].exp}</span>
                        </div>
                    </div>`
                );
            }
        }
    }

});

