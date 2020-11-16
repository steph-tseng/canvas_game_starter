/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images. 
*/

// canvas code
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 342;
document.body.appendChild(canvas);
canvas.style.position = "relative";

let bgReady, playerReady, kittyReady, monsterReady;
let bgImage, playerImage, kittyImage, wingMonster;

let startTime = Date.now();
const SECONDS_PER_ROUND = 30;
var kittyspPerRound = 10; //Todo change this
let elapsedTime = 0;
var gameOver = false;
let score = 0;
let lives = 5;
let food = 1;
let foodPresent = false;
let monsterSpeed = 0;
let kittySpeed = 0;
let playerSpeed = 0;
var currentlvl = 1;
var totalScore = 0;
var highestScore = 0;

var playerName = "";
let startGame = 0;

var meow = new Audio("mp3/Meowing-cat-sound.mp3");

function loadImages() {
  document.body.style.backgroundImage = apocalypseBg = new Image();
  apocalypseBg.onload = function () {
    bgReady = true;
  };
  apocalypseBg.src = "images/apocalypse.jpg";
  document.body.style.backgroundColor = "#000";

  bgImage = new Image();
  bgImage.onload = function () {
    // show the background image
    bgReady = true;
  };

  bgImage.src = "images/forestback.png";
  playerImage = new Image();
  playerImage.onload = function () {
    // show the player image
    playerReady = true;
  };
  playerImage.src = "images/player.png";

  kittyImage = new Image();
  kittyImage.onload = function () {
    // show the kitty image
    kittyReady = true;
  };
  kittyImage.src = "images/cat1.png";

  kitty2Image = new Image();
  kitty2Image.onload = function () {
    kittyReady = true;
  };
  kitty2Image.src = "images/cat2.png";

  wingMonster = new Image();
  wingMonster.onload = function () {
    monsterReady = true;
  };
  wingMonster.src = "images/monster2.png";

  foodImage = new Image();
  foodImage.onload = function () {
    playerReady = true;
  };
  foodImage.src = "images/food.png";

  arrowsImage = new Image();
  arrowsImage.onload = function () {
    playerReady = true;
  };
  arrowsImage.src = "images/arrows.png";
  document.body.appendChild(arrowsImage);
  arrowsImage.style.position = "absolute";
  arrowsImage.style.top = "500px";
  arrowsImage.style.width = "200px";
}

function loadAudio() {
  var bgMusic = document.getElementById("bgMusic");
  bgMusic.play();
}

var nextLvl = document.createElement("BUTTON");
document.body.appendChild(nextLvl);
nextLvl.id = "lvlBtn";
nextLvl.innerHTML = "Next Level";
nextLvl.style.visibility = "hidden";
nextLvl.style.position = "absolute";

/**
 * Setting up our characters.
 *
 * Note that playerX represents the X position of our player.
 * playerY represents the Y position.
 * We'll need these values to know where to "draw" the player.
 *
 * The same applies to the kitty.
 */

let playerX = canvas.width / 2;
let playerY = canvas.height / 2;

kittyX = Math.random() * canvas.width - 32;
kittyY = Math.random() * canvas.height - 32;

monsterX = Math.random() * canvas.width - 32;
monsterY = Math.random() * canvas.height - 32;

var divStory = document.getElementById("story");
var title = document.getElementById("title");
title.style.color = "#fff";

var welcome = document.createElement("h2");
document.body.appendChild(welcome);
welcome.style.position = "absolute";
welcome.setAttribute.id = "welcome";
welcome.style.left = "800px";
welcome.style.top = "110px";
welcome.innerHTML = "Welcome to the apocalypse: ";
welcome.style.fontSize = "26px";
welcome.style.color = "#fff";

var story = document.createElement("p");
document.body.appendChild(story);
story.style.position = "absolute";
story.setAttribute.id = "story";
story.style.left = "620px";
story.style.right = "10px";
story.style.top = "150px";
story.innerHTML =
  "The end of the world is upon us and there are weird flying demon things after you. Your best option is probably to hide out at home with your doors locked but if you’re going to die, you’re going to die doing what you love: saving cats. You can only carry 10 cats at a time, but you can go back out after depositing the ones you’ve caught in the relative safety of your home. Save as many as you can!";
story.style.fontFamily = "Georgia";
story.style.fontSize = "20px";
story.style.color = "#fff";

