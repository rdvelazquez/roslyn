//_____________________________ INITIAL SETUP __________________________________
// Gampeplay variables**********************************************************
let highScore = 0;
function initiateGameplayVariables() {
  monstersCaught = 0;

  heroStartSpeed = 275;
  heroStartX = 616; // Location of my house
  heroStartY = 367; // Location of my house

  monsterStartSpeed = 250;
  monsterBuffer = 25; // How close you have to get to capture him
  monsterSpeedIncrease = 20;

  heroCloseToMonster = 200;
  monsterGetawaySpeed = 450;

  gameLength = 2; // Game lenght in minutes
  // Some timing variables (used in the main loop for displaying the time left )
  timeRemainingMin = 1;
  timeRemainingSec = 1;
}
initiateGameplayVariables();
// Levels***********************************************************************
let level;
function evaluateLevels() {
  tempLevel = level // for checking if it's a new level
  if (monstersCaught < 2) { level = 1}
  if (monstersCaught > 2) { level = 2;}
  if (monstersCaught > 5) { level = 3;}
  if (monstersCaught > 8) { level = 4;}
  if (monstersCaught > 11) { level = 5;}

  if(level == 2) {
    // Make the monster meander a bit
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText('Level 2', 32, 32);
    monster.direction += ( (Math.random() - 0.5) * 0.3 * Math.random());
  }
  if (level == 3) {
    // Make the monster make some eratic 90 degree turns
    if(Math.random() > 0.99) monster.direction += Math.PI * 0.5;
    if(Math.random() > 0.99) monster.direction -= Math.PI * 0.5;
  }

  if (level == 4) {
    monster.speed = monsterStartSpeed; // Reset monster speed
    let xDifference = hero.x - monster.x;
    let yDifference = hero.y - monster.y;
    let difference = Math.sqrt(Math.pow(xDifference,2) + Math.pow(yDifference,2))
    if (difference < heroCloseToMonster) monster.speed = monsterGetawaySpeed;
  }

  if (level == 5) {
    monster.speed = monsterStartSpeed * 1.5;
    let xDifference = hero.x - monster.x;
    let yDifference = hero.y - monster.y;
    let difference = Math.sqrt(Math.pow(xDifference,2) + Math.pow(yDifference,2))
    if (difference < (1.75 * heroCloseToMonster)) {
      if(Math.random() > 0.95) monster.direction += 0.5;
      if(Math.random() > 0.95) monster.direction -= 0.5;
    }
    if (difference < heroCloseToMonster) monster.speed = monsterGetawaySpeed * 1.5;
  }
}

// Game objects*****************************************************************
const hero = {
  speed: heroStartSpeed, // movement in pixels per second
  direction: 0, // direction in radians (a number between 0 and 6.2)
  x: heroStartX, // x and y of our house on map
  y: heroStartY,
};
const monster = {
  speed: monsterStartSpeed,
  direction: Math.random() * (Math.PI * 2), // direction in radians (a number between 0 and 6.2)
  x: 0,
  y: 0,
  buffer: monsterBuffer // how close you have to get to catch him
};
// Create the canvas************************************************************
function createCanvas() {
  canvas = document.createElement("canvas");
  ctx = canvas.getContext("2d");
  canvas.width = 1171;
  canvas.height = 657;
  document.body.appendChild(canvas);
  // Background image
  bgReady = false;
  bgImage = new Image();
  bgImage.onload = function () { bgReady = true; };
  bgImage.src = "background.png";
  // Hero image
  heroReady = false;
  heroImage = new Image();
  heroImage.onload = function () { heroReady = true; };
  heroImage.src = "hero.png";
  // Monster image
  monsterReady = false;
  monsterImage = new Image();
  monsterImage.onload = function () { monsterReady = true; };
  monsterImage.src = "monster.png";

  // Cross-browser support for requestFrame
  let w = window;
  requestAnimationFrame = w.requestAnimationFrame ||
                        w.msRequestAnimationFrame ||
                        w.mozRequestAnimationFrame;w.msRequestAnimationFrame ||
                        w.mozRequestAnimationFrame;
}
createCanvas();
// Handle keyboard controls*****************************************************
let keysDown = {};
addEventListener("keydown", function (e) {
                                      keysDown[e.keyCode] = true;
                                      }, false);
addEventListener("keyup", function (e) {
                                    delete keysDown[e.keyCode];
                                    }, false);

