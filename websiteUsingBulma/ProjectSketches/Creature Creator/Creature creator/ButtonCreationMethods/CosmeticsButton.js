
//this button activated the cosmetic buttons
function generateCosmeticsButton(x, y, w, h, modeNumber) {

    let buttonText = "Cosmetics";
    let mode = new Mode();

    mode.onActivate = function () {

        if (creature.bodies.length === 0) {
            warning = new Warning("Ur gonna need to add some shapes and shit before you make it pretty", 250);
            this.deactivate();
            return;
        }

        buttonManager.deactivateActiveModes();
        buttonManager.activateCosmeticButtons();
        if(creature.bodies.length>0){
            creature.selectedBodyToEditCosmetically = 0;
            creature.bodies[creature.selectedBodyToEditCosmetically].selectedAsShape1 = true;
        }

    };


    return new ModeButton(x, y, w, h, buttonText, mode, modeNumber);
}