var highScore = document.createElement("h2");
document.body.appendChild(highScore);
highScore.style.position = "absolute";
highScore.style.top = "300px";
highScore.style.left = "620px";
highScore.style.color = "#fff";
highScore.innerHTML = `Highscore: ${highestScore}`;

var lvl = document.createElement("h2");
document.body.appendChild(lvl);
lvl.style.position = "absolute";
lvl.style.top = "60px";
lvl.style.left = "520px";
lvl.style.color = "#fff";
lvl.innerHTML = `Level ${currentlvl}`;

var directions = document.createElement("p");
document.body.appendChild(directions);
directions.style.position = "absolute";
directions.style.top = "500px";
directions.style.left = "800px";
directions.style.right = "200px";
directions.style.color = "#fff";
directions.innerHTML =
  "Use the arrow keys to move to avoid the monsters and rescue as many cats as you can before the timer runs out!";
directions.style.fontSize = "20px";
/**
 * Keyboard Listeners
 * You can safely ignore this part, for now.
 *
 * This is just to let JavaScript know when the user has pressed a key.
 */
let keysPressed = {};
function setupKeyboardListeners() {
  // Check for keys pressed where key represents the keycode captured
  // For now, do not worry too much about what's happening here.
  document.addEventListener(
    "keydown",
    function (e) {
      keysPressed[e.key] = true;
    },
    false
  );

  document.addEventListener(
    "keyup",
    function (e) {
      keysPressed[e.key] = false;
    },
    false
  );

  var pausebtn = document.createElement("BUTTON");
  pausebtn.innerHTML = `<i class="fas fa-pause"></i>`;
  document.body.appendChild(pausebtn);
  pausebtn.setAttribute.style = "top: 20px";

  var playbtn = document.createElement("BUTTON");
  playbtn.innerHTML = `<i class="fas fa-play"></i>`;
  document.body.appendChild(playbtn);
  playbtn.style.display = "none";

  var timeElapsed = 0;

  pausebtn.addEventListener("click", function () {
    alert("Paused");
    pausebtn.style.display = "none";
    playbtn.style.display = "inline";
    monsterSpeed = 0;
    kittySpeed = 0;
    playerSpeed = 0;
    timeElapsed += elapsedTime;
  });

  playbtn.addEventListener("click", function () {
    monsterSpeed = 2;
    kittySpeed = 0.1;
    playerSpeed = 5;
    startTime = Date.now();
    elapsedTime = SECONDS_PER_ROUND - timeElapsed;
    playbtn.style.display = "none";
    pausebtn.style.display = "inline";
  });

  nextLvl.addEventListener("click", function () {
    lvlTwo();
  });

  document.write("<br>");
  var playerName = document.createElement("p");
  document.body.appendChild(playerName);
  playerName.innerHTML = `Name: `;
  playerName.style.color = "#fff";
  var playerInput = document.createElement("Input");
  document.body.appendChild(playerInput);
  playerInput.style.display = "inline";

  var startbtn = document.createElement("button");
  document.body.appendChild(startbtn);
  startbtn.innerHTML = "Start";
  startbtn.style.display = "inline";
  startbtn.addEventListener("click", function () {
    startGame = 1;
    welcome.innerHTML = `Welcome to the apocalypse ${playerInput.value}`;
    if ((startGame = 1)) {
      start();
    } else {
      monsterSpeed = 0;
      kittySpeed = 0;
      playerSpeed = 0;
      elapsedTime = 0;
    }
  });
}

/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the kitty has been caught!
 *
 *  If you change the value of 5, the player will move at a different rate.
 */

function start() {
  monsterSpeed = 2;
  kittySpeed = 0.1;
  playerSpeed = 5;
  startTime = Date.now();
  elapsedTime = 0;
}

