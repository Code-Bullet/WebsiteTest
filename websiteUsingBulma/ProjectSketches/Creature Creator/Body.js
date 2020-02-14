//this class contains all the logic for creating and controlling box2d bodies, it also contains all fixtures in this body and all body images attached to this body
class Body {
    constructor(x, y, angle, isDynamic, worldParameter) {
        this.x = x;
        this.y = y;
        this.angle = angle;

        this.isDynamic = isDynamic;//dynamic objects are effected by gravity and forces
        //create body defintion
        var bodyDef = new b2BodyDef();
        if (isDynamic) {
            bodyDef.type = b2DynamicBody;
        } else {
            bodyDef.type = b2StaticBody;
        }

        bodyDef.position.x = x / SCALE;
        bodyDef.position.y = y / SCALE;
        bodyDef.angle = angle;
        this.bodyDef = bodyDef;

        if (worldParameter) {//if the box2dWorld parameter is not null then this body has its own box2dWorld
            this.world = worldParameter;

        } else { //otherwise it uses the global box2dWorld
            this.world = world.box2dWorld;
        }

        //add this body to the box2d world
        this.body = this.world.CreateBody(this.bodyDef);
        this.body.SetUserData(this);

        this.fixtures = [];// all the fixtures that make up this body

        //selection variables
        this.selected = false;
        this.selectedAsShape1 = false;

        this.removed = false;

        //collision logic variables
        this.collideWithAll = true;
        this.bodiesToNotCollideWith = [];

        this.categoryBits = 0;
        this.categoryMask = 0;

        //id is used to identify the ground object from others
        this.id = "";
        this.isDead = false;
        this.deathIfTouchesGround = false;


        this.bodyImages = [];

        this.showImageObjects = true;
        this.isOnScreen = true;
    }

    //adds an image to this body
    addBodyImage(bodyImage) {
        this.bodyImages.push(bodyImage);
    }

    //adds a rectangle fixture to this body
    addRectFixture(x, y, w, h, angle) {
        let fixture = new RectangleFixture(x, y, w, h, angle);
        fixture.addToBody(this);
        this.fixtures.push(fixture);
    }

    //adds a circle fixture to this body
    addCircleFixture(x, y, radius) {
        let fixture = new CircleFixture(x, y, radius);
        fixture.addToBody(this);
        this.fixtures.push(fixture);
    }

    //adds an array fixture (polygon) to this body
    addArrayFixture(arr) {
        let fixture = new CompoundFixture(arr);
        fixture.addToBody(this);
        this.fixtures.push(fixture);
    }

    //shows all fixtures
    showFixtures() {
        for (var f of this.fixtures) {
            f.show(this.body);
        }
    }


    //shows the body
    show() {
        //show fixtures
        this.showFixtures();

        //if in creature creator show center dot
        if (inCreatureCreatorMode) {
            let x = this.body.GetPosition().x * SCALE;
            let y = this.body.GetPosition().y * SCALE;

            push();
            fill(0, 0, 0, 50);
            if (this.selected && !buttonManager.isInMode("Delete")) {
                fill(255, 255, 0, 200);
            }
            noStroke();
            ellipse(x, y, 3);
            pop();
        }

        //if this body isn't dead (i.e. if the player controlling it isn't dead) show the body images
        if (!this.isDead) {
            let x = this.body.GetPosition().x * SCALE;
            let y = this.body.GetPosition().y * SCALE;
            let angle = this.body.GetAngle();

            push();
            translate(x, y);
            rotate(angle);

            for (let bodyImage of this.bodyImages) {
                bodyImage.showRelativeToBody();
            }
            pop();

            this.isOnScreen = x + panX > -10;
        }


    }

    //gets the pixel coordinates of the body
    getPixelCoordinates() {
        let x = this.body.GetPosition().x * SCALE + getPannedOffset().x;
        let y = this.body.GetPosition().y * SCALE + getPannedOffset().y;
        return createVector(x, y);
    }

    //gets the pixel position of the body without accounting for panning
    getShiftedPixelCoordinates() {
        let x = this.body.GetPosition().x * SCALE;
        let y = this.body.GetPosition().y * SCALE;
        return createVector(x, y);
    }

    //sets the position of the body
    setPosition(newVec) {
        let newVec2 = new Vec2((newVec.x - getPannedOffset().x) / SCALE, (newVec.y - getPannedOffset().y) / SCALE); //windowOffset.x - windowPadding) / SCALE, (newVec.y - windowOffset.y - windowPadding) / SCALE);
        this.body.SetPosition(newVec2);
        this.x = newVec2.x * SCALE;
        this.y = newVec2.y * SCALE;

        this.bodyDef.position = newVec2;
        for (var f of this.fixtures) {
            f.setPixelCenter();
        }
        creature.resetJointsAttachedToBody(this);
    }

    //checks each fixture to see if pos is within them, used for the mouse selecting bodies
    isShiftedPixelPosWithinFixtures(shiftedPixelCoords) {
        let localPos = this.getLocalPixelCoordinatesOfPixelLocation(shiftedPixelCoords);
        for (var f of this.fixtures) {
            if (f.isLocalPixelPosWithinFixture(localPos)) {
                return true;
            }
        }

        return false;
    }

