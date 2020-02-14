//creates a joint between 2 bodies
function generateAddJointButton(x, y, w, h, modeNumber) {
    let buttonText = "Add Joint";
    let mode = new Mode();

    mode.selectedBody1 = -1;
    mode.selectedBody2 = -1;
    mode.jointAnchor = null;

    mode.onActivate = function () {
        this.selectedBody1 = -1;
        this.selectedBody2 = -1;


        if (creature.bodies.length === 0) {
            warning = new Warning("Mate, just a hint, why don't you add some shapes before you try and join them?", 300);
        }
        if (creature.bodies.length === 1) {
            warning = new Warning("So you've got one shape, which is fantastic. \n However what are you gonna join it to?", 400);
        }
    };

    mode.drawEffects = function () {
        if (this.selectedBody2 !== -1) {
            push();
            fill(0, 0, 0);
            stroke(255, 255, 0);
            strokeWeight(2);
            ellipse(mouseX, mouseY, 5);
            pop();
        }
    };

    mode.everyFrame = function () {
        if (this.selectedBody2 === -1) {
            creature.selectBodyMouseIsOverExcluding(this.selectedBody1);
        }
    };


    mode.onClick = function () {
        if (creature.selectedBody !== -1) {
            if (this.selectedBody1 === -1) {
                this.selectedBody1 = creature.selectedBody;
                creature.getSelectedBody().selectedAsShape1 = true;
            } else if (this.selectedBody2 === -1) {
                this.selectedBody2 = creature.selectedBody;

            } else if (this.jointAnchor == null) {
                this.jointAnchor = getShiftedMousePos();
                var newRevoluteJoint = new RevoluteJoint(creature.bodies[this.selectedBody1], creature.bodies[this.selectedBody2], this.jointAnchor.x, this.jointAnchor.y);
                creature.joints.push(newRevoluteJoint);
                this.selectedBody1 = -1;
                this.selectedBody2 = -1;
                this.jointAnchor = null;
                creature.unselectEverything();
                warning = new Warning("Joint Added", 100, true);
            }
        }
    };
    mode.buttonPressed = function () {
        switch (keyCode) {

            case ESCAPE:

                if (this.selectedBody1 === -1) {
                    buttonManager.deactivateActiveModes();
                } else if (this.selectedBody2 === -1) {
                    this.selectedBody1 = -1;
                    creature.unselectAllBodies();
                } else {
                    this.selectedBody2 = -1;
                }

                break;

        }
    };
    mode.instructions.getMessages = function () {

        let currentMode = buttonManager.getCurrentMode();
        let messages = [];
        if (currentMode.selectedBody1 === -1) {
            messages.push("Select first shape to join");
            messages.push("  CLICK: select shape");
            messages.push("   ESC: cancel");
        } else if (currentMode.selectedBody2 === -1) {
            messages.push("Select second shape to join");
            messages.push("CLICK: select shape");
            messages.push("ESC: unselect first shape");
        } else {
            messages.push("Position rotation point");
            messages.push("CLICK: place rotation point");
            messages.push("ESC: unselect second shape");
        }
        return messages;
    };


    return new ModeButton(x, y, w, h, buttonText, mode, modeNumber);
}