//_____________________________ GAMEPLAY _______________________________________
// Individual gameplay functions************************************************
function updateHero(modifier) {
  if (37 in keysDown) { // left
    hero.direction = 1.5 * Math.PI; }
  if (38 in keysDown) { // up
    hero.direction = 0; }
  if (39 in keysDown) { // right
    hero.direction = 0.5 * Math.PI; }
  if (40 in keysDown) { // down
    hero.direction = Math.PI; }
  if (37 in keysDown && 38 in keysDown) { // left and up
    hero.direction = 1.75 * Math.PI; }
  if (37 in keysDown && 40 in keysDown) { // left and down
    hero.direction = 1.25 * Math.PI; }
  if (39 in keysDown && 38 in keysDown) { // right and up
    hero.direction = 0.25 * Math.PI; }
  if (39 in keysDown && 40 in keysDown) { // right and down
    hero.direction = 0.75 * Math.PI; }
  // If arrow keys are being held down, move the hero
  if (37 in keysDown || 38 in keysDown || 39 in keysDown || 40 in keysDown) {
    hero.x += hero.speed * Math.sin(hero.direction) * modifier;
    hero.y += hero.speed * -Math.cos(hero.direction) * modifier;
    if (hero.direction>6.2) {hero.direction = hero.direction % 6.2;}
  }
}
function updateMonster(modifier) {
  // Monster movements
  monster.x += monster.speed * Math.sin(monster.direction) * modifier;
  monster.y += monster.speed * -Math.cos(monster.direction) * modifier;
  //if (monster.direction> (2 * Math.PI) ) {monster.direction = monster.direction % (2 * Math.PI);};
}
function keepOnBoard(person, bounceOffWall) {
  if (person.x < 5) {
    person.x = 5;
    if (bounceOffWall) {
      person.direction = -person.direction;
    }
  }
  if (person.y < 5) {
    person.y = 5;
    if (bounceOffWall) {
      person.direction = Math.PI - Math.sin(person.direction);
    }
  }
  if (person.x > (canvas.width - 30)) {
    person.x = (canvas.width - 30);
    if (bounceOffWall) {
      person.direction = -person.direction;
    }
  }
  if (person.y > (canvas.height - 30)) {
    person.y = (canvas.height - 30);
    if (bounceOffWall) {
      person.direction = Math.sin(person.direction);
    }
  }
}
function replaceMonster() {
  // Replace a new monster the game when the hero catches a monster
  // Place the monster on the screen randomly
  monster.x = Math.random() * canvas.width;
  monster.y = Math.random() * canvas.height;
  monster.direction = Math.random() * (Math.PI * 2 );
  // Increase the monster's speed
  monster.speed += monsterSpeedIncrease;
}
function evaluateIfTouching() {
  // Are they touching?
  if (
      hero.x <= (monster.x + monster.buffer)
      && monster.x <= (hero.x + monster.buffer)
      && hero.y <= (monster.y + monster.buffer)
      && monster.y <= (hero.y + monster.buffer)
  ) {
    ++ monstersCaught;
    replaceMonster();
  }
}
// The main gameplay function (combo of the above)******************************
function update(modifier) {
  updateHero(modifier);
  updateMonster(modifier);
  keepOnBoard(hero, false);
  keepOnBoard(monster, true);
  evaluateIfTouching();
}

//_____________________________ OVERALL CONTROLS _______________________________
// Draw everything**************************************************************
function render() {
  if (bgReady) ctx.drawImage(bgImage, 0, 0);
  if (heroReady) ctx.drawImage(heroImage, hero.x, hero.y);
  if (monsterReady) ctx.drawImage(monsterImage, monster.x, monster.y);
  // Score Board
  ctx.fillStyle = "rgb(200, 200, 200)";
  ctx.font = "24px Helvetica";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
                                          ctx.fillText("High Score: " + highScore + "                     Level: " + level + "               Time Remaining: " + timeRemainingMin + ":" + timeRemainingSec + "                              Bad Guys in Jail: " + monstersCaught, 32, 657 - 32);
}
// What happens when the game ends**********************************************
function gameOver() {
  if (monstersCaught > highScore){
    highScore = monstersCaught;
    alert("Game Over: New High Score!")
  }
  else {
    alert("Game Over")
  }
}
function startNewGame() {
  initiateGameplayVariables();
  keysDown = {};
  startTime = Date.now();
  monster.speed = monsterStartSpeed;
  //monstersCaught = 0;
  hero.x = heroStartX;
  hero.y = heroStartY;
}
// The main game loop***********************************************************
function main() {
  evaluateLevels();
  if (timeRemainingMin < 0 && timeRemainingSec < 0) {
    gameOver();
    startNewGame();
  }
  let now = Date.now();
  let delta = now -then;
  timeRemainingMin = Math.floor(((gameLength*60) - (now - startTime)/1000) / 60)
  timeRemainingSec = Math.floor((gameLength*60) - (now - startTime)/1000) % 60;

  update (delta/1000);
  render();
  then = now;

  requestAnimationFrame(main); // Reqest to do this again
}
// Start the game***************************************************************
let then = Date.now();
alert("There are bad guys loose in the quite town of Roslyn. We need your help!! Use the arrow keys to catch the bad guys.");
startNewGame();
main();
