//this button allows the user to remove collisions between certain bodies
function generateShapeCollisionsButton(x, y, w, h, modeNumber){
    let buttonText = "Shape Collisions";
    let mode = new Mode();
    mode.selectedShape1 = -1;
    mode.selectedShape2 = -1;
    mode.removeCollision = true;

    mode.onActivate = function () {
        if (creature.bodies.length < 2) {
            warning = new Warning("This button is used for adding or removing collisions between 2 shapes \n " +
                "therefore you are gonna need 2 shapes", 400);
        }
    };

    mode.everyFrame = function () {
        creature.selectBodyMouseIsOverExcluding(this.selectedShape1);
    };

    mode.onDeactivate = function () {
        this.selectedShape1 = -1;
        this.selectedShape2 = -1;
    };

    mode.onClick = function () {

        if (creature.selectedBody !== -1) {
            if (this.selectedShape1 === -1) {
                this.selectedShape1 = creature.selectedBody;
                creature.getSelectedBody().selectedAsShape1 = true;
            } else {
                this.selectedShape2 = creature.selectedBody;


                if (this.removeCollision) {
                    creature.bodies[this.selectedShape1].removeCollisionsWith(creature.bodies[this.selectedShape2]);
                    creature.bodies[this.selectedShape2].removeCollisionsWith(creature.bodies[this.selectedShape1]);
                } else {
                    creature.bodies[this.selectedShape1].allowCollisionsWith(creature.bodies[this.selectedShape2]);
                    creature.bodies[this.selectedShape2].allowCollisionsWith(creature.bodies[this.selectedShape1]);
                }
                let clusterFuck = world.getCollisionGroups().length > 12;

                world.resetBodyCollisions();
                creature.unselectEverything();

                this.selectedShape1 = -1;
                this.selectedShape2 = -1;

                if (clusterFuck) {
                    warning = new Warning("Wow nice clusterfuck of collision logic you got there\n prepare for shit to hit the fan if you keep this up", 500);

                } else {
                    if (this.removeCollision) {
                        warning = new Warning("Collisions between shapes removed", 100, true);
                    } else {
                        warning = new Warning("Collisions between shapes added", 100, true);
                    }
                }
            }
        }
    };


    mode.buttonPressed = function () {
        switch (keyCode) {
            case TAB:
                this.removeCollision = !this.removeCollision;

                break;

            case ESCAPE:

                if (this.selectedShape1 === -1) {
                    buttonManager.deactivateActiveModes();
                } else {
                    this.selectedShape1 = -1;
                    creature.unselectAllBodies();
                }
                break;
        }
    };
    mode.instructions.getMessages = function () {
        let messages = [];
        let onClickDescription = (buttonManager.getCurrentMode().removeCollision) ? "remove a collision from" : "add a collision to";
        let addOrRemove = (buttonManager.getCurrentMode().removeCollision) ? "Remove" : "Add";

        messages.push(`${addOrRemove} collisions between 2 shapes`);
        if (buttonManager.getCurrentMode().selectedShape1 === -1) {
            messages.push(`CLICK: select first shape to ${onClickDescription}`);
            messages.push("TAB: toggle between adding and removing collisions");
            messages.push("ESC: cancel");
        } else {
            messages.push(`CLICK: select second shape to ${onClickDescription}`);
            messages.push("TAB: toggle between adding and removing collisions");
            messages.push("ESC: unselect first shape");
        }
        return messages;
    };

    return new ModeButton(x, y, w, h, buttonText, mode, modeNumber);
}
