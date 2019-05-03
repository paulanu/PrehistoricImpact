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

    //handle special animations for obstacles    
    if (key == "tornado") {
        Phaser.Sprite.call(this, game, x, y, 'tornado');
        this.animations.add('spin', [0,1,3]);
        this.animations.play('spin', 15, true);
    }
    else if (key == "storm") {
        Phaser.Sprite.call(this, game, x, y, 'storm');
        this.animations.add('shock');
        this.animations.play('shock', 6, true);
    }
    else
        Phaser.Sprite.call(this, game, x, y, 'sprites', key);
    this.anchor.set(.5,.5);
    //adjust position so they slide into the screen instead of popping in
    if (this.position.y == game.camera.y + game.camera.height) this.position.y += this.height/2;
    else if (this.position.y == game.camera.y) this.position.y -= this.height/2;
    else if (this.position.x == game.camera.width) this.position.x += this.width/2;

    //flyingObjects move left, stay in same y position
    var xVelocity = game.rnd.between(-300, -200);
    game.physics.arcade.enable(this)
    this.body.velocity.x = xVelocity;
    this.body.velocity.y = yVelocity;

    //set that sweet bod
    switch(key) {
      case "redship":
        this.body.setSize(215, 153, 21, 63);
        break;
      case "spaceship":
        this.body.setSize(189, 162, 50, 33);
        break;
      case "tornado":
        this.body.setSize(183, 263, 45, 78);
        break;
      case "storm":
        this.body.setSize(170, 110, 38, 45);
        break;
      case "bigflyer":
        this.body.setSize(664, 104, 43, 46);
        break;
      case "greenflyer":
        this.body.setSize(213, 216, 80, 94);
        break;
      case "littleflyer":
        this.body.setSize( 127, 99, 5, 30);
        break;
      case "updraft":
        this.body.setSize(80, 218, 144, 38);
        break;
    }
}


// explicitly define prefab's prototype (Phaser.Sprite) and constructor (Player)
FlyingObject.prototype = Object.create(Phaser.Sprite.prototype);
FlyingObject.prototype.constructor = FlyingObject;

FlyingObject.prototype.create = function () {
}