    //returns the local world coordinates of the argument vector
    getLocalWorldCoordinatesOfPixelLocation(shiftedPixelCoords) {
        let bodyPos = this.getShiftedPixelCoordinates();
        let relativePixelCoords = p5.Vector.sub(shiftedPixelCoords, bodyPos);
        relativePixelCoords.rotate(-this.body.GetAngle());
        return new Vec2(relativePixelCoords.x / SCALE, relativePixelCoords.y / SCALE);
    }


    //returns the local pixel coordinates of the argument vector
    getLocalPixelCoordinatesOfPixelLocation(shiftedPixelCoords) {
        let bodyPos = this.getShiftedPixelCoordinates();
        let relativePixelCoords = p5.Vector.sub(shiftedPixelCoords, bodyPos);
        relativePixelCoords.rotate(-this.body.GetAngle());
        return relativePixelCoords;
    }

    //rotates the body
    rotate(rotateAmount) {
        this.body.SetAngle(this.body.GetAngle() + rotateAmount);
        this.bodyDef.angle += rotateAmount;
        this.angle += rotateAmount;

        for (var f of this.fixtures) {
            f.setPixelCenter();
        }

        creature.resetJointsAttachedToBody(this);
    }

    //resets the body, returning it to its starting position in the world
    reset() {
        this.world.DestroyBody(this.body);
        this.body = this.world.CreateBody(this.bodyDef);
        this.body.SetUserData(this);
        for (var f of this.fixtures) {
            f.addToBody(this);
        }

    }

    //destroy this body, removing it from the box2d world

    remove() {
        this.world.DestroyBody(this.body);
        this.removed = true;
        //remove all joints that were attached to this body
        creature.removeJointsAttachedToADestroyedBody();
    }

    //clones the body and all its fixtures and body images
    clone() {
        //clone body
        let clone = new Body(this.x, this.y, this.angle, this.isDynamic);
        //clone fixtures
        for (var f of this.fixtures) {
            if (f.fixtureType === "rectangle") {
                clone.addRectFixture(f.x, f.y, f.w, f.h, f.angle);
            } else if (f.fixtureType === "circle") {
                clone.addCircleFixture(f.x, f.y, f.radius);
            } else {

                let vectorCopy = [];
                for (var v of f.pixelVectorPositions) {
                    vectorCopy.push(createVector().set(v));
                }
                clone.addArrayFixture(vectorCopy);
            }

            clone.fixtures[clone.fixtures.length - 1].fillColor = f.fillColor;

        }
        //clone body images
        for (let bodyImage of this.bodyImages) {
            bodyImage.clone().addToBody(clone);
        }
        return clone;
    }

    //add all the fixtures and joints from the argument body to this body
    addAllFixturesAndJointsFromBody(body) {

        //add all the fixtures
        for (var f of body.fixtures) {
            f.setPixelCenter();

            let diff = p5.Vector.sub(f.pixelCenter, createVector(this.x, this.y));


            if (f.fixtureType === "rectangle") {//add a new rectangle fixture

                let vectors = f.getPixelVectors();
                for (let v of vectors) {
                    v.rotate(body.angle);
                    v.add(createVector(body.x, body.y));
                    v.sub(createVector(this.x, this.y));
                    v.rotate(-this.angle);
                }

                let vectorCopy = [];
                for (let v of vectors) {
                    vectorCopy.push(createVector().set(v));
                }
                this.addArrayFixture(vectorCopy);

            } else if (f.fixtureType === "circle") { //adds a circle fixture
                let v = createVector(f.x, f.y);
                v.rotate(body.angle);
                v.add(createVector(body.x, body.y));
                v.sub(createVector(this.x, this.y));
                v.rotate(-this.angle);
                this.addCircleFixture(v.x, v.y, f.radius);
            } else {//adds a polygon (array) fixture
                let vectorCopy = [];
                for (let v of f.pixelVectorPositions) {

                    v.rotate(body.angle);
                    v.add(createVector(body.x, body.y));
                    v.sub(createVector(this.x, this.y));
                    v.rotate(-this.angle);
                    vectorCopy.push(createVector().set(v));
                }
                this.addArrayFixture(vectorCopy);
            }
            //make sure the colors match
            this.fixtures[this.fixtures.length - 1].fillColor = f.fillColor;
        }

        //add all the joints
        for (var i = 0; i < creature.joints.length; i++) {
            if (creature.joints[i].body1 === body) {
                creature.joints[i].body1 = this;
            }
            if (creature.joints[i].body2 === body) {
                creature.joints[i].body2 = this;
            }

            if (creature.joints[i].body2 === this && creature.joints[i].body1 === this) {
                creature.joints[i].remove();
                creature.joints.splice(i, 1);
                i--;
                continue;
            }
            creature.joints[i].reset();
        }
    }

