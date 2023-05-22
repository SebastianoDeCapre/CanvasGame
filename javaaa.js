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
let PlayerDead = false

let randomSpread = 0

let shootingInterval;

let shootingAnimationInterval;

let isDown = false

let shootingCooldown = false

let shootingPicture = false

let turretImage = 0;

let frameTimer = 0

const turretShooting = new Image(); // Create new img element
turretShooting.src = "turretShooting.png"; // Set source path

const turrentNotShooting = new Image(); // Create new img element
turrentNotShooting.src = "turretNotShooting.png"; // Set source path

// Purple object variables
let purpleX = playerX + playerWidth / 2;
let purpleY = playerY + playerHeight / 2;
let purpleWidth = 30;
let purpleHeight = 100;


//*** simple enemy ***//

let enemyY = 5;
let enemyWidth = 30;
let enemyHeight = 30;
let enemyX = 0;

//** Enemy projectile varibels */
let enemyLaserX = 0;
let enemyLaserY= 0; 
let enemyLaserHeight = 10;
let enemyLaserWidth = 5;
let enemyLaserSpeed = 10;
let enemyIsShooting = false;
let enemyLaserDY = 0;

let lasers = []

function enemyMovement(enemyX) {
  if (enemyX >= 750) {
    speed = -2;
  } else if (enemyX <= 5) {
    speed = 2
  }

  enemyX += speed;

  return enemyX
}

function createEnemyLaser(enemyX, enemyY) {

  const laserWidth = 5;
  const laserHeight = 10;
  const laserSpeed = 6;
  const laserColor = "#FF0000"; // red color for the laser

  const laserX = enemyX + (enemyLaserWidth / 2) - (laserWidth / 2) + 15; // laser x position centered with the block
  const laserY = enemyY + enemyLaserHeight; // laser starts at the bottom of the block

  lasers.push({
    x: laserX,
    y: laserY,
    width: laserWidth,
    height: laserHeight,
    color: laserColor,
    dy: laserSpeed // the laser moves downwards, so the dy value is positive
  });

}

enemies = []

function createShooterBullet(shooter) {
  const bulletSpeed = 3;
  const deltaX = playerX + 7.5 - shooter.x;
  const deltaY = playerY + 25 - shooter.y;
  const angle = Math.atan2(deltaY, deltaX);
  const projectileDX = bulletSpeed * Math.cos(angle);
  const projectileDY = bulletSpeed * Math.sin(angle);

  bullets.push({
    projectileX: shooter.x,
    projectileY: shooter.y,
    projectileDX,
    projectileDY,
    isPlayerBullet: false, // Indicate that it's a shooter's bullet
  });
}

function createShooter() {
  const shooter = {
    x: Math.random() * gameCanvas.width, // Random x-coordinate
    y: 0, // Starting y-coordinate (top of the canvas)
    width: 20, // Block width
    height: 20, // Block height
    speed: 2, // Falling speed
    fireRate: 1000, // Fire rate in milliseconds
    lastFireTime: Date.now() // Initialize last fire time
    
  };

  enemies.push(shooter);
}

function updateShooters() {
  enemies.forEach((enemy) => {
    if (Date.now() - enemy.lastFireTime > enemy.fireRate) {
      if (enemy.type === 'multishooter') {
        createMultishooterBullet(enemy);
      } else {
        createShooterBullet(enemy);
      }
      enemy.lastFireTime = Date.now();
    }
  });
}

function createMultishooterBullet(enemy) {
  const bulletSpeed = 3;
  const bulletAngles = [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI, (5 * Math.PI) / 4, (3 * Math.PI) / 2, (7 * Math.PI) / 4];

  bulletAngles.forEach((angle) => {
    const projectileDX = bulletSpeed * Math.cos(angle);
    const projectileDY = bulletSpeed * Math.sin(angle);

    bullets.push({
      projectileX: enemy.x + 15,
      projectileY: enemy.y + 15,
      projectileDX,
      projectileDY: projectileDY + 1,
      isPlayerBullet: false,
    });
  });
}

function createMultishooter() {
  const multishooter = {
    x: Math.random() * gameCanvas.width, // Random x-coordinate
    y: 0, // Starting y-coordinate (top of the canvas)
    width: 30, // Block width
    height: 30, // Block height
    speed: 1, // Falling speed
    fireRate: 2000, // Fire rate in milliseconds
    lastFireTime: Date.now(), // Initialize last fire time
    fireCooldown: 0,
    type: "multishooter",
  };

  enemies.push(multishooter);


}


