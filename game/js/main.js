/*global Character, Player, Sprite, Enemy*/
/*jslint browser: true*/


// Set up horrible globals
var game, canvas, ctx;

function chase() {
    'use strict';
    
    if (game.player.collidingWith(game.otherChar)) {
        clearInterval(interval);
    }
    
    game.otherChar.moveTowards(game.player, ctx, canvas);
}

var interval = 0;
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
    game.otherChar = new Enemy(100, new Sprite('face_sprite'), 5);
    
    // http://stackoverflow.com/a/9879291
    var angle = Math.random() * Math.PI * 2;
    game.otherChar.sprite.x = Math.cos(angle) * canvas.width;
    game.otherChar.sprite.y = Math.sin(angle) * canvas.width;
    
    interval = setInterval(chase, 10);
};