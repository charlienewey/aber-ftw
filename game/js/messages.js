/*global game, game_ctx*/
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

window.onload = function () {
    'use strict';
    
    game.setup();
    game.startScreen.draw(game_ctx);
};