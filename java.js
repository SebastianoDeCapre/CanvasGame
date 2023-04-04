//  ------------ Setup ------------
window.focus;
const SCREENWIDTH = innerWidth;
const SCREENHEIGHT = innerHeight;
let gameCanvas = document.getElementById("gameCanvas");
let c = gameCanvas.getContext("2d"); // Drawing object
gameCanvas.height = SCREENHEIGHT / 2;
gameCanvas.width = SCREENWIDTH / 2;

// -------------------------------------
// Player variables
let playerX = 100;
let playerY = 100;
let playerWidth = 20;
let playerHeight = 20;
let dx = 4;
let dy = 2;

let directions = {
  left: false,
  right: false,
  up: false,
  down: false,
};
// -------------------------------------
// ------------ Player movement ------------
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "a":
      directions.left = true;
      break;
    case "d":
      directions.right = true;
      break;
    case "w":
      directions.up = true;
      break;
    case "s":
      directions.down = true;
      break;
    default:
      break;
  }
});






document.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "a":
      directions.left = false;
      break;
    case "d":
      directions.right = false;
      break;
    case "w":
      directions.up = false;
      break;
    case "s":
      directions.down = false;
      break;
    default:
      break;
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "q") {
    angle -= Math.PI / 4;
    draw();
  } else if (event.key === "e") {
    angle += Math.PI / 4;
    draw();
  }
});

// -------------------------------------
// ------------ Animation ------------
function animate() {
  requestAnimationFrame(animate); // Run gameloop recursively
  c.clearRect(0, 0, gameCanvas.width, gameCanvas.height,); // Clear screen

  c.fillRect(playerX, playerY, playerWidth, playerHeight); // Draw player

  if (directions.right) {
    playerX += dx;
  }

  if (directions.left) {
    playerX -= dx;
  }

  if (directions.up) {
    playerY -= dy;
  }

  if (directions.down) {
    playerY += dy;
  }

  
}
// -------------------------------------
// ------------ Start game ------------
animate();