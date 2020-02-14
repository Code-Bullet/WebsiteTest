//allows the user to fuse 2 bodies together, which adds all the fixtures of one body to the other and then deletes the first body
function generateFuseShapesButton(x, y, w, h, modeNumber) {


    let buttonText = "Fuse Shapes";
    let mode = new Mode();

    mode.selectedBody1 = -1;
    mode.selectedBody2 = -1;


    mode.onActivate = function () {
        this.selectedBody1 = -1;
        this.selectedBody2 = -1;
        if (creature.bodies.length === 0) {
            warning = new Warning("What's the plan chief? There isn't anything to fuse", 200);
        }
        if (creature.bodies.length === 1) {
            warning = new Warning("Notice the S at the end of 'FUSE SHAPES' that means you're gonna need at least 2 shapes. \n It's what we call a plural.", 400);
        }
    };


    mode.everyFrame = function () {
        creature.selectBodyMouseIsOverExcluding(this.selectedBody1);
    };

    mode.onClick = function () {
        if (creature.selectedBody !== -1) {
            if (this.selectedBody1 === -1) {
                this.selectedBody1 = creature.selectedBody;
                creature.getSelectedBody().selectedAsShape1 = true;
            } else {
                this.selectedBody2 = creature.selectedBody;
                creature.fuseBodies(this.selectedBody1,this.selectedBody2);

                creature.unselectAllBodies();

                this.selectedBody1 = -1;
                this.selectedBody2 = -1;
                warning = new Warning("Selected shapes are now fused", 100, true);

            }
        }
    };
    mode.buttonPressed = function () {
        switch (keyCode) {

            case ESCAPE:

                if (this.selectedBody1 === -1) {
                    buttonManager.deactivateActiveModes();

                } else {
                    this.selectedBody1 = -1;
                    creature.unselectAllBodies();
                }

                break;


        }
    };
    mode.instructions.getMessages = function () {
        let messages = [];
        let currentMode = buttonManager.getCurrentMode();
        if (currentMode.selectedBody1 === -1) {
            messages.push("Select first shape to fuse");
            messages.push("  CLICK: select shape");
            messages.push("   ESC: cancel");
        } else {
            messages.push("Select second shape to fuse");
            messages.push("CLICK: select shape");
            messages.push("ESC: unselect first shape");
        }
        return messages;
    };



    return new ModeButton(x, y, w, h, buttonText, mode, modeNumber);
}