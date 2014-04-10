/*global Character, Player, Sprite*/
/*jslint browser: true*/

window.onload = function () {
    'use strict';
    
    // Set up horrible globals
    var game, canvas, ctx;
    
    // Set up main Game variable
    game = {};

    // Load canvas data into a variable
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    // Set up Player
    game.player = new Player(100, new Sprite('face_sprite'));
    game.player.sprite.draw(ctx);
};