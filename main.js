// create board
// create game func

/*
Game
  Init
  Play
  Over
Board
  Init
  Place Ships
  Win?
Player
  Turns
*/

function Game() {
  this.Board = new Board();
  this.Player = new Player();


}

function Board() {
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
      cell.id = 'cell-' + j;
      cell.classList.add('cell');
      cell.classList.add('hidden');

      if(this.grid[i][j]) {
        cell.addEventListener(
          'click',
          this.grid[i][j].handleClick(cell)
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
  // Handle click event logic w/ Game
  return () => {
    cell.classList.remove('hidden');
    cell.classList.add('revealed');
  }
};

function Player() {

}

function Ship(size) {
  this.size = size;
}

Ship.prototype.handleClick = function (cell) {
  return () => {
    this.size --;

    if(this.size === 0) {
      alert('Ship murked!!');
    }

    cell.classList.remove('hidden');
    cell.classList.add('hit');
  }
};

const bored = new Board();
console.log(bored);
