class Node { //used to define short term goals for the players
  //------------------------------------------------------------------------------------------------------------------------------
  constructor(nodeTileOrCoin, isTile, isCoin) {
    this.reached = false;
    this.distToFinish = 0.0;
    this.isCoin = isCoin;

    if(isTile) {
      this.pos = createVector(nodeTileOrCoin.pixelPos.x, nodeTileOrCoin.pixelPos.y);

      this.w = tileSize;
      this.h = tileSize;
    } else if(isCoin) {
      this.pos = createVector(nodeTileOrCoin.pos.x - nodeTileOrCoin.diameter / 2.0, nodeTileOrCoin.pos.y - nodeTileOrCoin.diameter / 2.0);
      this.w = nodeTileOrCoin.diameter;
      this.h = nodeTileOrCoin.diameter;

    } else { //noteTileorcorin is a vector
      this.pos = createVector(nodeTileOrCoin.x - tileSize / 2, nodeTileOrCoin.y - tileSize / 2);
      this.w = tileSize;
      this.h = tileSize;
    }
    this.center = createVector(this.pos.x + this.w / 2, this.pos.y + this.h / 2);

    this.bottomRight = createVector(this.pos.x + this.w, this.pos.y + this.h);
  }

  show() {
    fill(240, 0, 0, 100);
    noStroke();
    ellipse(this.center.x, this.center.y, 20);

  }

  //------------------------------------------------------------------------------------------------------------------------------
  collision(ptl, pbr) { //player dimensions
      if((ptl.x < this.bottomRight.x && pbr.x > this.pos.x) && (ptl.y < this.bottomRight.y && pbr.y > this.pos.y)) {
        this.reached = true;
        return true;
      }
      return false;
    }
    //------------------------------------------------------------------------------------------------------------------------------
    //set the distance to finish by adding the distance to the finish for the node n plus the distance from this node to node n
  setDistanceToFinish(n) {
    this.distToFinish = n.distToFinish + dist(this.pos.x, this.pos.y, n.pos.x, n.pos.y);
  }
}
