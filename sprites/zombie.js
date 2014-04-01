/*jslint browser:true */

// Init globals
var canvas, ctx, zom;

// Set up canvas
canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');

// Set up zombie
zom = {};
zom.img = new Image();
zom.img.src = 'img/zomb.png';
zom.img.onload = // function below
    function () {
        'use strict';
        ctx.drawImage(zom.img, zom.animx, zom.animy, zom.w, zom.h, zom.xpos, zom.ypos, zom.w * 2, zom.h * 2);
    };

zom.dir = "";
zom.moving = false;
zom.spd = 8; // Movement speed

zom.xpos = 0; // Position on canvas
zom.ypos = 0;

zom.animx = 0; // Offset within animation (time)
zom.animy = 0; // Offset within animation (direction)

zom.w = 32;
zom.h = 32;

function load() {
    'use strict';
    window.setInterval(update, (1000 / 20));
    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);
}

function update() {
    'use strict';
    move(zom); // Refresh zombie character
}

function move(spr) {
    'use strict';
    if (spr.moving) {
        var d = spr.dir;
        if (d === 'U') {
            spr.ypos -= spr.spd;
            spr.animy = 96;
        } else if (d === 'D') {
            spr.ypos += spr.spd;
            spr.animy = 0;
        } else if (d === 'L') {
            spr.xpos -= spr.spd;
            spr.animy = 32;
        } else if (d === 'R') {
            spr.xpos += spr.spd;
            spr.animy = 64;
        }
        
        // Loop animation
        spr.animx += 32;
        if (spr.animx >= 96) {
            spr.animx = 0;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(spr.img, spr.animx, spr.animy, spr.w, spr.h,
                    spr.xpos, spr.ypos, spr.w * 2, spr.h * 2);
    }
}

/*
 *  Keyboard interaction
 */
function setDirection(direction, zom) {
    'use strict';
    zom.dir = direction;
    zom.moving = true;
}

function keyDownHandler(event) {
    'use strict';
    
    /*
     * Useful key codes:
     * Up = 38
     * Down = 40
     * Left = 37
     * Right = 39
     */
    var chr = String.fromCharCode(event.keyCode);
    if (chr === 'W') {
        // Move up
        setDirection('U', zom);
    } else if (chr === 'S') {
        // Move down
        setDirection('D', zom);
    } else if (chr === 'A') {
        // Move left
        setDirection('L', zom);
    } else if (chr === 'D') {
        // Move right
        setDirection('R', zom);
    } else {
        zom.moving = false;
    }

    document.getElementById('key').innerHTML = "Direction: " + zom.dir;
    move(zom);
}

function keyUpHandler(event) {
    'use strict';

    var chr = String.fromCharCode(event.keyCode);
    if ((chr === 'W') ||
            (chr === 'S') ||
            (chr === 'A') ||
            (chr === 'D')) {
        zom.moving = false;
    }
    move(zom);
}