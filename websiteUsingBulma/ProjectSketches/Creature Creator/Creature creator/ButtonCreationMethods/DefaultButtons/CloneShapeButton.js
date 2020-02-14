//clones a body and allows the user to place it where they want
//also clones any images attached to the body
function generateCloneShapeButton(x, y, w, h, modeNumber) {


    let buttonText = "Clone Shape";
    let mode = new Mode();
    mode.bodyIsCloned = false;
    mode.onActivate = function () {
        if (creature.bodies.length === 0) {
            warning = new Warning("There is nothing to clone mate", 400);
        }
    };

    mode.everyFrame = function () {
        if (this.bodyIsCloned) {
            creature.moveSelectedBodyOrJointToMousePos();
        } else {
            creature.selectBodyMouseIsOverExcluding();
        }
    };

    mode.onDeactivate = function () {
        if (this.bodyIsCloned) {
            this.removeClone();
        }
    };

    mode.onClick = function () {
        if (creature.selectedBody !== -1) {
            if (!this.bodyIsCloned) {

                creature.bodies.push(creature.getSelectedBody().clone());
                creature.getSelectedBody().selected = false;
                creature.selectBody(creature.bodies.length - 1);
                this.bodyIsCloned = true;
                dragMouseFrom = createVector(mouseX, mouseY);
                window.startingBodyPos = creature.getSelectedBody().getPixelCoordinates();
            } else {
                this.bodyIsCloned = false;
                warning = new Warning("Shape Cloned", 100, true);

            }
        }
    };
    mode.buttonPressed = function () {
        switch (keyCode) {
            case SHIFT:
                shiftIncrease = 10;
                break;

            case ESCAPE:
                if (this.bodyIsCloned) {
                    this.removeClone();
                } else {
                    buttonManager.deactivateActiveModes();
                }
                break;
        }
    };
    mode.scrollWheel = function (mouseDirection) {
        if (creature.selectedBody !== -1 && this.bodyIsCloned) {
            creature.getSelectedBody().rotate(PI / 200 * shiftIncrease * mouseDirection);
        }
    };
    mode.instructions.getMessages = function () {
        let messages = [];
        let currentMode = buttonManager.getCurrentMode();
        if (!currentMode.bodyIsCloned) {
            messages.push("Select shape to clone");
            messages.push("  CLICK: select shape");
            messages.push(" ESC: cancel");
        } else {
            messages.push("Position Clone");
            messages.push("CLICK: confirm position of clone");
            messages.push("MOUSE WHEEL: rotate clone");
            messages.push("HOLD SHIFT: increase rotation speed");
            messages.push("ESC: remove clone");
        }
        return messages;
    };

    mode.removeClone= function() {
        creature.getSelectedBody().remove();
        creature.bodies.splice(creature.selectedBody, 1);
        creature.selectedBody = -1;
        this.bodyIsCloned = false;
    };


    return new ModeButton(x, y, w, h, buttonText, mode, modeNumber);
}