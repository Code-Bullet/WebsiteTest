//a class which handles all the mouse Joint logic which is used to drag bodies around in the creature creator mode
class MouseJoint {

    constructor() {
        this.mouseJoint;
        this.isActive = false;

    }

    //create a new mouse joint if a body is clicked on
    onClick(){
        this.destroyJoint();
        let bodyClickedOn = creature.getBodyNoMouseIsOver();

        if (bodyClickedOn === -1) {
            return;
        }

        //create mouse joint definition with the clicked on body at the point where the mouse clicked
        let mouseJointDef = new b2MouseJointDef();
        let groundBody = new Body(0, 0, 0, false);// the mouse joint needs a static object to "ground it" whatever that means, all i know is that it works.
        mouseJointDef.bodyA = groundBody.body;
        mouseJointDef.bodyB = creature.bodies[bodyClickedOn].body;
        mouseJointDef.collideConnected = true;
        mouseJointDef.maxForce = 10000000;
        mouseJointDef.dampingRatio = 0;
        this.mouseJoint = world.box2dWorld.CreateJoint(mouseJointDef);
        this.mouseJoint.m_localAnchor = creature.bodies[bodyClickedOn].getLocalWorldCoordinatesOfPixelLocation(getShiftedMousePos());

        this.updateTarget();
        this.isActive = true;
    }

    //updates the target of the joint to the new mouse position
    updateTarget(){
        if(this.isActive) {
            this.mouseJoint.SetTarget(new Vec2((getShiftedMousePos().x) / SCALE, (getShiftedMousePos().y) / SCALE));
        }
    }

    //removes the joint from the box2dWorld
    destroyJoint(){
        if (this.isActive) {
            world.box2dWorld.DestroyJoint(this.mouseJoint);
            this.isActive = false;
        }
    }
}
