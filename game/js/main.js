/*global Character, Player, Sprite, Enemy, Bullet, console*/
/*jslint browser: true*/

// Set up bad, evil globals
var game,
    bul_canvas,
    bul_ctx,
    game_canvas,
    game_ctx,
    hud_canvas,
    hud_ctx;

// Set up main Game
game = {};

game.playerHealthDecrease = function () {
    'use strict';
    
    console.log("Collision");
    game.player.modifyHealth(-20);
    game.updateHealthBar();
    game.hitSound.play();
};

game.playerShotZombie = function () {
    'use strict';
    
    console.log("Arg");
    game.score += game.otherChar.sprite.sprite_offset;
};

game.updateHealthBar = function () {
    'use strict';
    
    // Draw on context "layer" that is in front of main game context
    // This is so that the sprites don't wipe over the health bar
    game.health_bar.clear(hud_ctx);
    game.health_bar.frame_width = Math.floor(game.health_bar.img.width *
                                                (game.player.health / 100));
    game.health_bar.draw(hud_ctx);
};

game.chase = function () {
    'use strict';
    
    var i, tmp;
    
    game.otherChar.stepTowards(game.player.sprite.x,
                               game.player.sprite.y,
                               game_ctx, game_canvas,
                               game.newZombie);
    
    if (game.player.collidingWith(game.otherChar, game.playerHealthDecrease)) {
        if (game.player.health > 0) {
            // Destroy!
            game.otherChar.destroy(game_ctx);
            
            // Fix collision detection
            game.otherChar.sprite.x = 0;
            game.otherChar.sprite.y = 0;
            
            // Run again
            game.mainLoop();
        } else {
            game.otherChar.sprite.clear(game_ctx);
        }
    } else {
        for (i = 0; i < game.bullets.length; i += 1) {
            tmp = game.bullets[i];
            
			// Move bullet
            tmp.moveStep(bul_ctx, bul_canvas);
            
            // Check to see if a projectile has collided with a zombie
            if (tmp.collidingWith(game.otherChar, game.playerShotZombie)) {
                tmp.sprite.clear(bul_ctx);
                game.bullets.splice(i, 1);
                
                game.otherChar.destroy(game_ctx);
                // game.newZombie();
            } else if (
                // If projectile goes off-screen, delete it
                (tmp.sprite.x > (bul_canvas.width + tmp.sprite.frame_width) ||
                tmp.sprite.y > (bul_canvas.height + tmp.sprite.frame_height) ||
                tmp.sprite.x < 0 || tmp.sprite.y < 0)
            ) {
                tmp.sprite.clear(bul_ctx);
                game.bullets.splice(i, 1);
            }
        }
        
        window.requestAnimationFrame(game.chase);
    }
};

game.newZombie = function () {
    'use strict';
    
    var enemySpeed, angle;
    
    // Set up random enemy
    enemySpeed = Math.floor((Math.random() + 1) * (Math.log(game.score + 1) / 2)) + 1;
    game.otherChar = new Enemy(new Sprite('zombie'), new Sprite('explosion'), enemySpeed);
    
    // Set up zombie sprite
    game.otherChar.sprite.frame_width = 40;
    game.otherChar.sprite.frame_height = 25;
    game.otherChar.sprite.num_frames = 3;
    
    game.otherChar.sprite.sprite_offset = Math.floor(Math.random() * 3);
    game.otherChar.sprite.frame_delay_factor = 5;
    
    // Set up explosion sprite
    game.otherChar.destroySprite.frame_height = 48;
    game.otherChar.destroySprite.frame_width = 40;
    game.otherChar.destroySprite.num_frames = 5;
    game.otherChar.destroySprite.frame_delay_factor = 5;
    
    // http://stackoverflow.com/a/9879291
    angle = Math.random() * Math.PI * 2;
    game.otherChar.sprite.x = Math.cos(angle) * game_canvas.width;
    game.otherChar.sprite.y = Math.sin(angle) * game_canvas.width;
};

game.rotatePlayer = function (event) {
    'use strict';
    var x, y, rect;
    x = event.clientX;
    y = event.clientY;
    
    // Adjust coordinates for document coordinates
    // BoundingClientRect code from: http://stackoverflow.com/a/11396681
    rect = game_canvas.getBoundingClientRect();
    game.player.sprite.setRotationTowards(x - rect.left, y - rect.top,
                                          game_ctx, game_canvas);

    game.player.sprite.draw(game_ctx);
};

game.fireBullet = function (event) {
    'use strict';
    
    var tmp = new Bullet(new Sprite('bullet'), game.player,
               event.clientX, event.clientY,
               bul_ctx, bul_canvas, window);

    tmp.sprite.num_frames = 5;
    tmp.sprite.frame_width = 20;
    tmp.sprite.frame_height = 22;

    game.bullets.push(tmp);

    game.fireSound.currentTime = 0;
    game.fireSound.play();
};

game.mainLoop = function () {
    'use strict';
    
    // game.newZombie();
    window.requestAnimationFrame(game.chase);
};

// Run the main game when loaded
window.onload = function () {
    'use strict';
    
    // Load game canvas data into variables
    game_canvas = document.getElementById('game_canvas');
    game_ctx = game_canvas.getContext('2d');
    
    // Load info canvas data into variables
    hud_canvas = document.getElementById('hud_canvas');
    hud_ctx = hud_canvas.getContext('2d');
    
    // Load bullet canvas data into variables
    bul_canvas = document.getElementById('bullet_canvas');
    bul_ctx = bul_canvas.getContext('2d');
    
    // Set up sounds
    game.hitSound = document.getElementById('ow');
    game.fireSound = document.getElementById('fire');
    
    // Score
    game.score = 0;

    // Set up Player
    game.player = new Player(100, new Sprite('turret'));
    game.player.centrePlayer(game_canvas, game_ctx);
    game.player.sprite.draw(game_ctx);
    window.onmousemove = game.rotatePlayer;
    
    // Set up bullet(s)
    game.bullets = [];
    window.onmousedown = game.fireBullet;
    
    // Set up health bar text
    game.health_text = new Sprite('health_text');
    game.health_text.x = 20;
    game.health_text.draw(hud_canvas.getContext('2d'));
    
    // Set up health bar
    game.health_bar = new Sprite('health_bar');
    game.health_bar.x = game.health_text.x + game.health_text.frame_width + 10;
    game.health_bar.y = game.health_text.y;
    game.updateHealthBar();
    
    // Set level
    game.level = 1;
    
    // Kick off main loop
    game.newZombie();
    game.mainLoop();
};
