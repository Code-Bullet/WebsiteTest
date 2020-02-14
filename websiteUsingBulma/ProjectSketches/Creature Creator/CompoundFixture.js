//a compond fixture is an array fixture which can handle its input being concave
//it does this by splitting up the original concave polygon into a group of smaller polygons which arent concave
class CompoundFixture extends Fixture {
  //information is relative to the body
  constructor(arr) {
    super();
    this.fixtures = [];
    this.concavePoints = [];
    this.maybeConcave = [];
    this.fixtureType = "array";
    this.pixelVectorPositions = arr;
    this.pixelVectorsLeft = [];
    for (let a of arr) {
      this.pixelVectorsLeft.push(cloneVector(a));
    }
    this.center;
    this.setCenter();
    this.ensureClockwise();
    //if this fixture is concave then we need to spit it into multiple sub Fixtures for the simulation to work
    this.ensureConvex();


  }

  //scales the fixture(s) relative to the body
  scaleRelativeToBody(multiplyAmount) {

    let zeroVector = createVector(0, 0);
    let vectorsRelativeToCenter = [];

    for (let v of this.pixelVectorPositions) {
      vectorsRelativeToCenter.push(p5.Vector.sub(v, zeroVector));
    }

    for (let v of vectorsRelativeToCenter) {
      v.mult(multiplyAmount);
    }

    for (let i = 0; i < this.pixelVectorPositions.length; i++) {
      this.pixelVectorPositions[i] = p5.Vector.add(vectorsRelativeToCenter[i], zeroVector);
    }


    for (let f of this.fixtures) {
      f.scaleRelativeToBody(multiplyAmount);
    }
    this.setCenter();
  }

  //returns whether or not the pixel position is within the fixture(s)
  isLocalPixelPosWithinFixture(localPixelPosition) {
    let distance = dist(localPixelPosition.x, localPixelPosition.y, this.center.x, this.center.y);
    let vectorsRelativeToCenter = [];

    for (let v of this.pixelVectorPositions) {
      vectorsRelativeToCenter.push(p5.Vector.sub(v, this.center));
    }
    let totalLength = 0;
    for (let v of vectorsRelativeToCenter) {
      totalLength += v.mag();
    }
    let averageLength = totalLength / this.pixelVectorPositions.length;
    return (distance < averageLength);
  }

  //ensures that the polygon is concave by breaking it up
  ensureConvex() {

    //1. identify all concave points
    this.identifyConcavePoints();
    //2. once every concave point is labled then for each concave point with a convex point after it we can create a triangle out of the next 2 points
    for (let i = 0; i < this.concavePoints.length; i++) {
      //if this point is eithe concave or maybe concave
      if (this.concavePoints[i] || this.maybeConcave[i]) {
        let convexNeighbour = this.getConvexNeighbour(i);
        if (convexNeighbour !== 0) {
          //break this puppy up

          //create a new triangle out of the convex neighbour and the point after that
          let newArrayFixture = [];
          newArrayFixture.push(cloneVector(this.pixelVectorsLeft[evansMod(i + convexNeighbour * 2, this.pixelVectorsLeft.length)]));
          newArrayFixture.push(cloneVector(this.pixelVectorsLeft[evansMod(i + convexNeighbour, this.pixelVectorsLeft.length)]));
          newArrayFixture.push(cloneVector(this.pixelVectorsLeft[i]));

          this.fixtures.push(new ArrayFixture(newArrayFixture));
          this.pixelVectorsLeft.splice(evansMod(i + convexNeighbour, this.pixelVectorsLeft.length), 1);
          break;
        }
      }
      //if reached the end of the array without finding a concave point then we are good
      if (i === this.concavePoints.length - 1) {
        this.fixtures.unshift(new ArrayFixture(this.pixelVectorsLeft));
        let thing = [];
        thing.push(0);
        thing.push(0);

        thing.push(0);
        thing.push(0);
        thing.push(0);
        thing.push(0);
        thing.push(0);
        thing.unshift(1);


        return;
      }
    }

    this.ensureConvex();
    //3. remove triangle from overall fixture and add it to subFixtures
    //4. repeat until no concave points remain
  }

  //returns -1 if counter clockwise neighbour is convex
  //returns 1 if  clockwise neighbour is convex
  // otherwise returns 0
  getConvexNeighbour(i) {

    let mod = this.concavePoints.length;
    if (!this.concavePoints[evansMod(i - 1, mod)] && !this.maybeConcave[evansMod(i - 1, mod)]) {
      return -1;
    }
    if (!this.concavePoints[(i + 1) % this.concavePoints.length] && !this.maybeConcave[(i + 1) % this.concavePoints.length]) {
      return 1;
    }
    return 0;
  }


