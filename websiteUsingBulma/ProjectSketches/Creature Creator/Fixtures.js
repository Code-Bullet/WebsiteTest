//fixtures are like shapes, they are what you attach to bodies to give them form
//this class (and its children classes) handle the creation of and logic for box2d fixtures

class Fixture {

    constructor(center) {

        //create fixture definition
        this.fixDef = new b2FixtureDef();
        this.fixDef.density = 2;
        this.fixDef.friction = 0.1;
        this.fixDef.restitution = 0.5;

        this.body = null;

        this.center = center;
        this.pixelCenter;

        this.fixture;

        //set density and friction and restitution;
        this.density = this.fixDef.density;
        this.friction = this.fixDef.friction;
        this.restitution = this.fixDef.restitution;
        this.filterData = new b2FilterData();

        this.fillColor = fillColor; // this can be overwritten by the user
        this.outlineColor = outlineColor;

    }


    setFilterData(fd) {
        this.filterData = fd;
    }

    getPixelCenter() {
        return this.pixelCenter;
    }

    //called whenever shit changes
    //sets the pixel center based on the body and the relative positions
    setPixelCenter() {
        let bodyPos = this.body.getPixelCoordinates();
        let angle = this.body.angle;
        let rotatedCenter = createVector(this.center.x, this.center.y);
        rotatedCenter.rotate(angle);
        let trueCenterPos = p5.Vector.add(bodyPos, rotatedCenter);
        this.pixelCenter = trueCenterPos;
    }


    //sets the friction for the fixture
    setFriction(val) {
        this.fixDef.friction = val;
        this.friction = val;
        if (this.fixture != null) {
            this.fixture.SetFriction(val);
        }

    }

    //sets the density for the fixture
    setDensity(val) {
        this.fixDef.density = val;
        this.density = val;
        if (this.fixture != null) {
            this.fixture.SetDensity(val);
        }

    }


    //sets the restitution (bouncyness) for the fixture
    setRestitution(val) {
        this.fixDef.restitution = val;
        this.restitution = val;
        if (this.fixture != null) {
            this.fixture.SetRestitution(val);
        }
    }

    //set density and friction and restitution;
    setValues(friction, density, restitution) {
        this.setFriction(friction);
        this.setDensity(density);
        this.setRestitution(restitution);
    }


    //add this fixture to a body and ands it to the box2d world
    addToBody(body) {

        this.body = body;
        this.fixture = body.body.CreateFixture(this.fixDef);
        this.fixture.SetFilterData(this.filterData);
        this.setPixelCenter();
    }


    //shows the fixture
    show(body) {

        //set fill and outline based on the current state of the program before showing the fixture itself

        let alpha = 0;
        !inCreatureCreatorMode || (buttonManager.areCosmeticsActive() && buttonManager.modeNo === -1) ? alpha = 255 : alpha = 200;
        fill(this.fillColor._getRed(), this.fillColor._getGreen(), this.fillColor._getBlue(), alpha);

        stroke(this.outlineColor)

        if (inCreatureCreatorMode) {

            if (this.body.selected) {
                fill(selectedBodyFillColor);

                if (!this.body.isDynamic) {
                    fill(selectedStaticBodyFillColor);
                }

                if (buttonManager.isInMode("Delete")) {
                    fill(deleteColor);
                }

                if (buttonManager.isInMode("Death upon floor")) {
                    fill(setDeathUponTouchingFloorColor);
                }

            } else {

                if (!this.body.isDynamic) {
                    fill(staticBodyFillColor);
                }

                if (this.body.deathIfTouchesGround && buttonManager.isInMode("Death upon floor")) {
                    fill(deathUponTouchingFloorColor);
                }
            }

            if (this.body.selectedAsShape1) {

                if (buttonManager.isInMode("Change Fill Color")) {

                    stroke(255, 255, 0);
                    strokeWeight(2);
                    fill(this.fillColor._getRed(), this.fillColor._getGreen(), this.fillColor._getBlue(), 255);


                } else if (buttonManager.areCosmeticsActive() && buttonManager.modeNo !== -1) {
                    stroke(255, 255, 0);
                    strokeWeight(2);
                    fill(this.fillColor._getRed(), this.fillColor._getGreen(), this.fillColor._getBlue(), 255);

                } else if (!buttonManager.areCosmeticsActive()) {
                    fill(selectedShape1FillColor);
                }
            }

            strokeWeight(3);

        } else {

            strokeWeight(3);

            if (this.body.isDead) {
                fill(deadColor);
                noStroke();
            }
        }


        let x = body.GetPosition().x * SCALE;
        let y = body.GetPosition().y * SCALE;
        let angle = body.GetAngle();
        push();

        translate(x, y);
        rotate(angle);

        //show the fixture
        this.showFixtureClass();
        pop();
        strokeWeight(1);

    }


