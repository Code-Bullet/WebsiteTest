function setValues() {
  increaseEvery = 2;
  increaseMovesBy = 5;
  populationSize = 1000;
}

function setTiles() {
  playerPos = createVector(2, 1);

  tiles[0][0].wall = true;
  tiles[0][1].wall = true;
  tiles[0][2].wall = true;
  tiles[0][3].wall = true;
  tiles[0][4].wall = true;
  tiles[0][5].wall = true;
  tiles[0][6].wall = true;
  tiles[0][7].wall = true;
  tiles[0][8].wall = true;
  tiles[0][9].wall = true;
  tiles[0][10].wall = true;
  tiles[0][11].wall = true;
  tiles[0][12].wall = true;
  tiles[0][13].wall = true;
  tiles[1][0].wall = true;
  tiles[1][1].wall = true;
  tiles[1][2].wall = true;
  tiles[1][3].wall = true;
  tiles[1][4].wall = true;
  tiles[1][5].wall = true;
  tiles[1][6].wall = true;
  tiles[1][7].wall = true;
  tiles[1][8].wall = true;
  tiles[1][9].wall = true;
  tiles[1][10].wall = true;
  tiles[1][11].wall = true;
  tiles[1][12].wall = true;
  tiles[1][13].wall = true;
  tiles[2][0].wall = true;
  tiles[2][1].safe = true;
  tiles[2][2].wall = true;
  tiles[2][3].safe = true;
  tiles[2][4].wall = true;
  tiles[2][5].wall = true;
  tiles[2][6].wall = true;
  tiles[2][7].wall = true;
  tiles[2][8].wall = true;
  tiles[2][9].wall = true;
  tiles[2][10].wall = true;
  tiles[2][11].wall = true;
  tiles[2][12].wall = true;
  tiles[2][13].wall = true;
  tiles[3][0].wall = true;
  tiles[3][1].safe = true;
  tiles[3][2].wall = true;
  tiles[3][4].wall = true;
  tiles[3][5].wall = true;
  tiles[3][6].wall = true;
  tiles[3][7].wall = true;
  tiles[3][8].wall = true;
  tiles[3][9].wall = true;
  tiles[3][10].wall = true;
  tiles[3][11].wall = true;
  tiles[3][12].wall = true;
  tiles[3][13].wall = true;
  tiles[4][0].wall = true;
  tiles[4][2].wall = true;
  tiles[4][11].wall = true;
  tiles[4][12].wall = true;
  tiles[4][13].wall = true;
  tiles[5][0].wall = true;
  tiles[5][2].wall = true;
  tiles[5][4].wall = true;
  tiles[5][5].wall = true;
  tiles[5][6].wall = true;
  tiles[5][7].wall = true;
  tiles[5][8].wall = true;
  tiles[5][9].wall = true;
  tiles[5][11].wall = true;
  tiles[5][12].wall = true;
  tiles[5][13].wall = true;
  tiles[6][0].wall = true;
  tiles[6][2].wall = true;
  tiles[6][4].wall = true;
  tiles[6][9].wall = true;
  tiles[6][11].wall = true;
  tiles[6][12].wall = true;
  tiles[6][13].wall = true;
  tiles[7][0].wall = true;
  tiles[7][2].wall = true;
  tiles[7][4].wall = true;
  tiles[7][6].wall = true;
  tiles[7][7].wall = true;
  tiles[7][9].wall = true;
  tiles[7][11].wall = true;
  tiles[7][12].wall = true;
  tiles[7][13].wall = true;
  tiles[8][0].wall = true;
  tiles[8][2].wall = true;
  tiles[8][4].wall = true;
  tiles[8][7].wall = true;
  tiles[8][9].wall = true;
  tiles[8][11].wall = true;
  tiles[8][12].wall = true;
  tiles[8][13].wall = true;
  tiles[9][0].wall = true;
  tiles[9][2].wall = true;
  tiles[9][4].wall = true;
  tiles[9][7].wall = true;
  tiles[9][9].wall = true;
  tiles[9][11].wall = true;
  tiles[9][12].wall = true;
  tiles[9][13].wall = true;
  tiles[10][0].wall = true;
  tiles[10][2].wall = true;
  tiles[10][4].wall = true;
  tiles[10][7].wall = true;
  tiles[10][9].wall = true;
  tiles[10][11].wall = true;
  tiles[10][12].wall = true;
  tiles[10][13].wall = true;
  tiles[11][0].wall = true;
  tiles[11][2].wall = true;
  tiles[11][4].wall = true;
  tiles[11][7].wall = true;
  tiles[11][9].wall = true;
  tiles[11][11].wall = true;
  tiles[11][12].wall = true;
  tiles[11][13].wall = true;
  tiles[12][0].wall = true;
  tiles[12][2].wall = true;
  tiles[12][4].wall = true;
  tiles[12][7].wall = true;
  tiles[12][9].wall = true;
  tiles[12][11].wall = true;
  tiles[12][12].wall = true;
  tiles[12][13].wall = true;
  tiles[13][0].wall = true;
  tiles[13][2].wall = true;
  tiles[13][4].wall = true;
  tiles[13][5].goal = true;
  tiles[13][6].goal = true;
  tiles[13][7].wall = true;
  tiles[13][9].wall = true;
  tiles[13][11].wall = true;
  tiles[13][12].wall = true;
  tiles[13][13].wall = true;
  tiles[14][0].wall = true;
  tiles[14][2].wall = true;
  tiles[14][4].wall = true;
  tiles[14][5].wall = true;
  tiles[14][6].wall = true;
  tiles[14][7].wall = true;
  tiles[14][9].wall = true;
  tiles[14][11].wall = true;
  tiles[14][12].wall = true;
  tiles[14][13].wall = true;
  tiles[15][0].wall = true;
  tiles[15][2].wall = true;
  tiles[15][9].wall = true;
  tiles[15][11].wall = true;
  tiles[15][12].wall = true;
  tiles[15][13].wall = true;
  tiles[16][0].wall = true;
  tiles[16][2].wall = true;
  tiles[16][3].wall = true;
  tiles[16][4].wall = true;
  tiles[16][5].wall = true;
  tiles[16][6].wall = true;
  tiles[16][7].wall = true;
  tiles[16][8].wall = true;
  tiles[16][9].wall = true;
  tiles[16][11].wall = true;
  tiles[16][12].wall = true;
  tiles[16][13].wall = true;
  tiles[17][0].wall = true;
  tiles[17][11].wall = true;
  tiles[17][12].wall = true;
  tiles[17][13].wall = true;
  tiles[18][0].wall = true;
  tiles[18][1].safe = true;
  tiles[18][2].wall = true;
  tiles[18][3].wall = true;
  tiles[18][4].wall = true;
  tiles[18][5].wall = true;
  tiles[18][6].wall = true;
  tiles[18][7].wall = true;
  tiles[18][8].wall = true;
  tiles[18][9].wall = true;
  tiles[18][10].wall = true;
  tiles[18][11].wall = true;
  tiles[18][12].wall = true;
  tiles[18][13].wall = true;
  tiles[19][0].wall = true;
  tiles[19][1].wall = true;
  tiles[19][2].wall = true;
  tiles[19][3].wall = true;
  tiles[19][4].wall = true;
  tiles[19][5].wall = true;
  tiles[19][6].wall = true;
  tiles[19][7].wall = true;
  tiles[19][8].wall = true;
  tiles[19][9].wall = true;
  tiles[19][10].wall = true;
  tiles[19][11].wall = true;
  tiles[19][12].wall = true;
  tiles[19][13].wall = true;
  tiles[20][0].wall = true;
  tiles[20][1].wall = true;
  tiles[20][2].wall = true;
  tiles[20][3].wall = true;
  tiles[20][4].wall = true;
  tiles[20][5].wall = true;
  tiles[20][6].wall = true;
  tiles[20][7].wall = true;
  tiles[20][8].wall = true;
  tiles[20][9].wall = true;
  tiles[20][10].wall = true;
  tiles[20][11].wall = true;
  tiles[20][12].wall = true;
  tiles[20][13].wall = true;
  tiles[21][0].wall = true;
  tiles[21][1].wall = true;
  tiles[21][2].wall = true;
  tiles[21][3].wall = true;
  tiles[21][4].wall = true;
  tiles[21][5].wall = true;
  tiles[21][6].wall = true;
  tiles[21][7].wall = true;
  tiles[21][8].wall = true;
  tiles[21][9].wall = true;
  tiles[21][10].wall = true;
  tiles[21][11].wall = true;
  tiles[21][12].wall = true;
  tiles[21][13].wall = true;
}

