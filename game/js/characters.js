/*jslint browser: true*/
/*global Sprite*/

/* Essentially some horrible JS-hacky way of doing inheritance */
if (typeof Object.create !== 'function') {
    // From "Javascript: The Good Parts" - pg 22 (Chapter 3: Objects)
    Object.create = function (o) {
        'use strict';
        
        var F = function () {};
        F.prototype = o;
        return new F();
    };
}

/**
 * Base Character class
 */
function Character(health, sprite, spd) {
    'use strict';
    
    this.health = health;
    this.sprite = sprite;
    this.spd = spd;
}

// Collision detection using the sprite's native method
Character.prototype.collidingWith = function (other_character) {
    'use strict';
    
    if (this.sprite.collidingWith(other_character.sprite)) {
        return true;
    }
    
    return false;
};

/**
 * Player class
 */
function Player(health, sprite) {
    'use strict';
    
    this.health = health;
    this.sprite = sprite;
    this.spd = 3; // Default speed!
}

// Set up constructor and prototype inheritance
Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

// Centres the player on the screen
Player.prototype.centrePlayer = function (canvas, ctx) {
    'use strict';
    this.sprite.x = (canvas.width - this.sprite.frame_width) / 2;
    this.sprite.y = (canvas.height - this.sprite.frame_height) / 2;
    this.sprite.draw(ctx);
}


/**
 * Enemy class
 */
function Enemy(health, sprite, spd) {
    'use strict';
    
    this.health = health;
    this.sprite = sprite;
    this.spd = spd;
}

// Set up constructor and prototype inheritance
Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

// Moves the Enemy towards a given Character
Enemy.prototype.moveTowards = function (character, ctx, canvas) {
    'use strict';
    
    // Move "this.sprite" towards "character.sprite"
    var x = 0, y = 0;
    if ((this.sprite.x - character.sprite.x) > this.spd) {
        x = -this.spd;
    } else if ((this.sprite.x - character.sprite.x) < 0) {
        x = this.spd;
    }
    
    if ((this.sprite.y - character.sprite.y) > this.spd) {
        y = -this.spd;
    } else if ((this.sprite.y - character.sprite.y) < 0) {
        y = this.spd;
    }
    
    // Random walk to add a little unpredictability
    var walk = Math.random();
    if (walk <= 0.25) {
        y += Math.floor(Math.random() * this.spd);
    } else if (walk <= 0.50) {
        y -= Math.floor(Math.random() * this.spd);
    } else if (walk <= 0.75) {
        x += Math.floor(Math.random() * this.spd);
    } else {
        x -= Math.floor(Math.random() * this.spd);
    }
    
    this.sprite.move(x, y, ctx, canvas);
};