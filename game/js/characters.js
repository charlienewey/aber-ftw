/*jslint browser: true*/
/*global Sprite*/

/* Essentially some horrible JS-hacky way of doing inheritance */
if (typeof Object.create !== 'function') {
    // From 'Javascript: The Good Parts' - pg 22 (Chapter 3: Objects)
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
function Character(sprite, spd) {
    'use strict';
    
    this.sprite = sprite;
    this.spd = spd;
}

// Collision detection using the sprite's native method
Character.prototype.collidingWith = function (other_character, callback) {
    'use strict';
    
    if (this.sprite.collidingWith(other_character.sprite) === true) {
        if (typeof (callback) === 'function') {
            callback();
        }
        return true;
    }
    
    return false;
};

Character.prototype.modifyHealth = function (amount, zeroHealthCallback) {
    'use strict';
    
    this.health += amount;
    
    if ((typeof (zeroHealthCallback) === 'function') &&
            (this.health <= 0)) {
        zeroHealthCallback();
    }
};

/**
 * Player class
 */
function Player(health, turret_sprite) {
    'use strict';
    
    this.health = health;
    this.sprite = turret_sprite;
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
function Enemy(sprite, destroySprite, spd) {
    'use strict';
    
    this.sprite = sprite;
    this.destroySprite = destroySprite;
    this.destroyed = false;
    this.spd = spd;
}

// Set up constructor and prototype inheritance
Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

// Moves the Enemy towards a given Character
Enemy.prototype.stepTowards = function (x, y, ctx, canvas, destroyCallback) {
    'use strict';
    
    if (this.destroyed === false) {
        var x_diff = 0, y_diff = 0;
        if ((this.sprite.x - x) > this.spd) {
            x_diff = -this.spd;
        } else if ((this.sprite.x - x) < 0) {
            x_diff = this.spd;
        }

        if ((this.sprite.y - y) > this.spd) {
            y_diff = -this.spd;
        } else if ((this.sprite.y - y) < 0) {
            y_diff = this.spd;
        }

        // Advance frame
        this.sprite.advanceFrame();
        this.sprite.setRotationTowards(x, y, ctx, canvas);
        this.sprite.move(x_diff, y_diff, ctx, canvas);
    } else {
        this.destroySprite.clear(ctx);
        if (this.destroySprite.curr_frame < this.destroySprite.num_frames) {
            this.destroySprite.draw(ctx);
            this.destroySprite.advanceFrame(true);
        } else {
            this.sprite.x = 0;
            this.sprite.y = 0;
        }
    }
};

Enemy.prototype.destroy = function (ctx) {
    'use strict';
    
    this.destroySprite.x = this.sprite.x;
    this.destroySprite.y = this.sprite.y;
    
    // Fix for collision detection - reset location
    this.sprite.x = 0;
    this.sprite.y = 0;
    
    this.sprite.clear(ctx);
    this.destroyed = true;
};

/**
 * Bullet class
 */
function Bullet(sprite, shoot_from, x, y, ctx, canvas,
                 canvas_left, canvas_top) {
    'use strict';
    
    var dist, rect, x_diff, y_diff;
    
    // Assign sprite
    this.sprite = sprite;
    
    // Centre of sprite
    this.sprite.x = shoot_from.sprite.x + (shoot_from.sprite.frame_width / 2);
    this.sprite.y = shoot_from.sprite.y + (shoot_from.sprite.frame_height / 2);
    
    // Assign speed
    this.spd = 5;
    
    // Rotate towards mouse pointer
    this.sprite.setRotationTowards((x - canvas_left), (y - canvas_top),
                                   ctx, canvas);
    
    // Add differences
    this.x_diff = Math.sin(this.sprite.rotation) * this.spd;
    this.y_diff = -Math.cos(this.sprite.rotation) * this.spd;
}

// Set up constructor and prototype inheritance
Bullet.prototype = Object.create(Character.prototype);
Bullet.prototype.constructor = Bullet;

// Step motion towards pointer
Bullet.prototype.moveStep = function (ctx, canvas) {
    'use strict';
    
    // Clear old image
    this.sprite.clear(ctx);
    
    // Update position
    this.sprite.x += this.x_diff;
    this.sprite.y += this.y_diff;
    
    // Redraw
    this.sprite.advanceFrame();
    this.sprite.draw(ctx);
};
