/*global Character, Player, Sprite, Enemy, console*/
/*jslint browser: true*/

// Set up bad, evil globals
var game, game_canvas, hud_canvas, game_ctx, hud_ctx;

// Set up main Game
game = {};

game.playerHealthDecrease = function () {
    'use strict';
    
    console.log("Collision");
    game.player.modifyHealth(-20);
    game.updateHealthBar();
    game.hitSound.play();
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
    
    game.otherChar.moveTowards(game.player, game_ctx, game_canvas);
    
    if (game.player.collidingWith(game.otherChar, game.playerHealthDecrease)) {
        if (game.player.health > 0) {
            game.otherChar.sprite.clear(game_ctx);
            game.mainLoop();
        } else {
            game.otherChar.sprite.clear(game_ctx);
        }
    } else {
        window.requestAnimationFrame(game.chase);
    }
};

game.mainLoop = function () {
    'use strict';
    
    var enemySpeed, angle;
    
    // Set up random enemy
    enemySpeed = Math.floor(Math.random() * (game.level * 2)) + 1;
    game.otherChar = new Enemy(new Sprite('zombie'), enemySpeed);
    game.otherChar.sprite.frame_width = 64;
    game.otherChar.sprite.frame_height = 40;
    game.otherChar.sprite.num_frames = 3;
    game.otherChar.sprite.sprite_offset = Math.floor(Math.random() * 3);
    
    // http://stackoverflow.com/a/9879291
    angle = Math.random() * Math.PI * 2;
    game.otherChar.sprite.x = Math.cos(angle) * game_canvas.width;
    game.otherChar.sprite.y = Math.sin(angle) * game_canvas.width;
    
    window.requestAnimationFrame(game.chase);
};

game.rotatePlayer = function (event) {
    'use strict';
    
    var x, y, rect;
    x = event.clientX;
    y = event.clientY;
    
    // Adjust coordinates for document coordinates
    // BoundingClientRect code from: http://stackoverflow.com/a/11396681
    rect = game_canvas.getBoundingClientRect();
    game.player.sprite.setRotationTowards(x - rect.left, y - rect.top, game_ctx, game_canvas);

    game.player.sprite.draw(game_ctx);
};

// Run the main game when loaded
window.onload = function () {
    'use strict';
    
    // Load canvas data into variables
    game_canvas = document.getElementById('game_canvas');
    game_ctx = game_canvas.getContext('2d');
    
    // Canvas for info like health, score, etc
    hud_canvas = document.getElementById('hud_canvas');
    hud_ctx = hud_canvas.getContext('2d');
    
    // Set up sounds
    game.hitSound = document.getElementById('ow');
    game.fireSound = document.getElementById('fire');

    // Set up Player
    game.player = new Player(100, new Sprite('turret'));
    game.player.centrePlayer(game_canvas, game_ctx);
    game.player.sprite.draw(game_ctx);
    window.onmousemove = game.rotatePlayer;
    
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
    game.mainLoop();
};