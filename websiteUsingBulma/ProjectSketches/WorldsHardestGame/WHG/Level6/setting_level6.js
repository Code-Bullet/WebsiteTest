function setValues() {
  increaseEvery = 10;
  increaseMovesBy = 5;
  populationSize = 1500;
}

function setTiles() {
  playerPos = createVector(2, 2);

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
  tiles[2][1].wall = true;
  tiles[2][2].safe = true;
  tiles[2][3].safe = true;
  tiles[2][4].wall = true;
  tiles[2][5].wall = true;
  tiles[2][6].wall = true;
  tiles[2][7].wall = true;
  tiles[2][8].wall = true;
  tiles[2][9].wall = true;
  tiles[2][10].goal = true;
  tiles[2][11].goal = true;
  tiles[2][12].wall = true;
  tiles[2][13].wall = true;
  tiles[3][0].wall = true;
  tiles[3][1].wall = true;
  tiles[3][2].safe = true;
  tiles[3][3].safe = true;
  tiles[3][4].wall = true;
  tiles[3][5].wall = true;
  tiles[3][6].wall = true;
  tiles[3][7].wall = true;
  tiles[3][8].wall = true;
  tiles[3][9].wall = true;
  tiles[3][10].goal = true;
  tiles[3][11].goal = true;
  tiles[3][12].wall = true;
  tiles[3][13].wall = true;
  tiles[4][0].wall = true;
  tiles[4][1].wall = true;
  tiles[4][6].wall = true;
  tiles[4][7].wall = true;
  tiles[4][12].wall = true;
  tiles[4][13].wall = true;
  tiles[5][0].wall = true;
  tiles[5][1].wall = true;
  tiles[5][6].wall = true;
  tiles[5][7].wall = true;
  tiles[5][12].wall = true;
  tiles[5][13].wall = true;
  tiles[6][0].wall = true;
  tiles[6][1].wall = true;
  tiles[6][6].wall = true;
  tiles[6][7].wall = true;
  tiles[6][12].wall = true;
  tiles[6][13].wall = true;
  tiles[7][0].wall = true;
  tiles[7][1].wall = true;
  tiles[7][6].wall = true;
  tiles[7][7].wall = true;
  tiles[7][12].wall = true;
  tiles[7][13].wall = true;
  tiles[8][0].wall = true;
  tiles[8][1].wall = true;
  tiles[8][6].wall = true;
  tiles[8][7].wall = true;
  tiles[8][12].wall = true;
  tiles[8][13].wall = true;
  tiles[9][0].wall = true;
  tiles[9][1].wall = true;
  tiles[9][6].wall = true;
  tiles[9][7].wall = true;
  tiles[9][12].wall = true;
  tiles[9][13].wall = true;
  tiles[10][0].wall = true;
  tiles[10][1].wall = true;
  tiles[10][6].wall = true;
  tiles[10][7].wall = true;
  tiles[10][12].wall = true;
  tiles[10][13].wall = true;
  tiles[11][0].wall = true;
  tiles[11][1].wall = true;
  tiles[11][6].wall = true;
  tiles[11][7].wall = true;
  tiles[11][12].wall = true;
  tiles[11][13].wall = true;
  tiles[12][0].wall = true;
  tiles[12][1].wall = true;
  tiles[12][6].wall = true;
  tiles[12][7].wall = true;
  tiles[12][12].wall = true;
  tiles[12][13].wall = true;
  tiles[13][0].wall = true;
  tiles[13][1].wall = true;
  tiles[13][6].wall = true;
  tiles[13][7].wall = true;
  tiles[13][12].wall = true;
  tiles[13][13].wall = true;
  tiles[14][0].wall = true;
  tiles[14][1].wall = true;
  tiles[14][6].wall = true;
  tiles[14][7].wall = true;
  tiles[14][12].wall = true;
  tiles[14][13].wall = true;
  tiles[15][0].wall = true;
  tiles[15][1].wall = true;
  tiles[15][6].wall = true;
  tiles[15][7].wall = true;
  tiles[15][12].wall = true;
  tiles[15][13].wall = true;
  tiles[16][0].wall = true;
  tiles[16][1].wall = true;
  tiles[16][6].safe = true;
  tiles[16][7].safe = true;
  tiles[16][12].wall = true;
  tiles[16][13].wall = true;
  tiles[17][0].wall = true;
  tiles[17][1].wall = true;
  tiles[17][6].safe = true;
  tiles[17][7].safe = true;
  tiles[17][12].wall = true;
  tiles[17][13].wall = true;
  tiles[18][0].wall = true;
  tiles[18][1].wall = true;
  tiles[18][6].safe = true;
  tiles[18][7].safe = true;
  tiles[18][12].wall = true;
  tiles[18][13].wall = true;
  tiles[19][0].wall = true;
  tiles[19][1].wall = true;
  tiles[19][6].safe = true;
  tiles[19][7].safe = true;
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
  dots.push(new SpiralDot(createVector(380, 210), createVector(380, 210), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(380, 251), createVector(380, 210), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(380, 292), createVector(380, 210), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(380, 169), createVector(380, 210), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(380, 128), createVector(380, 210), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(421, 210), createVector(380, 210), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(462, 210), createVector(380, 210), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(339, 210), createVector(380, 210), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(298, 210), createVector(380, 210), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(580, 210), createVector(580, 210), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(580, 251.01219330881975), createVector(580, 210), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(580, 292.0243866176395), createVector(580, 210), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(580, 168.98780669118025), createVector(580, 210), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(580, 127.9756133823605), createVector(580, 210), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(621.0121933088197, 210), createVector(580, 210), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(662.0243866176395, 210), createVector(580, 210), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(538.9878066911803, 210), createVector(580, 210), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(497.9756133823605, 210), createVector(580, 210), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(780, 210), createVector(780, 210), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(780, 252), createVector(780, 210), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(780, 294), createVector(780, 210), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(780, 168), createVector(780, 210), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(780, 126), createVector(780, 210), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(822, 210), createVector(780, 210), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(864, 210), createVector(780, 210), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(738, 210), createVector(780, 210), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(696, 210), createVector(780, 210), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(980, 210), createVector(980, 210), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(980, 252.0119030752), createVector(980, 210), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(980, 294.0238061504), createVector(980, 210), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(980, 167.9880969248), createVector(980, 210), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(980, 125.9761938496), createVector(980, 210), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(1022.0119030752, 210), createVector(980, 210), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(1064.0238061504, 210), createVector(980, 210), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(937.9880969248, 210), createVector(980, 210), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(895.9761938495999, 210), createVector(980, 210), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(980, 510), createVector(980, 510), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(980, 552.0119030752), createVector(980, 510), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(980, 594.0238061504001), createVector(980, 510), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(980, 467.9880969248), createVector(980, 510), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(980, 425.9761938496), createVector(980, 510), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(1022.0119030752, 510), createVector(980, 510), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(1064.0238061504, 510), createVector(980, 510), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(937.9880969248, 510), createVector(980, 510), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(895.9761938495999, 510), createVector(980, 510), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(780, 510), createVector(780, 510), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(780, 553.0116263352131), createVector(780, 510), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(780, 596.0232526704262), createVector(780, 510), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(780, 466.9883736647869), createVector(780, 510), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(780, 423.97674732957375), createVector(780, 510), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(823.0116263352131, 510), createVector(780, 510), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(866.0232526704262, 510), createVector(780, 510), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(736.9883736647869, 510), createVector(780, 510), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(693.9767473295738, 510), createVector(780, 510), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(580, 510), createVector(580, 510), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(580, 553.0116263352131), createVector(580, 510), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(580, 596.0232526704262), createVector(580, 510), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(580, 466.9883736647869), createVector(580, 510), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(580, 423.97674732957375), createVector(580, 510), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(623.0116263352131, 510), createVector(580, 510), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(666.0232526704262, 510), createVector(580, 510), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(536.9883736647869, 510), createVector(580, 510), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(493.97674732957375, 510), createVector(580, 510), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(380, 510), createVector(380, 510), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(380, 554.0113621693308), createVector(380, 510), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(380, 598.0227243386616), createVector(380, 510), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(380, 465.98863783066923), createVector(380, 510), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(380, 421.97727566133847), createVector(380, 510), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(424.01136216933077, 510), createVector(380, 510), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(468.02272433866153, 510), createVector(380, 510), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(335.98863783066923, 510), createVector(380, 510), 0.04008738521234051));
  dots.push(new SpiralDot(createVector(291.97727566133847, 510), createVector(380, 510), 0.04008738521234051));
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