    //removes the fixture from the body then adds the fixture back to it
    resetFixture() {
        this.body.body.DestroyFixture(this.fixture);
        this.addToBody(this.body);
    }

    //removes the fixture
    remove() {
        this.body.body.DestroyFixture(this.fixture);
    }


    //this function needs to be overwritten by each fixture class because each one looks different
    showFixtureClass() {
    }


    //overwrite
    setPosition(newPos) {

    }

    //overwrite
    rotate(rotateAmount) {
    }


    //overwrite
    getFixtureInfoAsObject() {
    }

    //overwrite
    hitByLazer(lazerX) {
        return false;
    }
}


class RectangleFixture extends Fixture {
    //information is relative to the body
    constructor(x, y, w, h, angle) {
        super(createVector(x + w / 2, y + h / 2));
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.angle = angle;

        this.pixelVectorPositions = [];
        this.calculateVectorsAndSetShape();//calculates the corners based on the x,y,w,h and angle
        this.fixtureType = "rectangle";

    }

    //returns whether or not the pixel position is within the fixture
    isLocalPixelPosWithinFixture(localPixelPosition) {
        let positionRelativeToCenter = p5.Vector.sub(localPixelPosition, this.center);
        positionRelativeToCenter.rotate(-this.angle);
        let pos = p5.Vector.add(this.center, positionRelativeToCenter);
        return (pos.x > this.x && pos.x < this.x + this.w && pos.y > this.y && pos.y < this.y + this.h);
    }

    //get the pixel positions of the corners of the rectangle
    getPixelVectors() {
        this.rightVector = createVector(this.w / 2, 0).rotate(this.angle);
        this.upVector = createVector(0, -this.h / 2).rotate(this.angle);

        this.pixelVectorPositions = [];
        this.pixelVectorPositions.push(createVector().set(this.center).sub(this.rightVector).add(this.upVector));
        this.pixelVectorPositions.push(createVector().set(this.center).add(this.rightVector).add(this.upVector));
        this.pixelVectorPositions.push(createVector().set(this.center).add(this.rightVector).sub(this.upVector));
        this.pixelVectorPositions.push(createVector().set(this.center).sub(this.rightVector).sub(this.upVector));

        return this.pixelVectorPositions;
    }

    //calculates the pixel positions of the corners are sets the shape as a polygon with those points
    calculateVectorsAndSetShape() {

        //angle is in radians rotating clock wise
        this.getPixelVectors();
        this.rightVector = createVector(this.w / 2, 0).rotate(this.angle);
        this.upVector = createVector(0, -this.h / 2).rotate(this.angle);

        this.vectors = [];
        this.vectors.push(createVector().set(this.center).sub(this.rightVector).add(this.upVector));
        this.vectors.push(createVector().set(this.center).add(this.rightVector).add(this.upVector));
        this.vectors.push(createVector().set(this.center).add(this.rightVector).sub(this.upVector));
        this.vectors.push(createVector().set(this.center).sub(this.rightVector).sub(this.upVector));


        this.vectors = p5VectorsToVec2(this.vectors);

        this.fixDef.shape = new b2PolygonShape();
        this.fixDef.shape.SetAsArray(this.vectors, 4);

    }

    //resets the center vector based on variables
    resetCenter() {
        this.center = createVector(this.x + this.w / 2, this.y + this.h / 2);
    }


    //shows a rectangle
    showFixtureClass() {
        translate(this.center.x, this.center.y);
        rotate(this.angle);
        rect(-this.w / 2, -this.h / 2, this.w, this.h);

    }

    //sets the position of the fixture and resets the fixture
    setPosition(newPos) {
        let difference = p5.Vector.sub(newPos, this.pixelCenter);
        difference.rotate(-this.body.angle);
        this.x += difference.x;
        this.y += difference.y;
        this.center = createVector(this.x + this.w / 2, this.y + this.h / 2);
        this.calculateVectorsAndSetShape();
        this.resetFixture();
    }


    //rotates the fixture
    rotate(rotateAmount) {
        this.angle += rotateAmount;
        this.calculateVectorsAndSetShape();
        this.resetFixture();
    }

    //resizes the fixture
    resize(increaseWidthAmount, increaseHeightAmount) {
        this.w += increaseWidthAmount;
        this.h += increaseHeightAmount;
        this.w = max(this.w, 1);
        this.h = max(this.h, 1);

        this.x = this.center.x - this.w / 2;
        this.y = this.center.y - this.h / 2;
        this.calculateVectorsAndSetShape();
        this.resetFixture();
    }

