function Game() {
  this.board = new Board(this);
  this.player = new Player();
  this.shipsCount = 17;
  document.addEventListener('DOMContentLoaded', this.initLife)
}

Game.prototype.handleClick = function(empty)  {
  if(empty) {
    this.player.life --;
    this.updateLife();
    if(this.player.life === 0) {
      this.lose();
    }
  } else {
    this.shipsCount --;
    if(this.shipsCount === 0) {
      this.win();
    }
  }
}

Game.prototype.initLife = function() {
  let main = document.getElementById('battleship'),
      life = document.createElement('div');

  life.id = 'life';
  life.innerText = 'life: 10';
  main.appendChild(life);
}
Game.prototype.updateLife = function() {
  let life = document.getElementById('life');

  life.innerText = 'life: ' + this.player.life;
}

Game.prototype.lose = function () {
  alert('You lost. You did not complete the system.');
  this.over();
};

Game.prototype.win = function () {
  alert('You win. You have completed the system.');
  this.over();
};

Game.prototype.over = function () {
  this.board.over();
};

function Board(game) {
  this.game = game;
  this.ships = [];
  this.grid = this.initGrid();
  this.placeShips();

  document.addEventListener('DOMContentLoaded', () => {
    this.initBoard();
  });
}

Board.prototype.initGrid = function () {
  let grid = [];

  for(let i = 0; i < 10; i ++) {
     let row = [];
     for(let j = 0; j < 10; j ++) {
       row.push(null);
     }

     grid[i] = row;
  }

  return grid;
};

Board.prototype.placeShips = function () {
  const ships = {
          'aircraft carrier': 5,
          'battleship': 4,
          'submarine': 3,
          'destroyer': 3,
          'scout': 2
        }

  for(let ship in ships) {
    let count = ships[ship];
    let placed = false;

    while(placed === false) {
      let dir = Math.random() < .5,
          coord = [];

      if(dir) {
        coord = [
                  Math.floor(Math.random() * (10 - count)),
                  Math.floor(Math.random() * 10)
                ];
      } else {
        coord = [
                  Math.floor(Math.random() * 10),
                  Math.floor(Math.random() * (10 - count))
                ];
      }

      if(this.validCoord(count, dir, coord)) {
        this.placeShip(count, dir, coord);
        placed = true;
      }
    }
  }
}

Board.prototype.placeShip = function (count, dir, coord) {
  let coords = [],
      ship = new Ship(count);

  if(dir) {
    for(let i = coord[0]; i < coord[0] + count; i ++) {
      this.grid[i][coord[1]] = ship;
    }
  } else {
    for(let i = coord[1]; i < coord[1] + count; i ++) {
      this.grid[coord[0]][i] = ship;
    }
  }

  this.ships.push(ship);
};

Board.prototype.validCoord = function (count, dir, coord) {
  if(dir) {
    for(let i = coord[0]; i < coord[0] + count; i ++) {
      if(this.grid[i][coord[1]]) {
        return false;
      }
    }
  } else {
    for(let i = coord[1]; i < coord[1] + count; i ++) {
      if(this.grid[coord[0]][i]) {
        return false;
      }
    }
  }

  return true;
}

Board.prototype.initBoard = function () {
  let main = document.getElementById('battleship');

  for(let i = 0; i < 10; i ++) {

    let row = document.createElement('ul');
    row.id = 'row-' + i;
    row.classList.add('row');

    for(let j = 0; j < 10; j ++) {
      let cell = document.createElement('li');
      cell.id = 'cell-' + i + '-' + j;
      cell.classList.add('cell');
      cell.classList.add('hidden');

      if(this.grid[i][j]) {
        cell.addEventListener(
          'click',
          this.grid[i][j].handleClick(cell, this.game)
        )
      } else {
        cell.addEventListener(
          'click',
          this.handleEmptyClick(cell)
        )
      }

      row.appendChild(cell);
    }

    main.appendChild(row);
  }
};

Board.prototype.handleEmptyClick = function (cell) {
  return () => {
    this.game.handleClick(true);
    cell.classList.remove('hidden');
    cell.classList.add('revealed');
  }
};

Board.prototype.over = function () {
  // Note that this doesn't work due to the functions being anonymous
  for(let i = 0; i < 10; i ++) {
    for(let j = 0; j < 10; j ++) {
      let cell = document.getElementById('cell-' + i + '-' + j);
      if(this.grid[i][j]) {
        cell.removeEventListener(
          'click',
          this.grid[i][j].handleClick(cell, this.game)
        );
      } else {
        cell.removeEventListener(
          'click',
          this.handleEmptyClick(cell)
        )
      }
    }
  }
};

function Player(life) {
  this.life = 10;
}

function Ship(size) {
  this.size = size;
}

Ship.prototype.handleClick = function (cell, game) {
  return () => {
    game.handleClick(false);
    this.size --;

    if(this.size === 0) {
      alert('Ship murked!!');
    }

    cell.classList.remove('hidden');
    cell.classList.add('hit');
  }
};

const game = new Game();
console.log(game);
