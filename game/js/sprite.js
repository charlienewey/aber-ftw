/*jslint browser: true*/

var sprite = {};
sprite.img = new Image();

sprite.x = 0;
sprite.y = 0;

sprite.collidingWith = function (s) {
    'use strict';
    
    // Collision detection of sprites
    if ((sprite.x) >= (s.x) &&
            (sprite.x + sprite.img.width) <= (s.x + s.img.width) &&
            (sprite.y) >= (s.y) &&
            (sprite.y  + sprite.img.height) <= (s.y + s.img.height)) {
        
        return true;
    }
    
    return false;
};