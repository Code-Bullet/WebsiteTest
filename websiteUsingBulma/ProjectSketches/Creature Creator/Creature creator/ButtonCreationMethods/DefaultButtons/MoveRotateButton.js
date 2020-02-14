//allows the user to move and rotate shit
function generateMoveRotateButton(x, y, w, h, modeNumber) {
    let buttonText = "Move/Rotate";
    let mode = new Mode();
    mode.onActivate = function () {
        if (creature.bodies.length === 0) {
            warning = new Warning("You can't move anything if there is nothing there genius", 150);
        }

    };


    mode.everyFrame = function () {
        if (!dragging) {
            creature.selectBodyOrJointMouseIsOver();
        } else {
            creature.moveSelectedBodyOrJointToMousePos();

        }


    };


    mode.onClick = function () {
        if (creature.selectedBody !== -1) {
            dragMouseFrom = createVector(mouseX, mouseY);
            window.startingBodyPos = creature.bodies[creature.selectedBody].getPixelCoordinates();

        } else if (creature.selectedJoint !== -1) {
            dragMouseFrom = createVector(mouseX, mouseY);
            window.startingAnchorPos = creature.joints[creature.selectedJoint].getPixelCoordinatesOfAnchor(0);

        }
    };
    mode.buttonPressed = function () {
        switch (keyCode) {
            case SHIFT:
                shiftIncrease = 10;
                break;

            case ESCAPE:

                buttonManager.deactivateActiveModes();

                break;


        }
    };
    mode.scrollWheel = function (mouseDirection) {
        if (creature.selectedBody !== -1) {
            if (creature.bodies[creature.selectedBody].fixtures.length === 1 && creature.bodies[creature.selectedBody].fixtures[0].fixtureType === "circle" && creature.bodies[creature.selectedBody].bodyImages.length === 0) {
                warning = new Warning("Did you really just try to rotate a circle", 100);
            }
            creature.bodies[creature.selectedBody].rotate(PI / 200 * shiftIncrease * mouseDirection);
        }
    };
    mode.instructions.getMessages = function () {
        let messages = [];
        messages.push("Move and Rotate");
        messages.push("CLICK AND DRAG: move shape or joint");
        messages.push("MOUSE WHEEL: rotate shape");
        messages.push("HOLD SHIFT: increase rotation speed");
        messages.push("ESC: exit ");
        return messages;
    };


    return new ModeButton(x, y, w, h, buttonText, mode, modeNumber);
}