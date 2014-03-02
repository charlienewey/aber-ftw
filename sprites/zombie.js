"use strict";
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
        ctx.drawImage(zom.img, zom.animx, zom.animy, zom.w, zom.h, zom.xpos, zom.ypos, zom.w * 2, zom.h * 2);
    };
zom.dir = "";

zom.moving = false;
zom.spd = 5; // Movement speed

zom.xpos = 0; // Position on canvas
zom.ypos = 0;

zom.animx = 0; // Offset within animation (time)
zom.animy = 0; // Offset within animation (direction)
zom.w = 32;
zom.h = 32;

function move(spr) {
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

        spr.animx += 32;
        if (spr.animx >= 96) {
            spr.animx = 0;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(spr.img, spr.animx, spr.animy, spr.w, spr.h,
                    spr.xpos, spr.ypos, spr.w * 2, spr.h * 2);
}

function update() {
    move(zom); // Refresh zombie character
}
setInterval(update, 50); // Set canvas to update at 20fps (1000/20)ms

/*
 *  Keyboard interaction
 */
function setDirection(direction, zom) {
    zom.dir = direction;
    zom.moving = true;
}

function keyDownHandler(event) {
    /*
     * Useful key codes:
     * Up = 38
     * Down = 40
     * Left = 37
     * Right = 39
     */

    var chr, key = event.keyCode;
    chr = String.fromCharCode(key);

    if (key === 38 || chr === 'W') {
        // Move up
        setDirection('U', zom);
    } else if (key === 40 || chr === 'S') {
        // Move down
        setDirection('D', zom);
    } else if (key === 37 || chr === 'A') {
        // Move left
        setDirection('L', zom);
    } else if (key === 39 || chr === 'D') {
        // Move right
        setDirection('R', zom);
    }

    document.getElementById('key').innerHTML = "Direction: " + zom.dir;
    move(zom);
}

function keyUpHandler(event) {
    var chr, key = event.keyCode;
    chr = String.fromCharCode(key);

    if ((key === 38 || chr === 'W') ||
            (key === 40 || chr === 'S') ||
            (key === 37 || chr === 'A') ||
            (key === 39 || chr === 'D')) {
        zom.moving = false;
    }
}

function load() {
    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);
}
