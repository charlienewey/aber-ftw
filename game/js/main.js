/*global Character, Player, Sprite, Enemy, Bullet, console*/
/*jslint browser: true*/

// Set up bad, evil globals
var game,
    bul_canvas,
    bul_ctx,
    game_canvas,
    game_ctx,
    hud_canvas,
    hud_ctx;

// Set up main Game
game = {};

// Main setup function for page load
game.setup = function () {
    'use strict';
    
    // Load game canvas data into variables
    game_canvas = document.getElementById('game_canvas');
    game_ctx = game_canvas.getContext('2d');
    
    // Load info canvas data into variables
    hud_canvas = document.getElementById('hud_canvas');
    hud_ctx = hud_canvas.getContext('2d');
    
    // Load bullet canvas data into variables
    bul_canvas = document.getElementById('bullet_canvas');
    bul_ctx = bul_canvas.getContext('2d');
    
    // Set up game screens
    game.startScreen = new Sprite('start_screen');
    game.startScreen.centreSprite(game_canvas, game_ctx);
    game.gameOverScreen = new Sprite('game_over_screen');
    game.gameOverScreen.centreSprite(game_canvas, game_ctx);
    game.pauseScreen = new Sprite('pause_screen');
    game.pauseScreen.centreSprite(game_canvas, game_ctx);
    
    // Set up Player
    game.player = new Player(100, new Sprite('turret'));
    game.player.sprite.centreSprite(game_canvas, game_ctx);
    
    // Set up sounds
    game.hitSound = document.getElementById('ow');
    game.fireSound = document.getElementById('fire');
    game.popSound = document.getElementById('pop');
    
    // Set up bounding stuff
    game.updateBounds();
    window.onresize = game.updateBounds;
    window.onscroll = game.updateBounds;
    
    // Set up health bar text
    game.health_text = new Sprite('health_text');
    game.health_text.x = 20;
    game.health_text.y = 20;
    
    // Set up health bar
    game.health_bar = new Sprite('health_bar');
    game.health_bar.x = game.health_text.x + game.health_text.frame_width;
    game.health_bar.y = game.health_text.y;
    
    game.newGame();
};

// Run the main game when loaded
game.newGame = function () {
    'use strict';
    
    // Stop people being able to click/drag on canvas - annoying while playing
    game_canvas.onmousedown = function () {
        return false;
    };
    
    // Health bar
    game.player.health = 100;
    game.health_bar.clear(hud_ctx);
    game.health_bar.frame_width = game.health_bar.img.width;
    
    // Score
    game.score = 0;
    game.updateScoreHTML();
    game.highscore = game.loadHighScore();
    
    // Set up zombie list
    game.zombies = [];
    game.lastZom = null;
    
    // Set up bullet list
    game.bullets = [];
    
    // Set up params for running and pausing
    game.running = false;
    
    // Draw start screen
    game.startScreen.draw(game_ctx);
    
    // Allow game to be started
    hud_canvas.onmousedown = function () {
        // Kick off main loop
        game.running = true;
        game.newZombie();
        game.begin();

        // Stop game being able to be started twice!
        hud_canvas.onmousedown = null;
    };
};

game.begin = function () {
    'use strict';
    
    // Clear start screen
    game_ctx.clearRect(0, 0, game_canvas.width, game_canvas.height);
    
    // Player
    game.player.sprite.draw(game_ctx);
    window.onmousemove = game.rotatePlayer;
    
    // Draw health text
    game.health_text.draw(hud_canvas.getContext('2d'));
    
    // Draw health bar
    game.updateHealthBar();
    
    // Set up pausing of game
    window.onkeydown = function (event) {
        if (event.keyCode === 27) {
            game.pauseResume();
        }
    };
    
    // Start animation
    game.chase();
    
    // Set up shooting mechanism
    window.onmousedown = function (event) {
        if (game.running) {
            game.fireBullet(event);
        }
    };
};

game.chase = function () {
    'use strict';
    
    var i, j, numZoms, zom, bul;
    
    if (game.running) {
        // Clear out old zombie sprites
        for (i = 0; i < game.zombies.length; i += 1) {
            zom = game.zombies[i];
            if (zom.destroySprite.curr_frame > zom.sprite.num_frames + 1) {
                zom.destroySprite.clear(game_ctx);
                game.zombies.splice(i, 1);
            }
        }
        
        // Populate with more zombies based on score
        numZoms = Math.floor((game.score / 30) + 1) - game.zombies.length;
        for (i = 0; i < numZoms; i += 1) {
            game.newZombie();
        }

        // Update the game components and redraw necessary parts
        for (i = 0; i < game.zombies.length; i += 1) {
            zom = game.zombies[i];

            zom.stepTowards(game.player.sprite.x,
                            game.player.sprite.y,
                            game_ctx, game_canvas);

            if (game.player.collidingWith(zom, game.playerHealthDecrease)) {
                if (game.player.health > 0) {
                    // Make new zombie
                    zom.sprite.clear(game_ctx);
                    game.replaceZombie(i);
                } else {
                    // Game over
                    zom.sprite.clear(game_ctx);
                    
                    game.updateHighScore();
                    
                    game.gameOver();
                    
                    break;
                }

            } else {
                for (j = 0; j < game.bullets.length; j += 1) {
                    bul = game.bullets[j];

                    // Move bullet
                    bul.moveStep(bul_ctx, bul_canvas);

                    // Check to see if a projectile has collided with a zombie
                    game.lastZom = zom;
                    if (bul.collidingWith(zom, game.playerShotZombie)) {
                        bul.sprite.clear(bul_ctx);
                        game.bullets.splice(j, 1);

                        zom.sprite.clear(game_ctx);
                        game.replaceZombie(i);
                    } else if (
                        // If projectile goes off-screen, delete it
                        (bul.sprite.x > (bul_canvas.width + bul.sprite.frame_width) ||
                        bul.sprite.y > (bul_canvas.height + bul.sprite.frame_height) ||
                        bul.sprite.x < 0 || bul.sprite.y < 0)
                    ) {
                        bul.sprite.clear(bul_ctx);
                        game.bullets.splice(j, 1);
                    }
                }
            }
        }
        window.requestAnimationFrame(game.chase);
    }
};

