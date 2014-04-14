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
function Character(health, sprite) {
    'use strict';
    
    this.sprite = sprite;
}

// Collision detection using the sprite's native method
Character.prototype.collidingWith = function (other_character, callback) {
    'use strict';
    
    if (this.sprite.collidingWith(other_character.sprite)) {
        if (typeof (callback) === "function") {
            callback();
        }
        return true;
    }
    
    return false;
};

Character.prototype.modifyHealth = function (amount, zeroHealthCallback) {
    'use strict';
    
    this.health += amount;
    
    if ((typeof (zeroHealthCallback) === "function") &&
            (this.health <= 0)) {
        zeroHealthCallback();
    }
};

/**
 * Player class
 */
function Player(health, turret_sprite, barrel_sprite) {
    'use strict';
    
    this.health = health;
    this.sprite = turret_sprite;
    this.barrel = barrel_sprite;
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
};


/**
 * Enemy class
 */
function Enemy(sprite, spd) {
    'use strict';
    
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
    var x = 0, y = 0, walk = Math.random();
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
    
    // Advance frame
    this.sprite.advanceFrame();
    
    this.sprite.setRotationTowards(character.sprite.x,
                                    character.sprite.y,
                                    ctx, canvas);
    
    this.sprite.move(x, y, ctx, canvas);
};