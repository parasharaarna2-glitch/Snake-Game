const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake;
let food;
let score;
let highScore = localStorage.getItem("highScore") || 0;
let direction;
let game;

document.getElementById("highScore").innerText = highScore;

function startGame() {
  snake = [{ x: 200, y: 200 }];
  food = randomFood();
  score = 0;
  direction = "RIGHT";

  if (game) clearInterval(game);
  game = setInterval(draw, 100);
}

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
  if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  else if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box
  };
}

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "lime" : "green";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // Move snake
  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "UP") headY -= box;
  if (direction === "DOWN") headY += box;
  if (direction === "LEFT") headX -= box;
  if (direction === "RIGHT") headX += box;

  // Eat food
  if (headX === food.x && headY === food.y) {
    score++;
    food = randomFood();
  } else {
    snake.pop();
  }

  let newHead = { x: headX, y: headY };

  // Collision
  if (
    headX < 0 || headY < 0 ||
    headX >= canvas.width || headY >= canvas.height ||
    collision(newHead, snake)
  ) {
    clearInterval(game);

    if (score > highScore) {
      localStorage.setItem("highScore", score);
    }

    alert("Game Over! Score: " + score);
    return;
  }

  snake.unshift(newHead);

  document.getElementById("score").innerText = score;
  document.getElementById("highScore").innerText = localStorage.getItem("highScore");
}

function collision(head, body) {
  return body.some(segment => segment.x === head.x && segment.y === head.y);
}