  //identifies concave points in the main polygon
  identifyConcavePoints() {

    //for each point in the fixture we need to remove it then calculate the area if the area is greater without it then that point was a concave point
    this.concavePoints = [];
    this.maybeConcave = [];
    let originalArea = this.calculateArea(this.pixelVectorsLeft);
    let concavePointLabels = [];
    for (let i = 0; i < this.pixelVectorsLeft.length; i++) {
      let newVecs = [];
      for (let v of this.pixelVectorsLeft) {
        if (v !== this.pixelVectorsLeft[i]) {
          newVecs.push(v);
        }
      }
      //if removing this point creates a line cross then our algorithm for calculating area doesnt work, so we need to assume its a concave point
      this.maybeConcave.push(this.anyLinesCross(newVecs));
      //if removing this point increases the area of the shape then this point is concave
      this.concavePoints.push(originalArea < this.calculateArea(newVecs));
    }
  }

  //calculates the area of the input vectors
  calculateArea(vectors) {
    let newVecs = [];
    for (let v of vectors) {
      newVecs.push(v);
    }
    newVecs.push(vectors[0]);
    let areaSum = 0;
    for (let i = 0; i < newVecs.length - 1; i++) {
      areaSum += (newVecs[i + 1].x + newVecs[i].x) * (newVecs[i + 1].y - newVecs[i].y);
    }
    areaSum /= 2;
    return abs(areaSum);
  }

  //determines if any lines cross in the input polygon
  anyLinesCross(vectors) {
    let newVecs = [];
    for (let v of vectors) {
      newVecs.push(v);
    }
    newVecs.push(vectors[0]);
    for (let i = 0; i < newVecs.length - 1; i++) {
      for (let j = i + 1; j < newVecs.length - 1; j++) {
        if (i === j || j + 1 === i || i + 1 === j || (i === 0 && j === newVecs.length - 2)) {
          continue;
        }
        if (this.linesCross(newVecs[i].x, newVecs[i].y, newVecs[i + 1].x, newVecs[i + 1].y, newVecs[j].x, newVecs[j].y, newVecs[j + 1].x, newVecs[j + 1].y)) {
          return true;
        }
      }
    }
    return false;
  }

  //returns whether the 2 lines defined by the arguments cross
  linesCross(x1, y1, x2, y2, x3, y3, x4, y4) {
    const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
    const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
    return (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1);
  }

  //if the points are going anticlockwise box2d shits itself so we need to ensure that that doesn't happen
  ensureClockwise() {
    let vectorsRelativeToCenter = [];
    let headingValues = [];
    for (let v of this.pixelVectorPositions) {
      vectorsRelativeToCenter.push(p5.Vector.sub(v, this.center));
    }


    for (let v of vectorsRelativeToCenter) {
      let temp = v.heading();
      if (temp < 0) {
        temp += 2 * PI;
      }

      headingValues.push(temp);
    }
    //print(headingValues);

    let rotationalDifferenceTotal = 0;
    for (let i = 0; i < headingValues.length; i++) {
      let difference = 0;
      if (i === headingValues.length - 1) {
        difference = headingValues[0] - headingValues[i];
      } else {
        difference = headingValues[i + 1] - headingValues[i];
      }
      if (difference > 0) {
        rotationalDifferenceTotal += 1;
      } else {
        rotationalDifferenceTotal -= 1;
      }
    }

    if (rotationalDifferenceTotal < 0) {
      this.pixelVectorPositions.reverse();
    }
  }

  //sets the shape of each fixture
  setShape() {
    for (let f of this.fixtures) {
      f.setShape();
    }
  }

  //sets the center as the average position of all the points
  setCenter() {
    let x = 0;
    let y = 0;
    for (let v of this.pixelVectorPositions) {
      x += v.x;
      y += v.y;
    }

    x /= this.pixelVectorPositions.length;
    y /= this.pixelVectorPositions.length;
    this.center = createVector(x, y);
  }

  //shows a polygon
  showFixtureClass() {

    beginShape();
    for (let v of this.pixelVectorPositions) {
      vertex(v.x, v.y);
    }
    endShape(CLOSE);

  }

