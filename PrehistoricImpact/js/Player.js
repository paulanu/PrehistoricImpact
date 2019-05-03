// Player prefab constructor function
var player;
var cursors;

function Player(game, key) {

    player = Phaser.Sprite.call(this, game, 150, game.world.centerY, 'player');
    game.physics.arcade.enable(this) //enable physics on player

    this.animations.add('fly', [0,1,2]);
    this.body.setSize(63, 63, 115, 110);
    this.anchor.set(.5,.5);
    cursors = game.input.keyboard.createCursorKeys();
}

// explicitly define prefab's prototype (Phaser.Sprite) and constructor (Player)
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;


Player.prototype.create = function () {
}

// override Phaser.Sprite update (to spin the object)
Player.prototype.update = function () {
}
