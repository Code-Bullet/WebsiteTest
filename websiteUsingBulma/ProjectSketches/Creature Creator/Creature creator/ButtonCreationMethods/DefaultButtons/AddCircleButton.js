//adds a circle to the creature
function generateAddCircleButton(x, y, w, h, modeNumber) {
    let buttonText = "Add Circle";
    let mode = new Mode();

    mode.drawEffects = function () {
        fill(selectedBodyFillColor);
        stroke(selectedStrokeColor);
        ellipse(mouseX, mouseY, newCircleSize * 2);
    };


    mode.onClick = function () {
        let circleBody = new Body(mouseX, mouseY, 0, true);
        circleBody.addCircleFixture(0, 0, newCircleSize);

        creature.bodies.push(circleBody);
        warning = new Warning("Circle Added", 100, true);

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
        newCircleSize = max(newCircleSize + (shiftIncrease) * mouseDirection, 1);
    };

    mode.instructions.getMessages = function () {
        let messages = [];
        messages.push("Add Circle");
        messages.push("MOUSE WHEEL: scale circle");
        messages.push("HOLD SHIFT: increase scale speed");
        messages.push("ESC: cancel");
        return messages;
    };



    return new ModeButton(x, y, w, h, buttonText, mode, modeNumber);
}