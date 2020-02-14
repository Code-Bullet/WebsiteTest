//this button allows the user to reorder the bodies so they appear in different orders
function generateEditShapeLayersButton(x, y, w, h, modeNumber){
    let buttonText = "Edit shape layers";
    let mode = new Mode();
    mode.bodies = [];

    mode.onActivate = function () {

    };


    mode.everyFrame = function () {
        creature.selectBodyMouseIsOverExcluding(...this.bodies.map((b) => creature.getBodyNo(b)));
    };

    mode.onDeactivate = function () {

        this.bodies = [];
        creature.unselectAllBodies();

    };
    mode.onClick = function () {

        if (creature.selectedBody !== -1) {
            this.bodies.push(creature.getSelectedBody());
            creature.getSelectedBody().selectedAsShape1 = true;

            if (this.bodies.length === creature.bodies.length) {
                creature.bodies = this.bodies;

                buttonManager.deactivateActiveModes();
            }
        }
    };
    mode.buttonPressed = function () {
        switch (keyCode) {
            case ESCAPE:
                if (this.bodies.length === 0) {
                    buttonManager.deactivateActiveModes();
                } else {
                    this.bodies[this.bodies.length - 1].selectedAsShape1 = false;
                    this.bodies.splice(this.bodies.length - 1, 1);//remove last element of this.bodies

                }
                break;
        }
    };

    mode.instructions.getMessages = function () {
        let messages = [];

        messages.push("Select the order the shapes should be displayed from back to front");
        messages.push("CLICK: select shape");
        if (buttonManager.getCurrentMode().bodies.length === 0) {
            messages.push("ESC: exit ");
        } else {
            messages.push("ESC: unselect shape")
        }
        return messages;
    };

    return new ModeButton(x, y, w, h, buttonText, mode, modeNumber);
}
