/*jslint browser: true*/

var helpShowing = false;
function showHideHelp() {
    'use strict';
    
    if (game.running) {
        game.running = false;
    }

    if (!helpShowing) {
        document.getElementById('help').style.display = "inline";
    } else {
        document.getElementById('help').style.display = "none";
    }
    
    helpShowing = !helpShowing;
}