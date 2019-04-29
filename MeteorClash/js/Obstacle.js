//adapted from nathan's code shown in class
var rotation;
var xVelocity;
var yVelocity = -150;
var obstacle;

// Obstacle prefab constructor function
function Obstacle(game, key, frame) {
    
    //create obstacle on right side of screen OR bottom of screen
    var x = Math.random() < 0.5 ? game.rnd.integerInRange(0, game.world.width) : game.world.width;
    var y;
    if (x == game.world.width)
        y = game.rnd.integerInRange(0, game.world.height);
    else
        y = game.world.height;
    obstacle = Phaser.Sprite.call(this, game, x, y, key, frame);

    //obstacles move left, stay in same y position
    var xVelocity = game.rnd.between(-300, -200);
    game.physics.arcade.enable(this)
    this.body.velocity.x = xVelocity;
    this.body.velocity.y = yVelocity;

}

// explicitly define prefab's prototype (Phaser.Sprite) and constructor (Player)
Obstacle.prototype = Object.create(Phaser.Sprite.prototype);
Obstacle.prototype.constructor = Obstacle;

Obstacle.prototype.create = function () {
}

