const gridSize = 50;
const cellType = ["Blank", "Speeder", "Lava", "Mud"];
const effects = {
    Blank : {Health: 0, Moves: -1},
    Speeder : {Health: -5, Moves: 0},
    Lava : {Health: -50, Moves: -10},
    Mud : {Health: -10, Moves: -5},
};

let player, end, grid;

const gridContainer = document.getElementById("grid")
const playerHealth = document.getElementById("health")
const playerMoves = document.getElementById("moves")
const healthBar = document.getElementById("healthBar");
const moveBar = document.getElementById("movesBar");
const lastTileSpan = document.getElementById("lastTile");
const restartButton = document.getElementById("restartButton");

// Grid Display
function createGrid() {
    player = {x: 0, y: 0, health: 200, moves: 450};
    end = {x: 49, y: 49};
    grid = [];
    gridContainer.innerHTML = "";

    //Create Blank Grid for player
    for (let i = 0; i < gridSize; i++) {
        const rows = [];
        for (let x = 0; x < gridSize; x++) {
            const type = cellType[Math.floor(Math.random() * cellType.length)];
            const cell = document.createElement("div");
            cell.className = `cell ${type}`
            gridContainer.appendChild(cell);
            rows.push({type, element: cell});
        }
        grid.push(rows);
    }

    //Safe Path Generation
    let x = 0, y = 0;
    while (x < gridSize - 1 || y < gridSize - 1) {
        if (x == gridSize - 1) {
            y++;
        } else if (y == gridSize - 1) {
            x++;
        } else {
            Math.random() < 0.5 ? x++ : y++;
        }
        grid[y][x].type = "Blank";
    }

    // Fill non-path tiles with random type
    for (let y = 0; y < gridSize; y++) {
        for(let x = 0; x < gridSize; x++) {
            if (grid[y][x].type != "Blank") {
                const type = cellType[Math.floor(Math.random() * cellType.length)];
                grid[y][x].type = type;
                grid[y][x].element.className = `cell ${type}`;
            }
        }
    }

    //Starting and ending points
    grid[player.y][player.x].element.classList.add("player");
    grid[end.y][end.x].element.classList.add("end");
    updateStat();
    lastTileSpan.textContent = "Blank";
}




//Movement Function
function move(px, py) {
    const newX = player.x + px;
    const newY = player.y + py;
    
    if (newX < 0 || newX >= gridSize || newY < 0 || newY >= gridSize) {
        return;
    }

    //Remove previous player class
    grid[player.y][player.x].element.classList.remove("player"); 

    player.x = newX;// Update postion X
    player.y = newY; // Update postion Y

    // const currentType = grid[newY][newX].type;
    // const effect = effects[currentType];
    const tile = grid[newY][newX];
    const effect = effects[tile.type];

    player.health += effect.Health;
    player.moves += effect.Moves;

    lastTileSpan.textContent = tile.type;

    //Animate and Highlight player tile
    tile.element.classList.add("Highlighted");
    setTimeout(() => tile.element.classList.remove("Highlighted"), 300);

    

    //Adding player marker
    tile.element.classList.add("player");

    checkGame();
    updateStat();


}

function checkGame() {
    
    if(player.health <= 0 || player.moves <= 0) {
        updateStat();
        alert("Game Over!");
        document.removeEventListener("keydown", handleKey);
        return;
    }

    if (player.x == end.x && player.y == end.y) {
        updateStat();
        alert("Yay Round Won!!!");
        document.removeEventListener("keydown", handleKey);
        return;
    }
}

function updateStat() {
    playerHealth.textContent = player.health;
    playerMoves.textContent = player.moves;

    const healthPercent = Math.max((player.health / 200) * 100, 0);
    const movePerc = Math.max((player.moves / 450)* 100, 0);

    healthBar.style.width = `${healthPercent}%`;
    moveBar.style.width = `${movePerc}%`;

    healthBar.style.backgroundColor = healthPercent < 30 ? "#f44336": "#4caf50";
    moveBar.style.backgroundColor = movePerc < 30 ? "#ff9800" : "#2196f3";
}

function handleKey(e) {
    switch (e.key) {
        case "ArrowUp": move(0, -1); break;
        case "ArrowDown": move(0, 1); break;
        case "ArrowLeft" : move( -1, 0); break;
        case "ArrowRight" : move(1, 0); break;
    }
}

restartButton.addEventListener("click", () => {
    document.removeEventListener("keydown", handleKey);
    createGrid();
    document.addEventListener("keydown", handleKey);
});

document.addEventListener("keydown", handleKey);
createGrid();
