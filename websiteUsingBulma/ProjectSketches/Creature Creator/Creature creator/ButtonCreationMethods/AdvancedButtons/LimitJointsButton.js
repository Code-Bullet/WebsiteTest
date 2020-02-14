//this button allows the user to set limits for all the joints to prevent all creatures from becoming cars
function generateLimitJointsButton(x, y, w, h, modeNumber){

    let buttonText = "Limit Joints";

    let mode = new Mode();
    mode.selectedJoint = -1;
    mode.onActivate = function () {
        if (creature.joints.length === 0) {
            warning = new Warning("Limiting joints requires joints so add joints", 250);
        }

    };

    //either select a joint if one isnt already selected or select a joint limit or move a limit
    mode.everyFrame = function () {

        if (this.selectedJoint === -1) {
            creature.selectJointMouseIsOver();
        } else {
            if (!dragging) {
                this.selectJointLimitMouseIsOver();

            } else {

                creature.getSelectedJoint().moveSelectedLimitToMousePosition();
            }
        }
    };
    //selects the limit which is closes to the mouse, also "fake" selects another joint
    mode.selectJointLimitMouseIsOver = function () {
        for (let j of creature.joints) {
            j.lookLikeSelected = false;
        }
        creature.joints[this.selectedJoint].selectLimitClosestToMousePosition();
    };

    //unselect everything
    mode.onDeactivate = function () {
        if (this.selectedJoint !== -1) {
            creature.joints[this.selectedJoint].body2.selected = false;
            creature.joints[this.selectedJoint].selectedLimit = -1;
        }
        this.selectedJoint = -1;
        creature.unselectAllJoints();
        for (let j of creature.joints) {
            j.lookLikeSelected = false;
        }

    };


    mode.onClick = function () {

        if (this.selectedJoint === -1) {


            if (creature.selectedJoint !== -1) {
                this.selectedJoint = creature.selectedJoint;
                creature.getSelectedJoint().enableLimits(true);
                creature.getSelectedJoint().body2.selected = true;
                dragging = false;

            }


        } else {


            //if another joint is clicked on then select it instead.


            let minIndex = -1;
            let min = 100000;


            for (var i = 0; i < creature.joints.length; i++) {
                let pos = creature.joints[i].getPixelCenter();
                let distance = dist(mouseX, mouseY, pos.x, pos.y);
                if (distance < min && distance < 8) {
                    min = distance;
                    minIndex = i;
                }
            }


            if (minIndex !== -1 && minIndex !== this.selectedJoint) {

                //unselect the current joint
                //just copied from enter
                creature.joints[this.selectedJoint].body2.selected = false;
                creature.joints[this.selectedJoint].selectedLimit = -1;
                this.selectedJoint = -1;
                creature.unselectAllJoints();

                //select the joint the mouse is over
                creature.selectedJoint = minIndex;
                this.selectedJoint = creature.selectedJoint;
                creature.getSelectedJoint().enableLimits(true);
                creature.getSelectedJoint().body2.selected = true;
                dragging = false;

            }


        }
    };
    mode.buttonPressed = function () {
        switch (keyCode) {

            case ESCAPE://exits
            case ENTER:
                if (this.selectedJoint === -1) {
                    buttonManager.deactivateActiveModes();
                } else {
                    creature.joints[this.selectedJoint].body2.selected = false;
                    creature.joints[this.selectedJoint].selectedLimit = -1;
                    this.selectedJoint = -1;
                    creature.unselectAllJoints();
                }
                break;
            case TAB://changes focus shape
                if (this.selectedJoint != -1) {
                    creature.joints[this.selectedJoint].switchBodies();
                    creature.joints[this.selectedJoint].body1.selected = false;
                    creature.joints[this.selectedJoint].body2.selected = true;
                }
                break;
        }
        switch (key) {
            case 'D'://removes joint limits
                if (this.selectedJoint !== -1) {
                    creature.getSelectedJoint().enableLimits(false);
                    creature.joints[this.selectedJoint].selectedLimit = -1;
                    this.selectedJoint = -1;
                    creature.unselectAllJoints();
                    warning = new Warning("Selected joint's limits are disabled", 100, true);
                }
                break;

        }
    };

    mode.instructions.getMessages = function () {
        let messages = [];

        if (buttonManager.getCurrentMode().selectedJoint === -1) {
            messages.push("Select Joint to edit limits");
            messages.push("CLICK: select joint");
            messages.push("ESC: exit ");
        } else {
            messages.push("Edit Joint Limits");
            messages.push("CLICK AND DRAG: move highlighted limit");
            messages.push("D: disable limits for this joint");
            messages.push("TAB: change focused shape");
            messages.push("ESC/ENTER: unselect joint")
        }
        return messages;
    };

    return new ModeButton(x, y, w, h, buttonText, mode, modeNumber);
}
