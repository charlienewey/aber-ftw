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
    this.rotation = 0;
    
    // Animation info
    this.num_frames = 1;
    this.curr_frame = 0; // Count from 0
    
    // Horizontal offset (vertical sprite number)
    this.sprite_offset = 0; // Count from 0
    
    // Frame sizes
    this.frame_width = this.img.width;
    this.frame_height = this.img.height;
}

// Bounding-box collision detection
Sprite.prototype.collidingWith = function (s) {
    'use strict';
    
    if (((this.x + this.frame_width) >= s.x) &&
            (this.x <= (s.x + s.frame_width)) &&
            ((this.y + this.frame_height) >= s.y) &&
            (this.y <= (s.y + s.frame_height))) {
        
        console.log("Collision!");
        return true;
    }
};

// Draw image on canvas
Sprite.prototype.draw = function (ctx) {
    'use strict';
    
    ctx.save(); // Save current canvas state
    ctx.moveTo(this.x, this.y); // Move to this location
    ctx.rotate(this.rotation); // Rotate canvas
    
    ctx.drawImage(this.img, // Image
          (this.frame_width * this.curr_frame), // Frame position (time)
          (this.frame_height * this.sprite_offset), // Sprite number
          this.frame_width, this.frame_height, // Portion of image to draw
          this.x, this.y, // Position on screen
          this.frame_width, this.frame_height); // Size to draw
    
    ctx.restore(); // Restore canvas
};

Sprite.prototype.clear = function (ctx) {
    'use strict';
    
    ctx.save(); // Save current canvas state
    ctx.moveTo(this.x, this.y); // Move to this location
    ctx.rotate(this.rotation); // Rotate canvas
    // ctx.clearRect(0, 0, this.img.width, this.img.height); // Wipe image
    ctx.restore(); // Restore
};

Sprite.prototype.move = function (x_diff, y_diff, ctx, canvas) {
    'use strict';
    
    // Clear canvas image
    this.clear(ctx);
    
    // Wrap around screen if sprite goes off edge
    if (this.x > canvas.width) {
        x_diff -= (canvas.width + this.frame_width);
    } else if (this.x < (-this.frame_width)) {
        x_diff += (canvas.width + this.frame_width);
    }
    
    // Wrap around screen if sprite goes off edge
    if (this.y > canvas.height) {
        y_diff -= (canvas.height + this.frame_height);
    } else if (this.y  < (-this.frame_height)) {
        y_diff += (canvas.height + this.frame_height);
    }
    
    // Update position
    this.x += x_diff;
    this.y += y_diff;
    
    this.draw(ctx); // Redraw with new rotation
};

// Rotates sprite towards a point
Sprite.prototype.setRotationTowards = function (x, y, ctx, canvas) {
    'use strict';
    
    
    ctx.clearRect(this.x, this.y, this.img.width, this.img.height);
    
    var hyp, opp, rot;
    
    // Calculate rotation for sprite
    hyp = Math.sqrt(Math.pow((this.x - x), 2) + Math.pow((this.y - y), 2));
    opp = this.y - y;
    rot = Math.asin(opp / hyp);
    
    this.rotation = rot;
};