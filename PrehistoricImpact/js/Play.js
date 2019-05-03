//Play state
var player;
var flyingObjects; //holds FlyingObjects (aka boosters and obstacles)
var playerVelocity = 150;
var upPressVelocity = -200;
var downPressVelocity = 300;
//for boosts and crashes
var playerFalling;
var playerBoosting;

//crash vars
var collidedObstacles; //a group that holds all flyingObjects player has SLAMMED into
var fallTimeStart;
var fallDuration = 500;
var fallingVelocity = 400;

//boost vars
var boostVelocity = -1000;
var boostTimeStart;
var boostDuration = 800;

//for generation
var obstacleToBoostRatio = .8;

var ground; 
var foreground;
var background; 

var cursors;

//spawning FlyingObject vars\
var gameBottom; 
var sectorOne; //bottom half of sky 
var sectorTwo; //top half of sky
var sectorThree; //bottom half of atmosphere
var sectorFour; //top half of atmo
var sectorFive; //all of space

var Play = function (game) { };
Play.prototype = {

    this: generateFlyingObjectTimer = 0,

    create: function () {
        //TOLL worl
        game.world.setBounds(0, -5000, game.world.width + 100, game.world.height + 10000);
        gameBottom = game.world.height/2 + game.world.centerY; //is this already a var in world...

        //initialize score for state changes
        score = 0;

        //initialize spawn vars
        var sectorDivision = game.world.height/3 * 2 / 4; //i have a chart for this ok
        sectorOne = gameBottom - sectorDivision;
        sectorTwo = sectorOne - sectorDivision;
        sectorThree = sectorTwo - sectorDivision;
        sectorFour = sectorThree - sectorDivision; 
        sectorFive = sectorThree - game.world.height/3;

        //start the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //add the background (must add it first, so that it's behind everything)
        game.add.sprite(0, game.world.centerY - game.world.height/2, 'background');

        //Create ground (Earth)
        ground = game.add.sprite(0, game.world.height/2 + game.world.centerY - 64, 'ground');
        ground.scale.setTo(2, 2); 
        game.physics.arcade.enable(ground);
        //tilesprite / parallax stuff from:
        //https://www.joshmorony.com/how-to-create-a-parallax-background-in-phaser/ bless
        background = this.game.add.tileSprite(0, 
            game.world.height/2 + game.world.centerY - 240, 
            game.world.width, 
            game﻿.cache.getImage('sprites', true).frameData.getFrameByName('hills').width, 
            'sprites', 'hills'
        );

        //add player (between foreground and background)
        player = new Player(this.game, 'player');
        player.body.velocity.y = playerVelocity;
        game.add.existing(player);
        game.camera.follow(player);
        player.animations.play('fly', 30, true);

        //Create flyingObjects
        flyingObjects = game.add.group();
        collidedObstacles = game.add.group(); //flyingObjects that have been crashed into

        foreground = this.game.add.tileSprite(0, 
            game.world.height/2 + game.world.centerY - 215, 
            game.world.width, 
            game﻿.cache.getImage('sprites', true).frameData.getFrameByName('foreground').width, 
            'sprites', 'foreground'
        );

        //This is for different enemies

    },

    update: function () {
        //parallax on bottom
        background.tilePosition.x -= 7;
        foreground.tilePosition.x -= 10;

        //generate flyingObjects
        if (game.time.now > generateFlyingObjectTimer) {
            generateFlyingObjectTimer = game.time.now + 500;

            //create boost OR obstacle
            var flyingObject;   
            if (Math.random() >= obstacleToBoostRatio)
                flyingObject = new FlyingObject(this.game, 'updraft', 0, "boost", playerBoosting);
            else {
                var key = this.getFlyingObject(player.position.y);
                flyingObject = new FlyingObject(this.game, key, 0, "obstacle", playerBoosting);
            }

            flyingObject.scale.setTo(.5, .5); 
            game.add.existing(flyingObject);
            //console.log("obstacle position: " + flyingObject.position.x + " " + flyingObject.position.y);
            //THIS IS TO CLEAN UP THE GROUP
            //so that there the group isn't a list into the thousands like 5 minutes in the game slowing shit down
            flyingObjects.setAll('checkWorldBounds', true);
            flyingObject.events.onOutOfBounds.add(this.removeFromGroup, this, 0, flyingObjects);
            flyingObjects.add(flyingObject);
        }
        
        // console.log(ground.position.x + " " + ground.position.y);
        // console.log("player: " + player.position.y + " " + player.position.x)
        // console.log("WORLD TOP / BOTTOM: " + game.world.top + " " + game.world.bottom + " "+ game.world.centerY);
        // console.log("WORLD: " + game.world.x + ", " + game.world.y + " width:" + game.world.width + " height:" + game.world.height);
        //console.log("BOUNDS: " + game.world.bounds.left + ", " + game.world.bounds.top + " " + game.world.bounds.bottom + " " + game.world.bounds.right);
        //console.log("CAMERA: " + game.camera.x + ", " + game.camera.y + " height:" + game.camera.height + " width: " + game.camera.width);

        //crash into flyingObjects
        if (!playerFalling && !playerBoosting) {
            player.angle = 0; //reset
            game.physics.arcade.overlap(player, flyingObjects, this.crashWithFlyingObject, null, this); 
        }

        //crash into ground, game over. 
        game.physics.arcade.overlap(player, ground, this.gameOver, null, this);
        
        //crashed flyingObjects spin
        collidedObstacles.forEach(function(obstacle) {
            if (obstacle.position.y > game.camera.height + game.camera.y) // if it's fallen out of bounds, remove
                collidedObstacles.remove(obstacle);
            obstacle.rotation += .05;
        }, this);

        if (playerFalling) {
            if (game.time.now > fallTimeStart + fallDuration) {
                playerFalling = false;
                player.body.velocity.y = playerVelocity;
                //player.body.gravity.y = 0;
            }
        }

        //BOOST THA PLAYER
        if (playerBoosting) {
            if  (game.time.now > boostTimeStart + boostDuration) {
                playerBoosting = false;
                player.body.velocity.y = playerVelocity;
                //player.body.gravity.y = 0;
            }
        }

        //---------------------CONTROLS-----------------------//
        if (!playerFalling && !playerBoosting) { 

            //if press up, y velocity of obstacles should slow down - player "falling" slowly
            if (cursors.up.isDown) {
                player.body.velocity.y = upPressVelocity;
            }

                //if down, y velocity should speed up
            else if (cursors.down.isDown) {
                player.body.velocity.y = downPressVelocity;
            }

            else if (cursors.down.isUp && cursors.up.isUp) {
                player.body.velocity.y = playerVelocity;
            }
        }
        //---------------------------------------------------//
    },

    render: function() {
        // game.debug.body(player);

        // flyingObjects.forEachAlive(function renderGroup(member) {    game.debug.body(member);}, this);
    },

    //for collisions between obstacle and player
    crashWithFlyingObject: function (player, flyingObject) {
        //if flyingObject an actual obstacle, knock player down
        if (flyingObject.typeOf == "obstacle") {
            //OBSTACLE is knocked back and falls while spinning
            flyingObjects.remove(flyingObject);
            game.add.existing(flyingObject);

            //"animation"
            flyingObject.body.gravity.y = 800; 
            flyingObject.body.velocity.y = -200; 
            flyingObject.body.velocity.x = 40;
            flyingObject.anchor.x = 0.5;
		    flyingObject.anchor.y = 0.5;
    
            //group stuff for FUCKING spinning there must be a better way to do this  
            collidedObstacles.add(flyingObject); // for spin ACTION

            //PLAYER is knocked down a lil
            playerFalling = true;
            player.body.velocity.y = fallingVelocity;
            fallTimeStart = game.time.now;
            player.angle = 30;

            //player.body.gravity.y = -20;
        }
        
        else { // obstacle is a boost, BOOST THA PLAYER 
            playerBoosting = true;
            boostTimeStart = game.time.now;
            player.body.velocity.y = boostVelocity;
            player.angle = -90;

            //player.body.gravity.y = 500; //this is for linear interpolation "smoothing" effect 
            //without actually having to think about linear interpolation
        }
    },

    //for flyingObjects cleanup
    removeFromGroup: function (obstacle, group) {
        group.remove(obstacle, true);
    },

    gameOver: function(player, ground) {
        game.state.start('GameOver');
    },

    //returns the sprite key for the FlyingObject that should spawn
    //basically at each sector, different sprites have different probs of spawning
    //this does the probability and selects one
    getFlyingObject: function(height) {
        var littleflyer = new this.FlyingObjWithSpawnProb("littleflyer", 7);
        var greenflyer = new this.FlyingObjWithSpawnProb("greenflyer", 3);
        var bigflyer = new this.FlyingObjWithSpawnProb("bigflyer", 3);
        var tornado = new this.FlyingObjWithSpawnProb("tornado", 3);
        var storm = new this.FlyingObjWithSpawnProb("storm", 4);
        var redship = new this.FlyingObjWithSpawnProb("redship", 5);
        var spaceship = new this.FlyingObjWithSpawnProb("spaceship", 5);
        if (height > sectorOne) {
            return this.getWeightedRandom([littleflyer, greenflyer]);
        }
        else if (height > sectorTwo) {
            littleflyer.probability = 1;
            greenflyer.probability = 7;
            bigflyer.probability = 2;
            return this.getWeightedRandom([littleflyer, greenflyer, bigflyer]);
        }
        else if (height > sectorThree){
            return this.getWeightedRandom([bigflyer, tornado, storm]);
        }
        else if (height > sectorFour){
            tornado.probability = 4;
            storm.probability = 6;
            return this.getWeightedRandom([tornado, storm]);
        }
        else if (height > sectorFive){
            return this.getWeightedRandom([redship, spaceship]);
        }

    },

    //https://stackoverflow.com/questions/43566019/how-to-choose-a-weighted-random-array-element-in-javascript
    //bless stackoverflow our stackoverlords
    getWeightedRandom: function(input) {
        var array = [];
        for (var i = 0; i < input.length; i++) {
            for( var j = 0; j < input[i].spawnProbability; j++ ) {
                    array.push(input[i].key);
            }
        }
        // Probability Fun
        return array[Math.floor(Math.random() * array.length)];
    },

    FlyingObjWithSpawnProb: function(key, probability) {
        this.key = key;
        this.spawnProbability = probability;
    }

}