let update = function () {
  // Update the time.

  elapsedTime = Math.floor((Date.now() - startTime) / 1000);

  if (keysPressed["ArrowUp"]) {
    playerY -= playerSpeed;
  }
  if (keysPressed["ArrowDown"]) {
    playerY += playerSpeed;
  }
  if (keysPressed["ArrowLeft"]) {
    playerX -= playerSpeed;
  }
  if (keysPressed["ArrowRight"]) {
    playerX += playerSpeed;
  }

  if (playerX > canvas.width - 16) {
    playerX = 16;
  }
  if (playerX < 16) {
    playerX = canvas.width - 16;
  }
  if (playerY > canvas.height - 16) {
    playerY = 16;
  }
  if (playerY < 16) {
    playerY = canvas.height - 16;
  }

  // Check if player and kitty collided. Our images
  // are 32 pixels big.

  // Pick a new location for the kitty.
  // Note: Change this to place the kitty at a new, random location.
  if (
    playerX <= kittyX + 32 &&
    kittyX <= playerX + 32 &&
    playerY <= kittyY + 32 &&
    kittyY <= playerY + 32
  ) {
    score++;
    foodPresent = false;
    kittyX = Math.random() * canvas.width - 32;
    kittyY = Math.random() * canvas.height - 32;
    meow.play();
  }
  //monster attack
  if (
    playerX <= monsterX + 32 &&
    monsterX <= playerX + 32 &&
    playerY <= monsterY + 32 &&
    monsterY <= playerY + 32
  ) {
    lives--;
    foodPresent = false;
    monsterX = Math.random() * canvas.width - 32;
    monsterY = Math.random() * canvas.height - 32;
    kittyX = Math.random() * canvas.width - 32;
    kittyY = Math.random() * canvas.height - 32;
  }

  if (playerX >= monsterX) {
    monsterX = monsterX + monsterSpeed;
  }
  if (playerX <= monsterX) {
    monsterX = monsterX - monsterSpeed;
  }
  if (playerY >= monsterY) {
    monsterY = monsterY + monsterSpeed;
  }
  if (playerY <= monsterY) {
    monsterY = monsterY - monsterSpeed;
  }

  if ((foodPresent = true)) {
    if (playerX >= kittyX) {
      kittyX = kittyX + kittySpeed;
    }
    if (playerX <= kittyX) {
      kittyX = kittyX - kittySpeed;
    }
    if (playerY >= kittyY) {
      kittyY = kittyY + kittySpeed;
    }
    if (playerY <= kittyY) {
      kittyY = kittyY - kittySpeed;
    }
  }

  // var name = playerInput.nodeValue;
};

/**
 * This function, render, runs as often as possible.
 */
function render() {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (playerReady) {
    ctx.drawImage(playerImage, playerX, playerY);
  }
  if (kittyReady) {
    ctx.drawImage(kittyImage, kittyX, kittyY);
  }
  if (monsterReady) {
    ctx.drawImage(wingMonster, monsterX, monsterY);
  }
  ctx.font = "16px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText(`Lives: ${lives}`, 10, 280);
  ctx.fillText(`Rescued cats: ${score}`, 10, 300);
  ctx.fillText(
    `Seconds Remaining: ${SECONDS_PER_ROUND - elapsedTime}`,
    10,
    320
  );
  ctx.fillText(`Food: ${food}`, 10, 260);

  if (lives === 0 || elapsedTime >= SECONDS_PER_ROUND) {
    alert("GAME OVER");
    startTime = Date.now();
    totalScore += score;
    lives = 5;
    score = 0;
    food = 1;
    currentlvl = 1;
    lvl.innerHTML = `Level ${currentlvl}`;
    start();
    if (totalScore > highestScore) {
      highestScore = totalScore;
      highScore.innerHTML = `Highscore: ${highestScore}`;
    }
  } else if (score === kittyspPerRound) {
    alert("YOU WIN");
    startTime = Date.now();
    monsterSpeed = 0;
    kittySpeed = 0;
    playerSpeed = 0;
    lives = 5;
    score = 0;
    food = 1;
    totalScore += score;
    nextLvl.style.visibility = "visible";
  }

  //food
  if (keysPressed["Spacebar"] || keysPressed[" "]) {
    if (food > 0) {
      foodPresent = true;
      ctx.drawImage(foodImage, playerX, playerY);
      food--;
    } else {
      foodPresent = false;
    }
  }
}

function lvlTwo() {
  totalScore += 10;
  score = 0;
  lives = lives + 2;
  startTime = Date.now();
  elapsedTime = 0;
  kittyspPerRound += 2;
  monsterSpeed += 2;
  playerSpeed += 2;
  nextLvl.style.visibility = "hidden";
  currentlvl++;
  lvl.innerHTML = `Level ${currentlvl}`;
}

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our player and kitty)
 * render (based on the state of our game, draw the right things)
 */
function main() {
  update();
  render();
  // Request to do this again ASAP. This is a special method
  // for web browsers.
  requestAnimationFrame(main);
}

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
var w = window;
requestAnimationFrame =
  w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame ||
  w.msRequestAnimationFrame ||
  w.mozRequestAnimationFrame;

// Let's play this game!
loadImages();
loadAudio();
setupKeyboardListeners();
main();
