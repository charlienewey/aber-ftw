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
    
    game.player.modifyHealth(-20);
    game.updateHealthBar();
    game.hitSound.play();
};

game.playerShotZombie = function () {
    'use strict';
    
    game.score += (game.lastZom.sprite.sprite_offset + 1);
    console.log("Score: ", game.score);
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
    
    var i, j, numZoms, zom, bul;
    
    if (game.running) {
        // Clear out old zombies
        for (i = 0; i < game.zombies.length; i += 1) {
            zom = game.zombies[i];
            if (zom.destroySprite.curr_frame > zom.sprite.num_frames + 1) {
                console.log("Clear old zombo");

                zom.destroySprite.clear(game_ctx);
                game.zombies.splice(i, 1);
            }
        }
        
        // Populate with more zombies based on score
        numZoms = Math.floor((game.score / 30) + 1) - game.zombies.length;
        for (i = 0; i < numZoms; i += 1) {
            game.newZombie();
        }

        for (i = 0; i < game.zombies.length; i += 1) {
            zom = game.zombies[i];

            zom.stepTowards(game.player.sprite.x,
                            game.player.sprite.y,
                            game_ctx, game_canvas);

            if (game.player.collidingWith(zom, game.playerHealthDecrease)) {
                if (game.player.health > 0) {
                    // Destroy!
                    zom.sprite.clear(game_ctx);
                    game.replaceZombie(i);
                } else {
                    zom.sprite.clear(game_ctx);
                    
                    console.log("Game over!");
                    game.running = false;
                }

            } else {
                for (j = 0; j < game.bullets.length; j += 1) {
                    bul = game.bullets[j];

                    // Move bullet
                    bul.moveStep(bul_ctx, bul_canvas);

                    // Check to see if a projectile has collided with a zombie
                    game.lastZom = zom;
                    if (bul.collidingWith(zom, game.playerShotZombie)) {
                        console.log("Shot zombo");

                        bul.sprite.clear(bul_ctx);
                        game.bullets.splice(j, 1);

                        zom.sprite.clear(game_ctx);
                        game.replaceZombie(i);
                    } else if (
                        // If projectile goes off-screen, delete it
                        (bul.sprite.x > (bul_canvas.width + bul.sprite.frame_width) ||
                        bul.sprite.y > (bul_canvas.height + bul.sprite.frame_height) ||
                        bul.sprite.x < 0 || bul.sprite.y < 0)
                    ) {
                        bul.sprite.clear(bul_ctx);
                        game.bullets.splice(j, 1);
                    }
                }
            }
        }
    }
    window.requestAnimationFrame(game.chase);
};

game.replaceZombie = function (i) {
    'use strict';
    
    game.zombies[i].destroy(bul_ctx);
    game.newZombie();
};

game.newZombie = function () {
    'use strict';
    
    var enemySpeed, angle, zom;
    
    // Set up random enemy
    enemySpeed = 1; //Math.floor((Math.random() + 1) * (Math.log(game.score + 1) / 2)) + 1;
    zom = new Enemy(new Sprite('zombie'), new Sprite('explosion'), enemySpeed);
    
    // Set up zombie sprite
    zom.sprite.frame_width = 40;
    zom.sprite.frame_height = 25;
    zom.sprite.num_frames = 3;
    
    zom.sprite.sprite_offset = Math.floor(Math.random() * 3);
    zom.sprite.frame_delay_factor = 5;
    
    // Set up explosion sprite
    zom.destroySprite.frame_height = 48;
    zom.destroySprite.frame_width = 40;
    zom.destroySprite.num_frames = 5;
    zom.destroySprite.frame_delay_factor = 5;
    
    // http://stackoverflow.com/a/9879291
    angle = Math.random() * Math.PI * 2;
    zom.sprite.x = Math.cos(angle) * game_canvas.width;
    zom.sprite.y = Math.sin(angle) * game_canvas.width;
    
    game.zombies.push(zom);
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
    
    var bul = new Bullet(new Sprite('bullet'), game.player,
               event.clientX, event.clientY,
               bul_ctx, bul_canvas, window);

    bul.sprite.num_frames = 5;
    bul.sprite.frame_width = 20;
    bul.sprite.frame_height = 22;
    
    game.bullets.push(bul);

    game.fireSound.currentTime = 0;
    game.fireSound.play();
};

game.mainLoop = function () {
    'use strict';
    
    game.newZombie();
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
    
    // Set up zombie list
    game.zombies = [];
    game.lastZom = null;
    
    // Set up bullet list
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
    
    // Set running
    game.running = true;
    window.onkeydown = function () {
        game.running = !game.running; // Toggle running state
    };
    
    // Kick off main loop
    // game.newZombie();
    game.mainLoop();
};
