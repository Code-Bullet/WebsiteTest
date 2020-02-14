//allows the user to move and resize shit
function generateMoveResizeButton(x, y, w, h, modeNumber) {

    let buttonText = "Move/Resize";
    let mode = new Mode();
    mode.onActivate = function () {
        if (creature.bodies.length === 0) {
            warning = new Warning("I worked on this for A YEAR and you're here trying to resize nothing \n I clearly overestimated my audience", 400);
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
            creature.bodies[creature.selectedBody].scale(1 + (0.02 * shiftIncrease) * mouseDirection);
        }
    };
    mode.instructions.getMessages = function () {
        let messages = [];
        messages.push("Move and Resize");
        messages.push("CLICK AND DRAG: move shape or joint");
        messages.push("MOUSE WHEEL: scale shape");
        messages.push("HOLD SHIFT: increase scale speed");
        messages.push("ESC: exit ");
        return messages;
    };

    return new ModeButton(x, y, w, h, buttonText, mode, modeNumber);
}