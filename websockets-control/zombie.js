/*jslint browser:true*/
/*global document, WebSocket, console*/

var connection, ready = false;

// Animation globals
var canvas, ctx, zom;

// Set up canvas
canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');

// Set up zombie
zom = {};
zom.img = new Image();
zom.img.src = 'img/zomb.png';
zom.img.onload = function () {
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

/*
 *  Keyboard interaction
 */
function setDirection(direction, zom) {
    'use strict';
    
    connection.send(direction);
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
    if (ready) {
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
        }

        document.getElementById('key').innerHTML = "Direction: " + zom.dir;
    }
}

function load() {
    'use strict';
    document.addEventListener('keydown', keyDownHandler, false);
    
    /*
     * Set up connection
     */
    connection = new WebSocket('ws://ws.assemblyco.de');
	connection.onopen = function () {
        console.log('Open connection');
        ready = true;
    };

	// Log errors
	connection.onerror = function (error) {
        console.log('WebSocket Error');
	};

    // Log messages from the server
    connection.onmessage = function (e) {
        console.log('Server: ' + e.data);

        var d = e.data;
        if (d === 'U') {
            zom.ypos -= zom.spd;
            zom.animy = 96;
        } else if (d === 'D') {
            zom.ypos += zom.spd;
            zom.animy = 0;
        } else if (d === 'L') {
            zom.xpos -= zom.spd;
            zom.animy = 32;
        } else if (d === 'R') {
            zom.xpos += zom.spd;
            zom.animy = 64;
        }

        // Loop animation
        zom.animx += 32;
        if (zom.animx >= 96) {
            zom.animx = 0;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(zom.img, zom.animx, zom.animy, zom.w, zom.h,
                    zom.xpos, zom.ypos, zom.w * 2, zom.h * 2);
    };
}