function setDots() {
  // dots.push(new SpiralDot(createVector(630, 310), createVector(630, 310), 0.024087385212340495));
  dots.push(new SpiralDot(createVector(630, 404.6500132065495), createVector(630, 310), 0.024087385212340495));
  dots.push(new SpiralDot(createVector(630, 499.300026413099), createVector(630, 310), 0.024087385212340495));
  dots.push(new SpiralDot(createVector(630, 593.9500396196485), createVector(630, 310), 0.024087385212340495));
  dots.push(new SpiralDot(createVector(630, 688.600052826198), createVector(630, 310), 0.024087385212340495));
  dots.push(new SpiralDot(createVector(630, 215.34998679345048), createVector(630, 310), 0.024087385212340495));
  dots.push(new SpiralDot(createVector(630, 120.69997358690097), createVector(630, 310), 0.024087385212340495));
  dots.push(new SpiralDot(createVector(630, 26.04996038035145), createVector(630, 310), 0.024087385212340495));
  dots.push(new SpiralDot(createVector(630, -68.60005282619807), createVector(630, 310), 0.024087385212340495));
  dots.push(new SpiralDot(createVector(724.6500132065495, 310), createVector(630, 310), 0.024087385212340495));
  dots.push(new SpiralDot(createVector(819.300026413099, 310), createVector(630, 310), 0.024087385212340495));
  dots.push(new SpiralDot(createVector(913.9500396196485, 310), createVector(630, 310), 0.024087385212340495));
  dots.push(new SpiralDot(createVector(1008.600052826198, 310), createVector(630, 310), 0.024087385212340495));
  dots.push(new SpiralDot(createVector(535.3499867934505, 310), createVector(630, 310), 0.024087385212340495));
  dots.push(new SpiralDot(createVector(440.699973586901, 310), createVector(630, 310), 0.024087385212340495));
  dots.push(new SpiralDot(createVector(346.04996038035154, 310), createVector(630, 310), 0.024087385212340495));
  dots.push(new SpiralDot(createVector(251.39994717380202, 310), createVector(630, 310), 0.024087385212340495));
}