    //adds a fixture to a body
    addFixtureToBody(f) {
        if (f.fixtureType === "rectangle") {
            this.addRectFixture(f.x, f.y, f.w, f.h, f.angle);
        } else if (f.fixtureType === "circle") {
            this.addCircleFixture(f.x, f.y, f.radius);
        } else {
            let vectorCopy = [];
            for (var v of f.pixelVectorPositions) {
                vectorCopy.push(createVector().set(v));
            }
            this.addArrayFixture(vectorCopy);
        }
    }

    //scale the body and all its fixtures and body images
    scale(multiplyAmount) {
        for (var f of this.fixtures) {
            f.scaleRelativeToBody(multiplyAmount);

        }
        print("HERE");
        for (let bodyImage of this.bodyImages) {
            bodyImage.scaleRelativeToBody(multiplyAmount);
        }
        creature.resetJointsAttachedToBody(this);
    }

    //remove collisions with another body
    removeCollisionsWith(body2) {
        if (this.bodiesToNotCollideWith.contains(body2)) {
            return;
        }

        this.bodiesToNotCollideWith.push(body2);
    }

    //enable collisions with another body
    allowCollisionsWith(body2) {

        let index = this.bodiesToNotCollideWith.indexOf(body2);
        if (index !== -1) {
            this.bodiesToNotCollideWith.remove(index);
        }
    }

    resetCategoryBits() {
        this.categoryBits = Math.pow(2, this.getBodyNoAccountingForFloor());
    }

    setCategoryBitsFromGroupNo(i) {
        this.categoryBits = Math.pow(2, i + 1);//dont forget the ground
    }

    //resets the colision logic of the body based on collision variables
    resetCategoryMask() {

        this.categoryMask = 1;//always collide with the ground


        let bodiesToCollideWith = [...creature.bodies];

        //filter out all bodies which are in this.bodiesToNotCollideWith

        if (allowBodyCollisions) {
            bodiesToCollideWith = bodiesToCollideWith.filter((b) => !this.bodiesToNotCollideWith.contains(b));
        } else {
            bodiesToCollideWith = []; //collide with no bodies
        }


        for (let b of bodiesToCollideWith) {
            this.categoryMask = this.categoryMask | b.categoryBits;
        }
    }

    //resets the collision logic of the floor body based on collision variables
    resetFilterDataForGround() {
        let filterData = new b2FilterData();
        filterData.categoryBits = 1;

        let colGroups = world.getCollisionGroups();

        this.categoryMask = 1;
        for (let i = 0; i < colGroups.length; i++) {
            this.categoryMask = this.categoryMask | colGroups[0].categoryBits;
        }

        filterData.maskBits = this.categoryMask;

        for (let f of this.fixtures) {
            f.setFilterData(filterData);
        }
    }

    //resets the collision logic of the body based on collision variables
    resetFilterData() {
        this.filterData = new b2FilterData();
        this.filterData.categoryBits = this.categoryBits;
        this.filterData.maskBits = this.categoryMask;

        for (let f of this.fixtures) {
            f.setFilterData(this.filterData);
            f.resetFixture();
        }
    }

    //gets the body number that it is in the bodies array with the +1 added for the floor
    getBodyNoAccountingForFloor() {
        for (var i = 0; i < creature.bodies.length; i++) {
            if (creature.bodies[i] === this) {
                return i + 1;
            }
        }
    }

    //get body number
    getBodyNo() {
        for (var i = 0; i < creature.bodies.length; i++) {
            if (creature.bodies[i] === this) {
                return i;
            }
        }
    }

    //returns all body information as an object
    getBodyInfoAsObject() {
        let obj = {
            x: 0,
            y: 0,
            angle: 0,
            isDynamic: true,
            categoryBits: 0,
            categoryMask: 0,
            deathIfTouchesGround: false
        };

        Object.assignMatching(obj, this);

        obj.fixtures = [];
        for (let f of this.fixtures) {
            obj.fixtures.push(f.getFixtureInfoAsObject())
        }
        obj.bodiesToNotCollideWith = [];
        for (let b of this.bodiesToNotCollideWith) {
            obj.bodiesToNotCollideWith.push(creature.getBodyNo(b));
        }

        obj.bodyImages = [];
        for (let bodyImage of this.bodyImages) {
            obj.bodyImages.push(bodyImage.getBodyImageAsObject());
        }

        return obj;
    }

    //sets the fill color of all the fixtures in this body
    setFillColorOfAllFixtures(color) {
        for (let f of this.fixtures) {
            f.fillColor = color;
        }
    }

    //sets the outline color of all the fixtures in this body
    setOutlineColorOfAllFixtures(color) {
        for (let f of this.fixtures) {
            f.outlineColor = color;
        }
    }
}


Object.prototype.assignMatching = function (to, from) {
    Object.keys(from).forEach((key) => {
        if (key in to) {
            to[key] = from[key];
        }
    });
};

Array.prototype.contains = function (o) {
    for (let i = 0; i < this.length; i++) {
        if (this[i] === o) {
            return true;
        }
    }
    return false;
};


Array.prototype.remove = function (index) {
    this.splice(index, 1);
};