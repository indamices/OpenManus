const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game variables
let snake = [{x: 200, y: 200}];
let food = {x: 100, y: 100};
let score = 0;
let dx = 10; // Change in x
let dy = 0;  // Change in y
let changingDirection = false;

// Game loop
function gameLoop() {
    setTimeout(function onTick() {
        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();
        drawScore();
        if (didGameEnd()) return;
        gameLoop();
    }, 100);
}

function clearCanvas() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    snake.forEach(drawSnakePart)
}

function drawSnakePart(snakePart) {
    ctx.fillStyle = 'lightgreen';
    ctx.strokeStyle = 'darkgreen';
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function moveSnake() {
  if (changingDirection) return;

  const head = {x: snake[0].x + dx, y: snake[0].y + dy};
  snake.unshift(head);

  const didEatFood = snake[0].x === food.x && snake[0].y === food.y;
  if (didEatFood) {
      score += 10;
      createFood();
  } else {
      snake.pop();
  }
}

function createFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / 10)) * 10,
        y: Math.floor(Math.random() * (canvas.height / 10)) * 10
    };

    snake.forEach(function isFoodOnSnake(part) {
        const foodIsOnSnake = part.x == food.x && part.y == food.y
        if (foodIsOnSnake) createFood()
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'darkred';
    ctx.fillRect(food.x, food.y, 10, 10);
    ctx.strokeRect(food.x, food.y, 10, 10);
}

function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > canvas.width - 10;
    const hitToptWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > canvas.height - 10;

    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText("Score: " + score, 10, 20);
}

function changeDirection(event) {
  const LEFT_KEY = 37;
  const UP_KEY = 38;
  const RIGHT_KEY = 39;
  const DOWN_KEY = 40;

  if (changingDirection) return;
  changingDirection = true;

  const keyPressed = event.keyCode;
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;

  if (keyPressed === LEFT_KEY && !goingRight) {
      dx = -10;
      dy = 0;
  }

  if (keyPressed === UP_KEY && !goingDown) {
      dx = 0;
      dy = -10;
  }

  if (keyPressed === RIGHT_KEY && !goingLeft) {
      dx = 10;
      dy = 0;
  }

  if (keyPressed === DOWN_KEY && !goingUp) {
      dx = 0;
      dy = 10;
  }
}

document.addEventListener('keydown', changeDirection);

gameLoop();
createFood();