//this class contains the box2d world for the creature and handles all logic involving it
class World{

    constructor(){
        this.box2dWorld = new b2World(new Vec2(0, 10), true);//the box2dWorld that the created creature is in.
        this.paused = true;
        this.isReset  = true;

    }

    //needs to happen after the constructor because this world object is used within generateFloorBody so yeah
    addFloorToWorld(){
        this.floorBody = this.generateFloorBody();

    }

    //show the floor
    show(){
        this.floorBody.show();
    }

    //progress the world if its not paused
    update(){
        if (!this.paused) {
            this.box2dWorld.Step(1 / 30, 10, 10);
        }
    };

    //generates the static body which all the creatures walk on.
    generateFloorBody(){
        let body = new Body(-100, 764, 0, false);
        body.addRectFixture(-531, -15, 12000, 120, 0);
        body.fixtures[body.fixtures.length - 1].setValues(0.1, 1, 0.45);
        return body;
    }

    //resets the world to its start state
    reset(){
        this.isReset = true;
        this.paused = true;

        for (let b of creature.bodies) {
            b.reset();
        }
        this.resetBodyCollisions();
        for (let j of creature.joints) {
            j.reset();
        }
    }

    //pauses/unpauses the world
    togglePause(){
        this.isReset = false;
        this.paused = !this.paused;
        mouseJoint.destroyJoint();
        buttonManager.deactivateActiveModes();
    }


    //updates the collision information for all the bodies
    resetBodyCollisions() {

        this.setBodyCollisionGroupsAndSetCategoryBits();

        for (let b of creature.bodies) {
            b.resetCategoryMask();
        }
        for (let b of creature.bodies) {
            b.resetFilterData();
        }
        this.floorBody.resetFilterDataForGround();
    }


    //set this collision group for each body
    setBodyCollisionGroupsAndSetCategoryBits() {

        if(allowBodyCollisions) {
            let collisionGroups = this.getCollisionGroups();

            for (let i = 0; i < collisionGroups.length; i++) {
                for (var b of collisionGroups[i]) {
                    b.setCategoryBitsFromGroupNo(i);
                }
            }
        }else{
            //everything is in one group where they can only contact the floor
            for(let b of creature.bodies){
                b.setCategoryBitsFromGroupNo(0);
            }
        }
    }

    //returns a list of all groups of bodies which have the same collisions
    // [ group1, group2, group3]
    getCollisionGroups() {
        let collisionGroups = [];
        for (let b of creature.bodies) {

            let added = false;
            for (let i = 0; i < collisionGroups.length; i++) {
                if (this.haveSameCollisions(collisionGroups[i][0], b)) {
                    collisionGroups[i].push(b);
                    added = true;
                    break;
                }
            }
            if (!added) {
                collisionGroups.push([b]);
            }
        }
        collisionGroups.sort((a, b) => b.length - a.length);
        return collisionGroups;
    }


    //returns whether or not 2 bodies have the same collision bits, i.e. collide with the same bodies
    haveSameCollisions(body1, body2) {
        if (body1.bodiesToNotCollideWith.length !== body2.bodiesToNotCollideWith.length) {
            return false;
        }
        for (let b of body1.bodiesToNotCollideWith) {
            if (!body2.bodiesToNotCollideWith.contains(b)) {
                return false;
            }
        }
        return true;
    }

}