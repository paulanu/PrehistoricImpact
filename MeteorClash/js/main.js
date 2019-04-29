var game = new Phaser.Game(500, 660, Phaser.AUTO, '');


//GameOver state
var GameOver = function (game) {
};
GameOver.prototype = {
    
    init: function (won, score) {
        this.won = won;
        this.score = score; 
    },

    //display title and instructions 
    create: function () {
        var titleStyle = { font: "bold 55px Arial", fill: "#808080", align: "left", wordWrap: true, wordWrapWidth: game.world.width };
        var textStyle = { font: "bold 50px Arial", fill: "#fff", align: "left", wordWrap: true, wordWrapWidth: game.world.width - 20 };
        var text;
        if (this.won == 0)
            text = game.add.text(10, 50, "GAME WON", titleStyle);
        else
            text = game.add.text(10, 50, "GAME OVER", titleStyle);
        text.addFontStyle('italic', 0);
        text = game.add.text(10, 200, "Score: " + this.score + "\n" + "Try again? [ENTER]", textStyle);
        text.addFontStyle('italic', 0);
    },

    //player input to enter play state
    update: function () {
        if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
            game.state.start('Play');
        }
    }
}

game.state.add('MainMenu', MainMenu)
game.state.add('Play', Play)
game.state.add('GameOver', GameOver)
game.state.start('MainMenu');
