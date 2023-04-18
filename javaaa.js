window.focus();
const SCREENWIDTH = innerWidth;
const SCREENHEIGHT = innerHeight;
let gameCanvas = document.getElementById("gameCanvas");
let c = gameCanvas.getContext("2d"); // Drawing object
gameCanvas.height = SCREENHEIGHT/ 1.1;
gameCanvas.width = SCREENWIDTH /2;



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

let randomSpread = 0

let shootingInterval;

let shootingAnimationInterval;

let isDown = false

let shootingCooldown = false

let shootingPicture = false

let turretImage = 0;

const turretShooting = new Image(); // Create new img element
turretShooting.src = "turretShooting.png"; // Set source path

const turrentNotShooting = new Image(); // Create new img element
turrentNotShooting.src = "turretNotShooting.png"; // Set source path

// Purple object variables
let purpleX = playerX + playerWidth / 2;
let purpleY = playerY + playerHeight / 2;
let purpleWidth = 30;
let purpleHeight = 100;


// simple enemy //

let enemyY = 40;
let enemyWidth = 30;
let enemyHeight = 30;
let enemyX = 20;

let enemyLaserX = 0;
let enemyLaserY= 0; 
let enemyLaserHeight = 10;
let enemylaserWidth = 5;

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

  // Projectile variables
let projectileX = purpleX;
let projectileY = purpleY;
let projectileSize = 5;
let projectileSpeed = 8;
let isShooting = false;
let bullets = [];

// ------------ Shooting ------------
document.addEventListener("mousedown", (e) => {
    isDown = true
});

document.addEventListener("mouseup", (e) => {
    isDown = false
})

function enemyMovement(enemyX) {
  if (enemyX >= 600) {
    speed = -2;
  } else if (enemyX <= 20) {
    speed = 2
  }

  enemyX += speed;

  return enemyX
}


function createEnemyLaser() {
  if (!shootingcooldown)
}

function createBullet() {
    if (!shootingCooldown) {
        shootingCooldown = true;
        startShootingInterval();
        shootingPicture = true;
        startShootingAnimationInterval();

        projectileX = purpleX;
        projectileY = purpleY;
        const deltaX = playerX - mouseX;
        const deltaY = playerY - mouseY;

        randomSpread = Math.random() * 0.05
        if (Math.random() > 0.5) {
            randomSpread = -randomSpread
        }

        let angle = Math.atan2(deltaY, deltaX) + Math.PI + randomSpread;
        // angle += randomSpread

        projectileDX = projectileSpeed * Math.cos(angle);
        projectileDY = projectileSpeed * Math.sin(angle);

        bullets.push({
            projectileX,
            projectileY,
            projectileDX,
            projectileDY,
        })
    }
}


function startShootingInterval() {
    clearInterval(shootingInterval);
    shootingInterval = setInterval(function() {
      // Code to be executed every 250 milliseconds
      shootingCooldown = false;
    }, 250);
  }

  function startShootingAnimationInterval() {
    clearInterval(shootingAnimationInterval);
    shootingAnimationInterval = setInterval(function() {
      // Code to be executed every 250 milliseconds
      shootingPicture = false
    }, 150);
  }

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

  if (isDown) {
    createBullet()
  }


  enemyX = enemyMovement(enemyX)

  c.fillStyle = "red";
  c.fillRect(enemyX, enemyY, enemyHeight, enemyWidth);
  
  
  const deltaX = playerX - mouseX;
  const deltaY = playerY - mouseY;
  let angle = Math.atan2(deltaY, deltaX) - Math.PI / 2;
  // Handle angle wraparound
if (angle < -Math.PI/2) {
    angle += 2*Math.PI;
  } else if (angle > Math.PI/2) {
    angle -= 2*Math.PI;
  }

  // Draw projectile if it's shooting and removes it if it is out of bounds
  for (let index = 0; index < bullets.length; index++) {
    bullets[index].projectileX += bullets[index].projectileDX
    bullets[index].projectileY += bullets[index].projectileDY
    c.fillRect(bullets[index].projectileX - projectileSize / 2, bullets[index].projectileY - projectileSize / 2, projectileSize, projectileSize);
    if (bullets[index].projectileY > gameCanvas.height || bullets[index].projectileY < 0 || bullets[index].projectileX > gameCanvas.width || bullets[index].projectileX < 0 ) {
        bullets.splice(index, 1);
    }

    
} 
    //   // Draw Cannon object
  c.save();
  c.translate(purpleX, purpleY);
  c.rotate(angle);
  c.fillStyle = "purple";
  if (shootingPicture) {
    turretImage = turretShooting
  } else {
    turretImage = turrentNotShooting
  }

  c.drawImage(turretImage, -purpleWidth / 2, -purpleHeight / 2, purpleWidth, purpleHeight);


  c.restore();

    
    // Stop shooting if the projectile goes out of screen    
    

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
