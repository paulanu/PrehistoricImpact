// Player prefab constructor function
var player;
var cursors;

function Player(game, key, frame) {

    player = Phaser.Sprite.call(this, game, 150, game.world.centerY, key, frame);
    game.physics.arcade.enable(this) //enable physics on player

    //player physics properties
    this.body.collideWorldBounds = true;

    //player animations
    this.animations.add('left', [0, 1, 2, 3], 10, true);
    this.animations.add('right', [5, 6, 7, 8], 10, true);

    cursors = game.input.keyboard.createCursorKeys();
}

// explicitly define prefab's prototype (Phaser.Sprite) and constructor (Player)
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;


Player.prototype.create = function () {
}

// override Phaser.Sprite update (to spin the object)
Player.prototype.update = function () {

    //---------------------CONTROLS-----------------------//
    if (!playerFalling) { 

        //changeVelocity(0); //reset velocity

        //if press up, y velocity of obstacles should slow down - player "falling" slowly
        if (cursors.up.isDown) {
            changeVelocity(1);
        }

        //if down, y velocity should speed up
        else if (cursors.down.isDown) {
            changeVelocity(2);
        }

        else if (cursors.down.isUp && cursors.up.isUp) {
            changeVelocity(0);
        }
    }
    //---------------------------------------------------//
}