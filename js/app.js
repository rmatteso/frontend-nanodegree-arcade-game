/*
Trying to abstract out as much as possible from the main code - the use of integers all over the place isn't readable and doesn't make for easy manipulation down the line.

user.speed will == tileWidth as long as 1 keypress = 1 tile movement
user.verticalOffset is to place the player sprite in the correct location

the inset properties define the bounding box of the collision relative to the width and height of the image sprite

the offset properties are for the vertical alignment of the image sprite within a tile row

TODO: Add image width/height detection?
*/

var config = {
    user: {
        spriteWidth: 44,
        spriteHeight: 85,
        verticalInsetTop: 0,
        verticalInsetBottom: 0,
        horizontalInsetLeft: 8,
        horizontalInsetRight: 6,
        verticalOffset: 60,
        speed: 1
    },
    enemies: {
        spriteWidth: 132,
        spriteHeight: 79,
        verticalInsetTop: 0,
        verticalInsetBottom: 40,
        horizontalInsetLeft: 25,
        horizontalInsetRight: 3,
        verticalOffset: 32,
    },
    tiles: {
        tileWidth: 100,
        tileHeight: 171,
        tileBase: 52,
        verticalOffset: 83
    }
}

var grid = {
    width: $('canvas').width(),
    height: $('canvas').height(),
    numCols: $('canvas').width() / config.tiles.tileWidth,
    numRows: Math.floor($('canvas').height() / config.tiles.verticalOffset),
    numDangerRows: 4
}

// HELPER VARIABLES

var userStartY = (grid.numRows - 1) * config.tiles.verticalOffset - config.user.verticalOffset;

// it's not the easiest to read, but it centers the user based on the width of the sprite & tiles.
var userStartX = (Math.floor(grid.numCols / 2)) * config.tiles.tileWidth + ((config.tiles.tileWidth / 2) - (config.user.spriteWidth / 2));

// ENEMY CLASS
// TODO: Add directionality
var Enemy = function(x, y, speed, type) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.type = 'lightcycle';
    
    if(type == "rinzler")  {
        this.sprite = 'images/rinzler.png';
        this.speed = this.speed * 2;
        this.type = 'rinzler';
    }else   {
        this.sprite = 'images/lightcycle.png';
    }
};

// ENEMY METHODS

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;

    if (this.x >= grid.width) {
        this.x = (config.enemies.spriteWidth * -1); 
        // TODO: Add delay so enemy doesn't immediately show up again... maybe randomize speed
        if(this.type == 'rinzler')  {
            this.y = (Math.floor(Math.random() * grid.numDangerRows) + 2) * config.tiles.verticalOffset - config.enemies.verticalOffset;
        }
    }

    // Check for collision with enemies or barrier-walls
    checkForCollision(this);
};

// rendering
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// PLAYER CLASS
// TODO : Fight for the user, add abilities?
var Player = function(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.width = config.user.spriteWidth;
    this.height = config.user.spriteHeight;
    
    this.sprite = 'images/flynn.png';
};

// PLAYER METHODS

/*  can't see a purpose for this at the moment.. commented out here and in engine.js
Player.prototype.update = function() { }
*/

// rendering
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// process keyboard input
Player.prototype.handleInput = function(keyPress) {
    switch(keyPress)    {
        case 'up':
            player.y -= config.tiles.verticalOffset * player.speed;
            break;
        case 'down':
            player.y += config.tiles.verticalOffset * player.speed;
            break;
        case 'left':
            player.x -= config.tiles.tileWidth * player.speed;
            break;
        case 'right':
            player.x += config.tiles.tileWidth * player.speed;
            break;
        default:
            // don't do anything
            // TODO: add some player abilities?
    }
};

// evaluate player position
// TODO: add blocked tile support?
var checkForCollision = function(anEnemy) {
    /* 
        Tests the bounding box of the inset rather than the entire image- so you can have things like shadows, reflections etc.
    */
    if(
        (player.x + config.user.horizontalInsetRight) >= (anEnemy.x + config.user.horizontalInsetLeft)
        
        && (player.x + config.user.horizontalInsetLeft) <= anEnemy.x + (config.enemies.spriteWidth - config.enemies.horizontalInsetRight)
        
        && (player.y + config.user.verticalInsetTop) + config.user.spriteHeight >= (anEnemy.y + config.enemies.verticalInsetTop)
        
        && (player.y + config.user.verticalInsetBottom) <= anEnemy.y + (config.enemies.spriteHeight - config.enemies.verticalInsetBottom)
    ){

        // kaboom
        
        //player.x = userStartX;
        player.y = userStartY;
    }

    // check for player reaching top of canvas and winning the game

    if (player.y <= 0) {        
        player.x = userStartX;
        player.y = userStartY;
        
        // clears player sprite from top of canvas
        //ctx.fillStyle = 'white';
        //ctx.fillRect(0, 0, grid.width, config.tiles.tileHeight);

        // advance to next stage and increase difficulty
        stage += 1;        
        nextStage();

    }
    
    // keep player from falling off of the edge of the grid
    if (player.y + player.height > grid.height - player.height ) {
        player.y = userStartY;
    }
    if (player.x > grid.width - player.width) {
        player.x = grid.width - player.width ; 
    }
    if (player.x < 0) {
        player.x = 0;
    }
};

// TODO: remove slower bikes as the game gets harder, add blocked tiles.
var nextStage = function() {
    $('#stage').text('Stage: ' + stage);
    
    for (var i = 0; i <= Math.floor(stage/2)+1; i++) {
        var y = ((Math.floor(Math.random() * grid.numDangerRows) + 2) * config.tiles.verticalOffset) - config.enemies.verticalOffset;
        
        var speed = Math.floor(Math.random() * 200 + 50);
        // starts the enemy off the canvas to the left
        var enemy = new Enemy((config.enemies.spriteWidth * -1), y, speed);
        allEnemies.push(enemy);
    }
    if(stage == 5)  {
        var speed = Math.floor(Math.random() * 150 + 100);
        var rinzler = new Enemy((config.enemies.spriteWidth * -1), y, speed, 'rinzler');
        allEnemies.push(rinzler);
    }
    
    //win condition
    if(stage == 7)  {
        alert('You win!')
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
// Enemy randomly placed vertically within section of canvas

// stage 1 starts with a single opponent
var stage = 1;

var enemy = new Enemy((config.enemies.spriteWidth * -1), ((Math.floor(Math.random() * grid.numDangerRows) + 2) * config.tiles.verticalOffset) - config.enemies.verticalOffset, Math.random() * 200 + 50);

var allEnemies = [enemy];

var player = new Player(
    userStartX,
    userStartY,
    config.user.speed
);

// PLAYER INPUT HANDLE
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
