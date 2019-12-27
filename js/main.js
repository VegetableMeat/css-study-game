window.addEventListener('load', () => {
    const canvas_user = new Canvas('user');
    const canvas_answer = new Canvas('answer');

    const game = new Game();
    game.add(0);
});

class Canvas {
    constructor(canvas_config) {
        this.canvas = document.getElementById(canvas_config);
        this.canvas.style.width = 200 + 'px';
        this.canvas.style.height = 200 + 'px';
    }

    setStyle() {
        
    }
}

class Game {
    getAnswer() {

    }

    add(num) {
        var stage_data = [
            { id: 'width,height' },
            { id: 'width,height,color' },
        ];
        
        // console.log(stage_data[num].id.split(','));
        var tag = stage_data[num].id.split(',');

        // tag.some(t => {

        // });
    }
}
