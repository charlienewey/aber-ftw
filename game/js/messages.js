/*global game*/
/*jslint browser: true*/

var helpShowing = false;
function showHideHelp() {
    'use strict';
    
    if (game.running) {
        // This allows user to resume play in their own time
        game.pauseResume();
    }

    if (!helpShowing) {
        document.getElementById('help').style.display = "inline";
    } else {
        document.getElementById('help').style.display = "none";
    }
    
    helpShowing = !helpShowing;
}

window.onload = game.setup();