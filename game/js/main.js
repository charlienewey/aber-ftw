/*global Character, Player, Sprite, Enemy*/
/*jslint browser: true*/


// Set up horrible globals
var game, canvas, ctx, interval;

function chase() {
    'use strict';
    
    if (game.player.collidingWith(game.otherChar, null)) {
        clearInterval(interval);
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
    game.player.centrePlayer(canvas, ctx);
    game.player.sprite.draw(ctx);
    
    // Set up random other character
    game.otherChar = new Enemy(100, new Sprite('zombie'), 1);
    game.otherChar.sprite.frame_width = 42;
    game.otherChar.sprite.num_frames = 3;
    
    // http://stackoverflow.com/a/9879291
    var angle = Math.random() * Math.PI * 2;
    game.otherChar.sprite.x = Math.cos(angle) * canvas.width;
    game.otherChar.sprite.y = Math.sin(angle) * canvas.width;
    
    interval = setInterval(chase, 30);
};