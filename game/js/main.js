/*global Character, Player, Sprite, Enemy, console*/
/*jslint browser: true*/

// Set up bad, evil globals
var game, game_canvas, hud_canvas, game_ctx, hud_ctx, interval;

// Set up main Game
game = {};

game.playerHealthDecrease = function () {
    'use strict';
    
    console.log("Collision");
    game.player.modifyHealth(-10);
    game.updateHealthBar();
    
    if (game.player.health > 0) {
        game.newZombie();
    }
};

game.chase = function () {
    'use strict';
    
    if (game.player.collidingWith(game.otherChar, game.playerHealthDecrease)) {
        clearInterval(interval);
    }
    
    game.otherChar.moveTowards(game.player, game_ctx, game_canvas);
};

game.newZombie = function () {
    'use strict';
    
    // Set up random enemy
    game.otherChar = new Enemy(new Sprite('zombie'), 1);
    game.otherChar.sprite.frame_width = 64;
    game.otherChar.sprite.frame_height = 40;
    game.otherChar.sprite.num_frames = 3;
    game.otherChar.sprite.sprite_offset = Math.floor(Math.random() * 3);
    
    // http://stackoverflow.com/a/9879291
    var angle = Math.random() * Math.PI * 2;
    game.otherChar.sprite.x = Math.cos(angle) * game_canvas.width;
    game.otherChar.sprite.y = Math.sin(angle) * game_canvas.width;
    
    interval = setInterval(game.chase, 30);
};

game.updateHealthBar = function () {
    'use strict';
    
    game.health_bar.clear(hud_ctx);
    game.health_bar.frame_width = Math.floor(game.health_bar.img.width *
                                                (game.player.health / 100));
    game.health_bar.draw(hud_ctx);
};

// Run the main game when loaded
window.onload = function () {
    'use strict';
    
    // Load canvas data into variables
    game_canvas = document.getElementById('game_canvas');
    game_ctx = game_canvas.getContext('2d');
    game_ctx.font = "30px Arial";
    
    // Canvas for info like health, score, etc
    hud_canvas = document.getElementById('hud_canvas');
    hud_ctx = hud_canvas.getContext('2d');

    // Set up Player
    game.player = new Player(100, new Sprite('turret'), new Sprite('barrel'));
    game.player.centrePlayer(game_canvas, game_ctx);
    game.player.sprite.draw(game_ctx);
    
    // Set up health bar
    game.health_text = new Sprite('health_text');
    game.health_text.x = 20;
    game.health_text.draw(hud_canvas.getContext('2d'));
    
    game.health_bar = new Sprite('health_bar');
    game.health_bar.x = game.health_text.x + game.health_text.frame_width + 10;
    game.health_bar.y = game.health_text.y;
    game.updateHealthBar();
    
    // Zombie
    game.newZombie();
};