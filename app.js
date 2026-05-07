const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const restartBtn = document.getElementById("restart");
const gameOverEl = document.getElementById("gameOver");

const box = 20;
const canvasSize = 400;

let snake;
let food;
let direction;
let game;
let score;
let best = localStorage.getItem("snakeBest") || 0;

bestEl.innerText = best;

// START
function init() {

  snake = [
    { x: 10 * box, y: 10 * box }
  ];

  food = randomFood();

  direction = "RIGHT";

  score = 0;
  scoreEl.innerText = score;

  gameOverEl.classList.add("hidden");

  clearInterval(game);
  game = setInterval(draw, 100);
}

// RANDOM FOOD
function randomFood() {
  return {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
  };
}

// DRAW
function draw() {

  // background
  ctx.fillStyle = "#0b1220";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // grid
  ctx.strokeStyle = "rgba(255,255,255,0.05)";

  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    ctx.moveTo(i * box, 0);
    ctx.lineTo(i * box, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i * box);
    ctx.lineTo(canvas.width, i * box);
    ctx.stroke();
  }

  // snake
  snake.forEach((part, index) => {

    if (index === 0) {
      ctx.fillStyle = "#22c55e";
    } else {
      ctx.fillStyle = "#4ade80";
    }

    ctx.beginPath();
    ctx.roundRect(part.x, part.y, box, box, 6);
    ctx.fill();
  });

  // food glow
  ctx.shadowColor = "#ef4444";
  ctx.shadowBlur = 20;

  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.arc(food.x + 10, food.y + 10, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 0;

  // move
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "LEFT") snakeX -= box;
  if (direction === "UP") snakeY -= box;
  if (direction === "RIGHT") snakeX += box;
  if (direction === "DOWN") snakeY += box;

  // eat
  if (snakeX === food.x && snakeY === food.y) {

    score++;
    scoreEl.innerText = score;

    if (score > best) {
      best = score;
      localStorage.setItem("snakeBest", best);
      bestEl.innerText = best;
    }

    food = randomFood();

  } else {
    snake.pop();
  }

  const newHead = {
    x: snakeX,
    y: snakeY
  };

  // wall collision
  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= canvasSize ||
    snakeY >= canvasSize ||
    collision(newHead, snake)
  ) {
    gameOver();
    return;
  }

  snake.unshift(newHead);
}

// COLLISION
function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) {
      return true;
    }
  }
  return false;
}

// GAME OVER
function gameOver() {
  clearInterval(game);
  gameOverEl.classList.remove("hidden");
}

// KEYBOARD
document.addEventListener("keydown", (e) => {

  if (e.key === "ArrowLeft" && direction !== "RIGHT") {
    direction = "LEFT";
  }

  if (e.key === "ArrowUp" && direction !== "DOWN") {
    direction = "UP";
  }

  if (e.key === "ArrowRight" && direction !== "LEFT") {
    direction = "RIGHT";
  }

  if (e.key === "ArrowDown" && direction !== "UP") {
    direction = "DOWN";
  }

});

// RESTART
restartBtn.addEventListener("click", init);

// START GAME
init();