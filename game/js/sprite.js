/*global console*/
/*jslint browser: true*/

// Sprite class
function Sprite(img_id) {
    'use strict';
    
    // Load image
    this.img = new Image();
    this.img.src = document.getElementById(img_id).src;
    
    // Frame delay factors (slow down advance of frames in animation)
    this.frame_delay_factor = 0;
    this.frame_factor = 0;
    
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

    return (((this.x + this.frame_width) >= s.x) &&
            (this.x <= (s.x + s.frame_width)) &&
            ((this.y + this.frame_height) >= s.y) &&
            (this.y <= (s.y + s.frame_height)));
};

Sprite.prototype.advanceFrame = function (playOnce) {
    'use strict';
    
    if (this.frame_factor >= this.frame_delay_factor) {
        if (!playOnce) {
            if (this.curr_frame < (this.num_frames - 1)) {
                this.curr_frame += 1;
            } else {
                this.curr_frame = 0;
            }
        } else {
            this.curr_frame += 1;
        }
        this.frame_factor = 0;
    }
    this.frame_factor += 1;
};

// Draw image on canvas
Sprite.prototype.draw = function (ctx) {
    'use strict';
    
    // Save current canvas state
    ctx.save();
    
    // Centre image
    ctx.translate(this.x + (this.frame_width / 2),
                  this.y + (this.frame_height / 2)); // Move to this location
    ctx.rotate(this.rotation); // Rotate canvas
    
    // Move canvas to top right (to draw image)
    ctx.translate(-this.frame_width / 2,
                  -this.frame_height / 2);
    
    // Draw image (from top right)
    ctx.drawImage(this.img, // Image
            (this.frame_width * this.curr_frame), // Frame position (time)
            (this.frame_height * this.sprite_offset), // Sprite number
            this.frame_width, this.frame_height, // Portion of image to draw
            0, 0, // Position on screen ((0, 0) because we translated canvas)
            this.frame_width, this.frame_height); // Size to draw
    
    ctx.translate(-this.x, -this.y); // Restore origin
    ctx.restore(); // Restore canvas
};

// Clear image from canvas
Sprite.prototype.clear = function (ctx) {
    'use strict';
    
    ctx.save(); // Save current canvas state
    ctx.translate(this.x + (this.frame_width / 2),
                  this.y + (this.frame_height / 2)); // Move to centre of image
    ctx.rotate(this.rotation); // Rotate canvas around centre point
    
    // Move canvas to top right (to clear image)
    ctx.translate(-this.frame_width / 2, -this.frame_height / 2);
    
    ctx.clearRect(0, 0, this.frame_width, this.frame_height); // Wipe image
    
    ctx.translate(-this.x, -this.y); // Restore origin
    ctx.restore(); // Restore rotation
};

// Centres the sprite on the screen
Sprite.prototype.centreSprite = function (canvas, ctx) {
    'use strict';
    
    this.x = (canvas.width - this.frame_width) / 2;
    this.y = (canvas.height - this.frame_height) / 2;
};

// Move image to new location
Sprite.prototype.move = function (x_diff, y_diff, ctx, canvas) {
    'use strict';
    
    // Clear old image
    this.clear(ctx);
    
    // Update position
    this.x += x_diff;
    this.y += y_diff;
    
    // Wrap around screen if sprite goes off edge
    if (this.x > canvas.width) {
        this.x = (-this.frame_width);
        // x_diff -= (canvas.width + this.frame_width);
    } else if (this.x < (-this.frame_width)) {
        this.x = (canvas.width + this.frame_width);
    }
    
    // Wrap around screen if sprite goes off edge
    if (this.y > canvas.height) {
        this.y = (-this.frame_height);
    } else if (this.y < (-this.frame_height)) {
        this.y = (canvas.height + this.frame_height);
    }
    
    // Redraw
    this.draw(ctx);
};

// Rotates sprite towards a point
Sprite.prototype.setRotationTowards = function (x, y, ctx) {
    'use strict';
    
    // Clear image area
    this.clear(ctx);
    
    // Calculate rotation for sprite
    var rot = Math.atan2((y - this.y), (x - this.x)) + (Math.PI / 2);
    this.rotation = rot;
};
