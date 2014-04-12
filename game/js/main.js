/*global Character, Player, Sprite, Enemy*/
/*jslint browser: true*/


// Set up horrible globals
var game, canvas, ctx;

function chase() {
    'use strict';
    
    if (game.player.collidingWith(game.otherChar)) {
        return;
    }
    
    game.otherChar.moveTowards(game.player, ctx, canvas);
}

// Execute the setup on load
window.onload = function () {
    'use strict';
    
    // Set up main Game variable
    game = {};

    // Load canvas data into a variable
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    // Set up Player
    game.player = new Player(100, new Sprite('turret'));
    game.player.sprite.x = 200;
    game.player.sprite.y = 200;
    game.player.sprite.draw(ctx);
    
    // Set up random other character
    game.otherChar = new Enemy(100, new Sprite('face_sprite'), 5);
    game.otherChar.sprite.draw(ctx);
    game.otherChar.sprite.x = ((canvas.width - game.otherChar.sprite.frame_width) / 2);
    game.otherChar.sprite.y = ((canvas.height - game.otherChar.sprite.frame_height) / 2);
    game.otherChar.sprite.draw(ctx);
    
    setInterval(chase, 100);
};