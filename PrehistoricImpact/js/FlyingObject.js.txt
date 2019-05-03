var xVelocity;
var yVelocity = 0;
var FlyingObject;

// FlyingObject prefab constructor function
//isBoost : is this FlyingObject a booster (launches player up)
//spawnTop: should the FlyingObject spawn on the top side of the screen (used for when the player is moving up)
var FlyingObject = function(game, key, frame, typeOf, spawnTop) {
    
    //VARIABLES 
    this.typeOf = typeOf;

    //INITIALIZE
    var x; 
    var y;
    //spawn on top & right of screen)
    if (spawnTop) {
        x = Math.random() < 0.5 ? game.rnd.integerInRange(0, game.world.width) : game.camera.width;
        y;
        if (x == game.camera.width)
            y = game.rnd.integerInRange(game.camera.y, game.camera.height + game.camera.height + game.camera.y);
        else
            y = game.camera.y;
    }

    //spawn flyingObject on right side of screen OR bottom of screen
    else { 
        var x = Math.random() < 0.5 ? game.rnd.integerInRange(0, game.world.width) : game.camera.width;
        var y;
        if (x == game.camera.width)
            y = game.rnd.integerInRange(game.camera.y, game.camera.height + game.camera.y);
        else
            y = game.camera.y + game.camera.height;
    }

    flyingObject = Phaser.Sprite.call(this, game, x, y, 'sprites', key);

    //flyingObjects move left, stay in same y position
    var xVelocity = game.rnd.between(-300, -200);
    game.physics.arcade.enable(this)
    this.body.velocity.x = xVelocity;
    this.body.velocity.y = yVelocity;

}

// explicitly define prefab's prototype (Phaser.Sprite) and constructor (Player)
FlyingObject.prototype = Object.create(Phaser.Sprite.prototype);
FlyingObject.prototype.constructor = FlyingObject;

FlyingObject.prototype.create = function () {
}

