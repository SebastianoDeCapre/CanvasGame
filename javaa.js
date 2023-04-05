window.focus();
const SCREENWIDTH = innerWidth;
const SCREENHEIGHT = innerHeight;
let gameCanvas = document.getElementById("gameCanvas");
let c = gameCanvas.getContext("2d"); // Drawing object
gameCanvas.height = SCREENHEIGHT/ 1.1;
gameCanvas.width = SCREENWIDTH /1.1;

// -------------------------------------
// Player variables
let playerX = 100;
let playerY = 100;
let playerWidth = 20;
let playerHeight = 30;
let dx = 4;
let dy = 4;
let mouseX = 0;
let mouseY = 0;

// Purple object variables
let purpleX = playerX + playerWidth / 2;
let purpleY = playerY + playerHeight / 2;
let purpleWidth = 30;
let purpleHeight = 10;

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




document.addEventListener("mousemove", (e) => {
    const canvasRect = gameCanvas.getBoundingClientRect();
    mouseX = e.clientX - canvasRect.left - 10;
    mouseY = e.clientY - canvasRect.top - 10;
  });



// -------------------------------------
// ------------ Animation ------------
function animate() {
  requestAnimationFrame(animate); // Run gameloop recursively
  c.clearRect(0, 0, gameCanvas.width, gameCanvas.height); // Clear screen

  // Draw black player
  c.fillRect(playerX, playerY, playerWidth, playerHeight);

  // Update purple object position based on black player position
  purpleX = playerX + playerWidth / 2;
  purpleY = playerY + playerHeight / 2;

  
  const deltaX = playerX - mouseX;
  const deltaY = playerY - mouseY;
  let angle = Math.atan2(deltaY, deltaX);
  // Handle angle wraparound
if (angle < -Math.PI/2) {
    angle += 2*Math.PI;
  } else if (angle > Math.PI/2) {
    angle -= 2*Math.PI;
  }
    //   // Draw purple object
  c.save();
  c.translate(purpleX, purpleY);
  c.rotate(angle);
  c.fillStyle = "purple";
  c.fillRect(-purpleWidth / 2, -purpleHeight / 2, purpleWidth, purpleHeight);
  c.restore();


  //Updates the players position and moves diagonally

  if (directions.right && directions.down) {
    playerX += dx / Math.sqrt(2)
    playerY += dy / Math.sqrt(2)
  } else if (directions.right && directions.up) {
    playerX += dx / Math.sqrt(2) 
    playerY -= dy / Math.sqrt(2)
  } else if (directions.left && directions.down) {
    playerX -= dx / Math.sqrt(2) 
    playerY += dy / Math.sqrt(2)
  } else if (directions.left && directions.up) {
    playerX -= dx / Math.sqrt(2) 
    playerY -= dy / Math.sqrt(2)
  } else if (directions.right) {
    playerX += dx;
  } else if (directions.left) {
    playerX -= dx;
  } else if (directions.up) {
    playerY -= dy;
  } else if (directions.down) {
    playerY += dy;
  }

  if (playerX < 0) {
    playerX = 0;
  }
  
  // Check if the player is outside the right edge of the canvas
  if (playerX + playerWidth > gameCanvas.width) {
    playerX = gameCanvas.width - playerWidth;
  }
  
  // Check if the player is outside the top edge of the canvas
  if (playerY < 0) {
    playerY = 0;
  }
  
  // Check if the player is outside the bottom edge of the canvas
  if (playerY + playerHeight > gameCanvas.height) {
    playerY = gameCanvas.height - playerHeight;
  }
}

// -------------------------------------
// ------------ Start game ------------
animate();