function enemyCollisionCheck() {
  bullets.forEach((bullet, bulletIndex) => {
    enemies.forEach((enemy, enemyIndex) => {
      if (
        bullet.projectileX < enemy.x + enemy.width &&
        bullet.projectileX + projectileSize > enemy.x &&
        bullet.projectileY < enemy.y + enemy.height &&
        bullet.projectileY + projectileSize > enemy.y
      ) {
        // Collision detected with player's bullet
        if (bullet.isPlayerBullet === true) {
          // Remove the block and the player's bullet
          enemies.splice(enemyIndex, 1);
          bullets.splice(bulletIndex, 1);
        } else {
          console.log("i hit myself")
        }
      }
    });
  });
}

let enemyHp = 20;

function bossCollisionCheck() {
  bullets.forEach((bullet, bulletIndex) => {
      if (
        bullet.projectileX < enemyX + enemyWidth &&
        bullet.projectileX + projectileSize > enemyX &&
        bullet.projectileY < enemyY + enemyHeight &&
        bullet.projectileY + projectileSize > enemyY && boss === true && bullet.isPlayerBullet === true
      ) {
        // Collision detected with player's bullet    
          bullets.splice(bulletIndex, 1);
          enemyHp--
          if (enemyHp <= 0) {
            boss = false
            enemyHp = 20
            health++
        } 
      }
    });
  }




let immunity = false

let health = 2

function checkCollisions() {
  // Loop through all the enemy lasers
  for (let i = 0; i < lasers.length; i++) {
    const laser = lasers[i];

    // Check for collision with the player
    if (laser.x < playerX + playerWidth &&
        laser.x + laser.width > playerX &&
        laser.y < playerY + playerHeight &&
        laser.y + laser.height > playerY) {
      // Collision detected
      // Remove the player and the laser from the canvas
      c.clearRect(playerX, playerY, playerWidth, playerHeight);
      c.clearRect(laser.x, laser.y, laser.width, laser.height);

      // Remove the laser from the lasers array
      lasers.splice(i, 1);

      if (immunity === true) {
        console.log("immunity");
        return;
      } else if (immunity === false && health > 0) {
        immunity = true;
        health -= 1;

        setTimeout(function() {
          immunity = false;
          console.log("Immunity expired");
        }, 3000); // Delay in milliseconds (3 seconds);
      } else {
        PlayerDead = true;
        console.log("ded");
      }

      return PlayerDead, health, immunity;
    }
  }

  // Loop through all the new projectiles
  for (let i = 0; i < bullets.length; i++) {
    const bullet = bullets[i];

    // Check for collision with the player
    if (bullet.projectileX < playerX + playerWidth &&
        bullet.projectileX + projectileSize > playerX &&
        bullet.projectileY < playerY + playerHeight &&
        bullet.projectileY + projectileSize > playerY) {
      // Collision detected
      // Remove the player and the bullet from the canvas
      if (bullet.isPlayerBullet === false) {
        c.clearRect(playerX, playerY, playerWidth, playerHeight);
        c.clearRect(bullet.projectileX, bullet.projectileY, projectileSize, projectileSize);

        // Remove the bullet from the bullets array
        bullets.splice(i, 1);

        if (immunity === true) {
          console.log("immunity");
          return;
        } else if (immunity === false && health > 0) {
          immunity = true;
          health -= 1;

          setTimeout(function() {
            immunity = false;
            console.log("Immunity expired");
          }, 1000); // Delay in milliseconds (3 seconds);
        } else {
          PlayerDead = true;
          console.log("ded");
        }
      } else {
        console.log("nah")
      }

        return PlayerDead, health, immunity;
    }
  }
}


/** **/

let directions = {
  left: false,
  right: false,
  up: false,
  down: false,
};

