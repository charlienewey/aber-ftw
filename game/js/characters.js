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


// Base class for Player/Enemy
function Character(health) {
    'use strict';
    
    this.health = health;
    this.sprite = null;
}

// Collision detection using the sprite's native method
Character.prototype.collidingWith = function (other_character) {
    'use strict';
    
    if (this.sprite.collidingWith(other_character.sprite)) {
        return true;
    }
    return false;
};




// Inheritance-y stuff for Player
function Player(health, sprite) {
    'use strict';
    
    this.health = health;
    this.sprite = sprite;
}

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;