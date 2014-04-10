/*global console*/
/*jslint browser: true*/

// Sprite class
function Sprite(img_id) {
    'use strict';
    
    // Load image
    this.img = new Image();
    this.img.src = document.getElementById(img_id).src;
    
    // Position relative to top right of canvas
    this.x = 0;
    this.y = 0;
    
    // Animation info
    this.num_frames = 1;
    this.curr_frame = 0; // Count from 0
    
    // Horizontal offset (vertical sprite number)
    this.sprite_offset = 0; // Count from 0
    
    // Frame sizes
    this.frame_width = this.img.width;
    this.frame_height = this.img.height;
}

Sprite.prototype.imageReadyCallback = function () {
    'use strict';
    
    this.frame_width = this.img.width;
    this.frame_height = this.img.height;
    
    console.log(this.img.width, this.img.height);
};

// Bounding-box collision detection
Sprite.prototype.collidingWith = function (s) {
    'use strict';
    
    if ((this.x) >= (s.x) &&
            (this.x + this.frame_width) <= (s.x + s.frame_width) &&
            (this.x >= s.x) &&
            (this.y  + this.frame_height) <= (s.y + s.frame_height) &&
            (this.y >= s.y)) {
        
        console.log("Collision!");
        return true;
    }
    
    return false;
};

Sprite.prototype.draw = function (ctx) {
    'use strict';
    
    ctx.drawImage(this.img, // Image
                  (this.frame_width * this.curr_frame), // Frame position (time)
                  (this.frame_height * this.sprite_offset), // Sprite number
                  this.frame_width, this.frame_height, // Portion of image to draw
                  this.x, this.y, // Position on screen
                  this.frame_width, this.frame_height); // Size to draw
};