    //scales the fixture relative to the center of the body
    scaleRelativeToBody(multiplyAmount) {
        this.x *= multiplyAmount;
        this.y *= multiplyAmount;
        this.w *= multiplyAmount;
        this.h *= multiplyAmount;
        this.calculateVectorsAndSetShape();
        this.resetFixture();
    }

    //scales the fixture relative to its center
    scale(scaleAmount) {

        this.w *= scaleAmount;
        this.h *= scaleAmount;
        this.x = this.center.x - this.w / 2;
        this.y = this.center.y - this.h / 2;

        this.calculateVectorsAndSetShape();
        this.resetFixture();
    }

    //returns the fixture information as an object (like JSON)
    getFixtureInfoAsObject() {
        let obj = {fixtureType: "", x: 0, y: 0, w: 0, h: 0, angle: 0, fillColor: 0};

        Object.keys(this).forEach((key) => {
            if (key in obj) {
                obj[key] = this[key];
            }
        });
        return obj;
    }

    //returns whether or not this fixture was hit by the lazer
    hitByLazer(lazerX) {
        this.getPixelVectors();
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

//------------------------------------------------------------------------------------------------------------------------------------------------------

class CircleFixture extends Fixture {
    //information is relative to the body
    constructor(x, y, radius) {
        super(createVector(x, y));
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.setShape();
        this.fixtureType = "circle";

    }

    //returns whether or not the pixel position is within the fixture
    isLocalPixelPosWithinFixture(localPixelPosition) {
        let distance = dist(localPixelPosition.x, localPixelPosition.y, this.center.x, this.center.y);

        return (distance < this.radius);
    }

    //sets the shape of the fixture def as a circle
    setShape() {
        this.fixDef.shape = new b2CircleShape(this.radius / SCALE);
        this.fixDef.shape.SetLocalPosition(new Vec2(this.x / SCALE, this.y / SCALE));
    }

    //draw a circle
    showFixtureClass() {
        ellipse(this.x, this.y, this.radius * 2);
    }

    //sets the position of the fixture and resets the fixture
    setPosition(newPos) {
        let difference = p5.Vector.sub(newPos, this.pixelCenter);
        difference.rotate(-this.body.angle);

        this.x += difference.x;
        this.y += difference.y;
        this.setCenter();
        this.setShape();
        this.resetFixture();
    }

    //sets the center using its x and y coordinates
    setCenter() {
        this.center = createVector(this.x, this.y);
    }

    //doesnt do shit to a circle
    rotate(rotateAmount) {
    }

    //resizes the fixture
    resize(increaseRadiusAmount) {
        this.radius += increaseRadiusAmount;
        this.radius = max(this.radius, 1);
        this.setShape();
        this.resetFixture();
    }

    //removes it then adds it to body
    resetFixture() {
        this.body.body.DestroyFixture(this.fixture);
        this.addToBody(this.body);
    }

    //scales the fixture relative to the center of the body
    scaleRelativeToBody(multiplyAmount) {
        this.x *= multiplyAmount;
        this.y *= multiplyAmount;
        this.radius *= multiplyAmount;
        this.setCenter();
        this.setShape();
        this.resetFixture();
    }

    //returns the fixture information as an object (like JSON)
    getFixtureInfoAsObject() {
        let obj = {fixtureType: "", x: 0, y: 0, radius: 0, fillColor: 0};
        Object.keys(this).forEach((key) => {
            if (key in obj) {
                obj[key] = this[key];
            }
        });
        return obj;
    }

    //returns whether or not this fixture was hit by the lazer
    hitByLazer(lazerX) {
        let pos = createVector(this.x, this.y);
        pos.rotate(this.body.body.GetAngle());
        return (this.body.getShiftedPixelCoordinates().x + pos.x - this.radius < lazerX);
    }

}

//----------------------------------------------------------------------------------------------------------------------------------------
//an array fixture is a polygon, which is defined by an array of points
//ARRAY FIXTURES can NOT BE CONCAVE
//see compound fixtures to see how this is handled
class ArrayFixture extends Fixture {
    //information is relative to the body
    constructor(arr) {
        super();
        this.fixtureType = "array";
        this.pixelVectorPositions = arr;
        this.center;
        this.setCenter();
        this.ensureClockwise();
        this.setShape();


    }

    //returns whether or not the pixel position is within the fixture
    isLocalPixelPosWithinFixture(localPixelPosition) {
        let distance = dist(localPixelPosition.x, localPixelPosition.y, this.center.x, this.center.y);
        let vectorsRelativeToCenter = [];

        for (var v of this.pixelVectorPositions) {
            vectorsRelativeToCenter.push(p5.Vector.sub(v, this.center));
        }
        let totalLength = 0;
        for (var v of vectorsRelativeToCenter) {
            totalLength += v.mag();
        }
        let averageLength = totalLength / this.pixelVectorPositions.length;
        return (distance < averageLength);
    }

    //if the points are going anticlockwise box2d shits itself so we need to ensure that that doesn't happen
    ensureClockwise() {
        let vectorsRelativeToCenter = [];
        let headingValues = [];
        for (var v of this.pixelVectorPositions) {
            vectorsRelativeToCenter.push(p5.Vector.sub(v, this.center));
        }


        for (var v of vectorsRelativeToCenter) {
            let temp = v.heading();
            if (temp < 0) {
                temp += 2 * PI;
            }

            headingValues.push(temp);
        }


        let rotationalDifferenceTotal = 0;
        for (var i = 0; i < headingValues.length; i++) {
            let difference = 0;
            if (i == headingValues.length - 1) {
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

    //sets the shape of the fixture def as an array
    setShape() {
        this.vectors = p5VectorsToVec2(this.pixelVectorPositions);
        this.fixDef.shape = new b2PolygonShape();
        this.fixDef.shape.SetAsArray(this.vectors, this.pixelVectorPositions.length);
    }

    //sets the center as the average position of all the points
    setCenter() {
        let x = 0;
        let y = 0;
        for (var v of this.pixelVectorPositions) {
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
        for (var v of this.vectors) {
            vertex(v.x * SCALE, v.y * SCALE);
        }
        endShape(CLOSE);


    }

    //moves all the points so the center is now in the new position
    setPosition(newPos) {
        let difference = p5.Vector.sub(newPos, this.pixelCenter);
        difference.rotate(-this.body.angle);

        for (var i = 0; i < this.pixelVectorPositions.length; i++) {
            this.pixelVectorPositions[i].x += difference.x;
            this.pixelVectorPositions[i].y += difference.y;
        }

        this.setCenter();
        this.setShape();
        this.resetFixture();
    }

    //rotates the polygon by getting each point as a vector then rotating it
    rotate(rotateAmount, rotateAround) {
        if (!rotateAround) {
            rotateAround = this.center;
        }
        let vectorsRelativeToCenter = [];

        for (let v of this.pixelVectorPositions) {
            vectorsRelativeToCenter.push(p5.Vector.sub(v, rotateAround));
        }

        for (let v of vectorsRelativeToCenter) {
            v.rotate(rotateAmount);
        }

        for (var i = 0; i < this.pixelVectorPositions.length; i++) {
            this.pixelVectorPositions[i] = p5.Vector.add(vectorsRelativeToCenter[i], rotateAround);
        }
        this.setCenter();
        this.setShape();
        this.resetFixture();

    }

    //scales the fixture relative to the body
    scaleRelativeToBody(multiplyAmount) {
        this.resize(multiplyAmount, createVector(0, 0));
    }

    //resizes the fixture relative to the input vector
    resize(multAmount, resizeRelativeTo) {
        if (!resizeRelativeTo) {
            resizeRelativeTo = this.center;
        }

        let vectorsRelativeToCenter = [];

        for (var v of this.pixelVectorPositions) {
            vectorsRelativeToCenter.push(p5.Vector.sub(v, resizeRelativeTo));
        }

        for (var v of vectorsRelativeToCenter) {
            v.mult(multAmount);
        }

        for (var i = 0; i < this.pixelVectorPositions.length; i++) {
            this.pixelVectorPositions[i] = p5.Vector.add(vectorsRelativeToCenter[i], resizeRelativeTo);
        }
        this.setCenter();
        this.setShape();
        this.resetFixture();

    }

    //returns the fixture information as an object (like JSON)
    getFixtureInfoAsObject() {
        let obj = {fixtureType: "", fillColor: 0};
        obj.pixelVectorPositions = this.pixelVectorPositions.map((x) => new createEvanVector(x));
        obj.fillColor = this.fillColor;
        return obj;
    }


    //returns whether or not this fixture was hit by the lazer
    hitByLazer(lazerX) {

        for (let pos of this.pixelVectorPositions) {
            let pos2 = cloneVector(pos);
            pos2.rotate(-this.body.body.GetAngle());
            if (this.body.getShiftedPixelCoordinates().x + pos2.x < lazerX) {
                return true;
            }
        }
        return false;
    }

}
//since p5s vectors cannot be added to an object becuase they have infinite loops i need to create my own with no fancy stuff
function createEvanVector(vec) {
    this.x = vec.x;
    this.y = vec.y;
}

//converts a list of pixel positions to world positions
function p5VectorsToVec2(vectors) {
    let newVecs = [];
    for (var i = 0; i < vectors.length; i++) {
        newVecs.push(new Vec2(vectors[i].x / SCALE, vectors[i].y / SCALE));
    }
    return newVecs;
}
