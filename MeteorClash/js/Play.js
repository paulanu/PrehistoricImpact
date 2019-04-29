//Play state
var player;
var playerFalling;
var playerFallingTimeStart;
var totalFallingTime = 500;
var fallingVelocity = -400;

var cursors;
var obstacles; 
var crashed;
var Play = function (game) { };
Play.prototype = {

    this: generateObstacleTimer = 0,

    create: function () {
        //this is so that once objects COMPLETELY leave the game view they are removed from the group
        //game.world.setBounds(-100, -100, game.world.width + 200, game.world.height + 200);

        //initialize score for state changes
        score = 0;

        //start the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //add the background (must add it first, so that it's behind everything)
        game.add.sprite(0, 0, 'sky');

        //add player 
        player = new Player(this.game, 'dude', 0);
        game.add.existing(player);

        //Create obstacles//
        obstacles = game.add.group();
        crashed = game.add.group(); //obstacles that have been crashed into
    },

    update: function () {
        //generate obstacles
        if (game.time.now > generateObstacleTimer) {
            generateObstacleTimer = game.time.now + 150;
            var obstacle = new Obstacle(this.game, 'baddie', 0, false);
            game.add.existing(obstacle);
            
            //THIS IS TO CLEAN UP THE GROUP
            //so that there the group isn't a list into the thousands like 5 minutes in the game slowing shit down
            obstacles.setAll('checkWorldBounds', true);
            obstacle.events.onOutOfBounds.add(this.removeFromGroup, this, 0, obstacles);
            obstacles.add(obstacle);
        }

        //crash into obstacles
        if (!playerFalling)
            game.physics.arcade.overlap(player, obstacles, this.crashWithObstacle, null, this);

        //crashed obstacles spin
        crashed.forEach(function(crashedObstacle) {
            if (crashedObstacle.position.y > game.world.bounds.bottom) // if it's fallen out of bounds, remove
                crashed.remove(crashedObstacle);
            crashedObstacle.rotation += .05; 
        }, this);

        //if player is falling, MAKE THEM FALL.
        if (playerFalling) {
            if  (game.time.now < playerFallingTimeStart + totalFallingTime) {
                obstacles.forEach(function(obstacle) {
                    obstacle.body.velocity.y = yVelocity + fallingVelocity;
                }, this);
            }
            else {
                changeVelocity(0);
                playerFalling = false; 
            }

        }

    },

      

    //for collisions between obstacle and player
    //player is knocked down a bit, obstacle is knocked back and falls
    crashWithObstacle: function(player, obstacle) {
        //OBSTACLE is knocked back and falls while spinning
        obstacles.remove(obstacle);
        game.add.existing(obstacle);

        //"animation"
        obstacle.body.gravity.y = 800; 
        obstacle.body.velocity.y = -400; 
        obstacle.body.velocity.x = 40;
        obstacle.anchor.x = 0.5;
		obstacle.anchor.y = 0.5;
    
        //group stuff for FUCKING spinning there must be a better way to do this  
        crashed.add(obstacle); // for spin ACTION

        //PLAYER is knocked down a lil
        playerFalling = true;
        playerFallingTimeStart = game.time.now;
    },

    //for obstacles cleanup
    removeFromGroup: function(obstacle, group) {
        group.remove(obstacle, true);
    }
}

var velocityChange = 200;
//0 for reset, 1 for up is being pressed, 2 for down is being pressed
function changeVelocity(option) {

    if (option == 0) {
        this.obstacles.forEach(function(obstacle) {
            obstacle.body.velocity.y = yVelocity;
        }, this);
    }

    else if (option == 1) {
        this.obstacles.forEach(function(obstacle) {
            if (obstacle.body.velocity.y >= yVelocity) {
                obstacle.body.velocity.y = yVelocity - velocityChange;
            }
        }, this);
    }
        
    else if (option == 2) {
        this.obstacles.forEach(function(obstacle) {
            if (obstacle.body.velocity.y <= yVelocity) {
                obstacle.body.velocity.y = yVelocity + velocityChange;
            }
        }, this);
    }
}
