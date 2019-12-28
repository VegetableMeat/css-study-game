$(function() {
    // 追加するElementの個数
    const id = [
        { num: 3 },
    ];
    const game = new Game(id[0]);
});

class Game {
    constructor(data) {
        this.num = data.num;
        this.setElement();
    }

    // input-css要素に指定された個数分子要素を追加
    setElement() {
        for(var i = 0; i < this.num; i++) {
            $('.input-css').append($('<div/>', { class: 'input' }).append($('<input id="input-style-' + i + '">：<input id="input-value-' + i + '">')));
        }
    }
}
