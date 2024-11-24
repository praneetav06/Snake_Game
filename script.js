// Game Constants and Variables
let inputDir = {
  x: 0,
  y: 0,
};
const foodSound = new Audio("./music/food.mp3");
const gameOverSound = new Audio("./music/gameOver.mp3");
const moveSound = new Audio("./music/move.mp3");
const bgSound = new Audio("./music/music.mp3");
let speed = 5;
let lastPaintTime = 0;
let snakeArr = [
  {
    x: 15,
    y: 15,
  },
];
let food = {
  x: 10,
  y: 10,
};
let score = 0;

//Game Functions
function main(currTime) {
  window.requestAnimationFrame(main);
  if ((currTime - lastPaintTime) / 1000 < 1 / speed) {
    return;
  }
  lastPaintTime = currTime;
  gameEngine();
}

function isCollide(snake) {
  // if the snake hits its own body
  for (let i = 1; i < snakeArr.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }
  // if the snake hits the wall
  if (
    snake[0].x >= 18 ||
    snake[0].x <= 0 ||
    snake[0].y >= 18 ||
    snake[0].y <= 0
  ) {
    return true;
  }
  return false;
}

function gameEngine() {
  //Updating the snake array and the food
  if (isCollide(snakeArr)) {
    gameOverSound.play();
    bgSound.pause();
    inputDir = {
      x: 0,
      y: 0,
    };
    alert("Game Over. Press any key to start again!");
    snakeArr = [
      {
        x: 15,
        y: 15,
      },
    ];
    bgSound.play();
    score = 0;
  }

  //After eating the food, increment the score and regenerate the food and increase the snake body from the head
  if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
    foodSound.play();
    score += 1;
    if (score > highScoreVal) {
      highScoreVal = score;
      localStorage.setItem("highScore", JSON.stringify(highScoreVal));
      highScoreBox.innerHTML = "High Score: " + highScoreVal;
    }
    scoreBox.innerHTML = "Score: " + score;
    snakeArr.unshift({
      x: snakeArr[0].x + inputDir.x,
      y: snakeArr[0].y + inputDir.y,
    });
    let a = 5;
    let b = 15;
    food = {
      x: Math.round(a + (b - a) * Math.random()),
      y: Math.round(a + (b - a) * Math.random()),
    };
  }

  //Moving the snake
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] };
  }

  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;

  //Display the Snake and the Food
  board.innerHTML = "";
  //Display the snake
  snakeArr.forEach((el, index) => {
    snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = el.y;
    snakeElement.style.gridColumnStart = el.x;
    if (index === 0) {
      snakeElement.classList.add("head");
    } else {
      snakeElement.classList.add("snake");
    }
    board.appendChild(snakeElement);
  });

  //Display the food
  foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  board.appendChild(foodElement);
}

// check the high score in inspect>application>local storage
bgSound.play();
let highScore = localStorage.getItem("highScore");
if (highScore === null) {
  highScoreVal = 0;
  localStorage.setItem("highScore", JSON.stringify(highScoreVal));
} else {
  highScoreVal = JSON.parse(highScore);
  highScoreBox.innerHTML = "High Score: " + highScoreVal;
}

window.requestAnimationFrame(main); //call this function in main to create a game loop
window.addEventListener("keydown", (e) => {
  moveSound.play();
  switch (e.key) {
    case "ArrowUp":
      if (inputDir.y !== 1) {
        // Prevent moving down if currently moving up
        inputDir.x = 0;
        inputDir.y = -1;
      }
      break;
    case "ArrowDown":
      if (inputDir.y !== -1) {
        // Prevent moving up if currently moving down
        inputDir.x = 0;
        inputDir.y = 1;
      }
      break;
    case "ArrowLeft":
      if (inputDir.x !== 1) {
        // Prevent moving right if currently moving left
        inputDir.x = -1;
        inputDir.y = 0;
      }
      break;
    case "ArrowRight":
      if (inputDir.x !== -1) {
        // Prevent moving left if currently moving right
        inputDir.x = 1;
        inputDir.y = 0;
      }
      break;
    default:
      break;
  }
});