  //moves all the points so the center is now in the new position
  setPosition(newPos) {
    let difference = p5.Vector.sub(newPos, this.pixelCenter);
    let unchangedDifference = p5.Vector.sub(newPos, this.pixelCenter);
    difference.rotate(-this.body.angle);

    for (let i = 0; i < this.pixelVectorPositions.length; i++) {
      this.pixelVectorPositions[i].x += difference.x;
      this.pixelVectorPositions[i].y += difference.y;
    }

    this.setCenter();
    this.setPixelCenter();
    this.setShape();

    for (let f of this.fixtures) {
      f.setPosition(p5.Vector.add(unchangedDifference, f.pixelCenter));
    }
  }


  //rotates the polygon by getting each point as a vector then rotating it
  rotate(rotateAmount) {


    let vectorsRelativeToCenter = [];
    for (let v of this.pixelVectorPositions) {
      vectorsRelativeToCenter.push(p5.Vector.sub(v, this.center));
    }

    for (let v of vectorsRelativeToCenter) {
      v.rotate(rotateAmount);
    }

    for (let i = 0; i < this.pixelVectorPositions.length; i++) {
      this.pixelVectorPositions[i] = p5.Vector.add(vectorsRelativeToCenter[i], this.center);
    }

    for (let f of this.fixtures) {
      f.rotate(rotateAmount, this.center);
    }
  }

  //resizes the fixture
  resize(multAmount) {


    let vectorsRelativeToCenter = [];

    for (let v of this.pixelVectorPositions) {
      vectorsRelativeToCenter.push(p5.Vector.sub(v, this.center));
    }

    for (let v of vectorsRelativeToCenter) {
      v.mult(multAmount);
    }

    for (let i = 0; i < this.pixelVectorPositions.length; i++) {
      this.pixelVectorPositions[i] = p5.Vector.add(vectorsRelativeToCenter[i], this.center);
    }


    for (let f of this.fixtures) {
      f.resize(multAmount, this.center);
    }
  }

  //adds an array fixture to this fixture
  addArrayFixture(arr){
    this.fixtures.push(new ArrayFixture(arr));
  }


  //-------------------------------------OVERWRITES=-------------------------------------------------------------

  //sets the friction for all the fixtures in this compound fixture
  setFriction(val) {
    this.fixDef.friction = val;
    for (let f of this.fixtures) {
      f.setFriction(val);
    }
  }

  //sets the density for all the fixtures in this compound fixture
  setDensity(val) {
    this.fixDef.density = val;
    for (let f of this.fixtures) {
      f.setDensity(val);
    }

  }
  //sets the restitution for all the fixtures in this compound fixture
  setRestitution(val) {
    this.fixDef.restitution = val;
    for (let f of this.fixtures) {
      f.setRestitution(val);
    }
  }


  setValues(friction, density, restitution) {
    this.setFriction(friction);
    this.setDensity(density);
    this.setRestitution(restitution);
  }

  //adds all the fixtures in this compound fixture to a body
  addToBody(body) {
    this.body = body;
    this.setPixelCenter();
    for (let f of this.fixtures) {
      f.addToBody(body);
    }
  }

  //resets all the fixtures in this compound fixture
  resetFixture() {
    for (let f of this.fixtures) {
      f.resetFixture();
    }
  }

  //sets the filterData for all the fixtures in this compound fixture
  setFilterData(fd) {

    this.filterData = fd;

    for (let f of this.fixtures) {
      f.setFilterData(fd);
    }
  }

  //removes all the fixtures in this compound fixture
  remove() {
    for (let f of this.fixtures) {
      f.remove();
    }
  }

  //gets this fixture as an object
  getFixtureInfoAsObject(){
    let obj = {fixtureType:"compound", pixelVectorPositions:[], fillColor: this.fillColor};
    obj.pixelVectorPositions = this.pixelVectorPositions.map((x) => new createEvanVector(x));
    return obj;

  }

  //returns whether or not this fixture is hit by the lazer
  hitByLazer(lazerX) {

    for (let pos of this.pixelVectorPositions) {
      let pos2 = cloneVector(pos);
      pos2.rotate(this.body.body.GetAngle());
      if (this.body.getShiftedPixelCoordinates().x + pos2.x < lazerX) {
        return true;
      }
    }
    return false;
  }
}

function p5VectorsToVec2(vectors) {
  let newVecs = [];
  for (let i = 0; i < vectors.length; i++) {
    newVecs.push(new Vec2(vectors[i].x / SCALE, vectors[i].y / SCALE));
  }
  return newVecs;
}


//mode function but its good
function evansMod(i, mod) {
  while (i < 0) {
    i += mod;
  }
  return i % mod;
}

function cloneVector(vec) {
  return createVector(vec.x, vec.y);
}