game.playerHealthDecrease = function () {
    'use strict';
    
    game.player.modifyHealth(-10);
    game.updateHealthBar();
    game.hitSound.play();
};

game.playerShotZombie = function () {
    'use strict';
    
    game.popSound.currentTime = 0;
    game.popSound.play();
    game.score += (game.lastZom.sprite.sprite_offset + 1);
    game.updateScoreHTML();
};

game.updateHealthBar = function () {
    'use strict';
    
    // Draw on context 'layer' that is in front of main game context
    // This is so that the sprites don't wipe over the health bar
    game.health_bar.clear(hud_ctx);
    
    if (game.player.health > 0) {
        game.health_bar.frame_width = Math.floor(game.health_bar.img.width *
                                                (game.player.health / 100));
        game.health_bar.draw(hud_ctx);
    }
};

game.loadHighScore = function () {
    'use strict';
    
    if (Storage !== 'undefined') {
        var hs = localStorage.getItem('highScore');
        
        document.getElementById('highscore').innerHTML = 'High Score: ';
        if (hs === null) {
            document.getElementById('highscore').innerHTML += "0";
        } else {
            document.getElementById('highscore').innerHTML += hs;
        }
        
        return hs;
    }
};

game.updateHighScore = function () {
    'use strict';
    
    if (game.highscore === null ||
            game.score > game.highscore) {
        localStorage.setItem('highScore', game.score);
    }
};

game.updateScoreHTML = function () {
    'use strict';
    
    document.getElementById('score').innerHTML = "Score: " + game.score;
    
    if (game.score > game.highscore) {
        document.getElementById('highscore').innerHTML = "High Score: " + game.score;
    }
};

game.replaceZombie = function (i) {
    'use strict';
    
    game.zombies[i].destroy(bul_ctx);
    game.newZombie();
};

game.newZombie = function () {
    'use strict';
    
    var enemySpeed, angle, zom;
    
    // Set up random enemy
    enemySpeed = 2;
    zom = new Enemy(new Sprite('zombie'), new Sprite('explosion'), enemySpeed);
    
    // Set up zombie sprite
    zom.sprite.frame_width = 40;
    zom.sprite.frame_height = 25;
    zom.sprite.num_frames = 3;
    
    zom.sprite.sprite_offset = Math.floor(Math.random() * 3);
    zom.sprite.frame_delay_factor = 5;
    
    // Set up explosion sprite
    zom.destroySprite.frame_height = 48;
    zom.destroySprite.frame_width = 40;
    zom.destroySprite.num_frames = 5;
    zom.destroySprite.frame_delay_factor = 5;
    
    // http://stackoverflow.com/a/9879291
    angle = Math.random() * (Math.PI * 2);
    zom.sprite.x = (Math.sin(angle) * (game_canvas.width / 2)) +
        (game_canvas.width / 2);
    
    zom.sprite.y = (Math.cos(angle) * (game_canvas.height / 2)) +
        (game_canvas.height / 2);
    
    game.zombies.push(zom);
};

game.rotatePlayer = function (event) {
    'use strict';
    
    var x, y;
    x = event.clientX;
    y = event.clientY;
    
    // Adjust coordinates for document coordinates
    game.player.sprite.setRotationTowards(x - game.left, y - game.top,
                                          game_ctx, game_canvas);

    game.player.sprite.draw(game_ctx);
};

game.fireBullet = function (event) {
    'use strict';
    
    var bul = new Bullet(new Sprite('bullet'), game.player,
                     event.clientX, event.clientY,
                     bul_ctx, bul_canvas,
                     game.left, game.top);

    bul.sprite.num_frames = 5;
    bul.sprite.frame_width = 20;
    bul.sprite.frame_height = 22;
    
    game.bullets.push(bul);

    game.fireSound.currentTime = 0;
    game.fireSound.play();
};

game.updateBounds = function () {
    'use strict';
    
    // BoundingClientRect code from: http://stackoverflow.com/a/11396681
    var rect = game_canvas.getBoundingClientRect();
    game.left = rect.left;
    game.top = rect.top;
};

game.pauseResume = function () {
    'use strict';
    
    if (game.running) {
        game.running = false;

        // Stop mouse following turret
        window.onmousemove = null;

        game_ctx.clearRect(0, 0, game_canvas.width, game_canvas.height);
        bul_ctx.clearRect(0, 0, bul_canvas.width, bul_canvas.height);
        hud_ctx.clearRect(0, 0, hud_canvas.width, hud_canvas.height);

        // Draw pause image
        game.pauseScreen.draw(game_ctx);
    } else {
        game_ctx.clearRect(0, 0, game_canvas.width, game_canvas.height);
        game.running = true;
        game.begin();
    }
};

game.gameOver = function () {
    'use strict';
    
    game.pauseResume();
    game_ctx.clearRect(0, 0, game_canvas.width, game_canvas.height);
    game.gameOverScreen.draw(game_ctx);
    
    // Disable interactions
    window.onkeydown = null;
    window.onmousedown = null;
    
    hud_canvas.onmousedown = function () {
        game_ctx.clearRect(0, 0, game_canvas.width, game_canvas.height);
        game.newGame();
    };
};