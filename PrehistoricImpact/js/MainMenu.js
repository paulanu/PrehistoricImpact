
//defining them sweet Mainmenu state
var MainMenu = function (game) { };
MainMenu.prototype = {

    //load all assets
    preload: function () {
        console.log("In MainMenu Preload");
        // game.load.image('sky', 'assets/img/sky.png');
        // game.load.image('ground', 'assets/img/platform.png');
        // game.load.image('star', 'assets/img/star.png');
        // game.load.image('diamond', 'assets/img/diamond.png');
        // game.load.image('background', 'assets/img/hills.png');
        // game.load.image('foreground', 'assets/img/foreground.png');
        // game.load.spritesheet('dude', 'assets/img/dude.png', 32, 48);
        // game.load.spritesheet('baddie', 'assets/img/baddie.png', 32, 32);
        // //https://www.zapsplat.com/sound-effect-category/game-sounds/page/12/ bubble pop 33
        // game.load.audio('collectSound', 'assets/audio/bubble.mp3');

        //sprite atlas
        game.load.atlasJSONHash('sprites', 'assets/img/allsprites.png','assets/img/spritejson.json');
        
        //i couldn't figure out how to load animations from a sprite atlas, forgive me
        game.load.spritesheet('player', 'assets/img/player.png', 241, 202, );
        game.load.spritesheet('storm', 'assets/img/storm.png', 241, 202, 3);
        game.load.spritesheet('tornado', 'assets/img/tornado.png', 244, 375, 4);

        //ok i just didn't feel like redoing the atlas for the below sprite
        game.load.image('background', 'assets/img/background.png');

    },

    //display title and instructions 
    create: function () {
        var titleStyle = { font: "bold 55px Arial", fill: "#808080", align: "left", wordWrap: true, wordWrapWidth: game.world.width };
        var textStyle = { font: "bold 50px Arial", fill: "#fff", align: "left", wordWrap: true, wordWrapWidth: game.world.width - 20 };
        var text = game.add.text(10, 50, "S T A R" + "\n" + "C O L L E C T O R", titleStyle);
        text.addFontStyle('italic', 0);
        text = game.add.text(10, 200, "Arrow keys to move. Collect all the stars. Don't touch the enemies."
            + "\n\n" + "Press ENTER to begin", textStyle);
        text.addFontStyle('italic', 0);
    },

    //player input to enter play state
    update: function () {
        if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
            game.state.start('Play');
        }
    }
}
