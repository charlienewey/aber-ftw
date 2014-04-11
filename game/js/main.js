/*global Character, Player, Sprite*/
/*jslint browser: true*/


// Set up horrible globals
var game, canvas, ctx;


function movePlayer() {
    'use strict';
    
    game.player.sprite.move(-3, -3, ctx, canvas);
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
    game.player = new Player(100, new Sprite('face_sprite'));
    game.player.sprite.draw(ctx);
    
    setInterval(movePlayer, 30);
};