function setEdges() {
  for (var i = 0; i < tiles.length; i++) {
    for (var j = 0; j < tiles[0].length; j++) {
      tiles[i][j].edges = [];
      if (tiles[i][j].wall) {
        if (i != tiles.length - 1 && !tiles[i + 1][j].wall) {
          tiles[i][j].edges.push(1);
        }
        if (j != tiles[0].length - 1 && !tiles[i][j + 1].wall) {
          tiles[i][j].edges.push(2);
        }
        if (i != 0 && !tiles[i - 1][j].wall) {
          tiles[i][j].edges.push(3);
        }
        if (j != 0 && !tiles[i][j - 1].wall) {
          tiles[i][j].edges.push(4);
        }
      }
    }
  }
}


function setSolids() {
  var tlTile;
  var brTile;
  solids = [];

  for (var i = 0; i < tiles.length; i++) {
    for (var j = 0; j < tiles[0].length; j++) {
      tiles[i][j].isInSolid = false;
    }
  }
  var edgeNumber = 0;
  for (var i = 0; i < tiles.length; i++) {
    for (var j = 0; j < tiles[0].length; j++) {
      if (tiles[i][j].edges.length > 0 && !tiles[i][j].isInSolid) {
        var rightFound = true;
        var downFound = true;

        tlTile = tiles[i][j];
        tlTile.isInSolid = true;
        var i2 = i + 1;
        while (i2 < tiles.length && tiles[i2][j].edges.length > 0) {
          tiles[i2][j].isInSolid = true;
          i2++;
        }
        brTile = tiles[i2 - 1][j];

        if (i2 - 1 != i) {
          solids.push(new Solid(tlTile, brTile));
        } else {
          rightFound = false;
        }
        // solids.push(new Solid(tlTile, brTile));
        var j2 = j + 1;
        while (j2 < tiles[0].length && tiles[i][j2].edges.length > 0) {
          tiles[i][j2].isInSolid = true;
          j2++;
        }
        brTile = tiles[i][j2 - 1];

        if (j2 - 1 != j) {
          solids.push(new Solid(tlTile, brTile));
        } else {
          if (!rightFound) {
            solids.push(new Solid(tlTile, brTile));
          }
          downFound = false;
        }

      }
    }
  }

  // createDiv("number of solids  " + solids.length);
  for (var i = 0; i < solids.length; i++) {
    console.log(solids[i]);
  }
}

function setWinArea() {
  var tl = tiles[0][0];
  var firstTl = true;
  var br = tiles[0][0];


  for (var i = 0; i < tiles.length; i++) {
    for (var j = 0; j < tiles[0].length; j++) {
      if (tiles[i][j].goal) {
        if (firstTl) {
          tl = tiles[i][j];
          firstTl = false;
        }
        br = tiles[i][j];
      }
    }
  }
  winArea = new Solid(tl, br);
}