boss = false

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
        if (Math.random() > 0.05) {
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
            isPlayerBullet: true, // Indicate that it's a shooter's bullet
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

LaserPause = false
let setTime = 5000; // 2 seconds
let remainTime = 2000; // 5 seconds

function laserPauseInterval(LaserPause) {
  LaserPause = false;
  setTimeout(function() {
    LaserPause = true;
  }, remainTime);
  return LaserPause
}

GapCounter = 0

phase = 1

frameTimer = 0

points = 0;

let resetButton = document.getElementById("resetButton")

let healthDisplay = document.getElementById("health-display");

let immunityDisplay = document.getElementById("immunity-display");

let scoreDisplay = document.getElementById("score-display");

let phaseDisplay = document.getElementById("phase-display");

let bossDisplay = document.getElementById("boss-display");


// -------------------------------------
// ------------ Animation ------------
function animate() {
  requestAnimationFrame(animate); // Run gameloop recursively
  c.clearRect(0, 0, gameCanvas.width, gameCanvas.height); // Clear screen

  if (PlayerDead === true) {
    resetButton.style.display = "block";
    healthDisplay.innerHTML = health;
  } else {
    // Draw black player
    c.fillRect(playerX, playerY, playerWidth, playerHeight);

    // Update purple object position based on black player position
    purpleX = playerX + playerWidth / 2;
    purpleY = playerY + playerHeight / 2;

    if (isDown) {
      createBullet()
    }


   
    if (boss === true) {
      enemyX = enemyMovement(enemyX)
      c.fillStyle = "red";
      c.fillRect(enemyX, enemyY, enemyHeight, enemyWidth);
    }


    if (GapCounter < 500) {
      createEnemyLaser(enemyX, enemyY)
      GapCounter += 3
    } else if (GapCounter >= 500 && GapCounter < 600) {
      GapCounter += 4
    } else if (GapCounter >= 600) {
      GapCounter = 0
    }

    if (boss === true) {
      for (let i = 0; i < lasers.length; i++) {
        const laser = lasers[i];
        laser.y += laser.dy;
      
        // check if the laser is off the canvas, and remove it from the array if it is
        if (laser.y < 0 || laser.y > gameCanvas.height) {
          lasers.splice(i, 1);
          i--;
          continue;
        }
      
        // draw the laser on the canvas
        c.fillStyle = laser.color;
        c.fillRect(laser.x, laser.y, laser.width, laser.height);

      }
    }

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
      if (bullets[index].isPlayerBullet) {
        c.fillStyle = 'blue';
      }
      c.fillRect(bullets[index].projectileX - projectileSize / 2, bullets[index].projectileY - projectileSize / 2, projectileSize, projectileSize);
      c.fillStyle = 'red';
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


    // Call createEnemyLaser() function to create laser
    createEnemyLaser();

    // Loop through lasers array and update each laser position
    for (let i = 0; i < lasers.length; i++) {
      const laser = lasers[i];
      laser.enemyLaserY += laser.enemyLaserDY;
    
      // Draw laser on canvas
      c.fillStyle = "red";
      c.fillRect(laser.enemyLaserX, laser.enemyLaserY, 10, 20);
    
      // Remove laser if it goes off-screen
      if (laser.enemyLaserY < 0 || laser.enemyLaserY > gameCanvas.height) {
        lasers.splice(i, 1);
        i--;
      }
    }

    checkCollisions(PlayerDead);

    console.log(health)

    enemies.forEach(shooter => {
      shooter.y += shooter.speed;

      if (shooter.type === "multishooter") {
        c.fillStyle = 'purple';
        c.fillRect(shooter.x, shooter.y, shooter.width, shooter.height);
      } else {
        c.fillStyle = 'blue';
        c.fillRect(shooter.x, shooter.y, shooter.width, shooter.height);
      }


    })


    c.fillStyle = 'red'

    // enemies.forEach((enemy) => {
    //   if (enemy.type === 'multishooter') {
    //     createMultishooterBullet(enemy);
    //   }
    // });

    frameTimer += 1

    if (frameTimer % 2000 === 0) {
      frameTimer -= 2000
      phase += 1
      if (boss === false) {
        boss = true
      }
    }

    bossCollisionCheck()



    if (phase === 1) {
      if (frameTimer % 160 === 0) {
          createShooter()
      }
  } else if (phase === 2) {
      if (frameTimer % 100 === 0) {
          createShooter()
      }
  } else if (phase > 2) {
      if (frameTimer % 60 === 0) {
          createShooter()
      }
  } 

  if (phase === 1) {
    if (frameTimer % 330 === 0) {
        createMultishooter()
    }
} else if (phase === 2) {
    if (frameTimer % 220 === 0) {
        createMultishooter()
    }
} else if (phase > 2) {
    if (frameTimer % 110 === 0) {
        createMultishooter()
    }
} 

  enemyCollisionCheck()
  updateShooters();
  

  console.log(phase)
  console.log(frameTimer)

  healthDisplay.innerHTML = "Health " + (health + 1);

  scoreDisplay.innerHTML = "Score " + points;

  phaseDisplay.innerHTML = "Phase " + phase;


  if (boss === true) {
    bossDisplay.innerHTML = "Boss Health " + enemyHp;
    bossDisplay.style.display = "block";
  } else {
    bossDisplay.style.display = "none";
  }
  
  if (immunity === true) {
    immunityDisplay.style.display = "block";
  } else {
    immunityDisplay.style.display = "none";
  }

  if (frameTimer % 20 === 0) {
    points += 1
  }




  }
}

// -------------------------------------
// ------------ Start game ------------
animate();

resetButton.addEventListener("click", () => {
  location.reload();
});

