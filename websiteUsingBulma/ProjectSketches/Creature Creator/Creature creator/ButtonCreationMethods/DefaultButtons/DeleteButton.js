//allows the user to delete bodies and joints
function generateDeleteButton(x, y, w, h, modeNumber) {
    let buttonText = "Delete";
    let mode = new Mode();
    mode.onActivate = function () {
        if (creature.bodies.length === 0) {
            warning = new Warning("I'm curious, what exactly do you plan on deleting?", 150);
        }
    };

    mode.everyFrame = function () {
        creature.selectBodyOrJointMouseIsOver();
    };


    mode.onClick = function () {
        if (creature.selectedBody !== -1) {
            creature.getSelectedBody().remove();
            creature.bodies.splice(creature.selectedBody, 1);
            creature.selectedBody = -1;
            warning = new Warning("Shape Deleted", 100, true);

        } else if (creature.selectedJoint !== -1) {
            creature.getSelectedJoint().remove();
            creature.joints.splice(creature.selectedJoint, 1);
            creature.selectedJoint = -1;
            warning = new Warning("Joint Deleted", 100, true);

        }
    };
    mode.buttonPressed = function () {
        switch (keyCode) {
            case ESCAPE:
                buttonManager.deactivateActiveModes();
                break;
        }
    };
    mode.instructions.getMessages = function () {
        let messages = [];
        messages.push("Delete shapes and joints");
        messages.push("CLICK: delete shape or joint");
        messages.push("ESC: exit ");
        return messages;
    };


    return new ModeButton(x, y, w, h, buttonText, mode, modeNumber);
}