//this class handles all the logic involving displaying and interacting with buttons and modes
class ButtonManager {
    constructor() {
        this.defaultButtons = [];
        this.advancedButtons = [];
        this.cosmeticButtons = [];
        this.learningButtons = [];
        this.activeButtons = [];


        this.instantiateDefaultButtons();
        this.instantiateAdvancesButtons();
        this.instantiateLearningButtons();
        this.instantiateCosmeticButtons();
        this.activateDefaultButtons();
        this.modeNo = -1;
    }


    instantiateDefaultButtons() {

        const buttonHeight = 40;
        const buttonWidth = 160;
        const buttonGap = 20;
        const startX = 10;
        const startY = 80;
        let buttonNo = 0;
        let modeNumber = 0;

        //LEFT FROM TOP TO BOTTOM _________________________________________________________________________________________________________________________________________________________________________________
        //Add Rectangle
        this.defaultButtons.push(generateAddRectangleButton(startX, startY + buttonNo * (buttonHeight + buttonGap), buttonWidth, buttonHeight, modeNumber));
        buttonNo++;
        modeNumber++;

        //Add Circle
        this.defaultButtons.push(generateAddCircleButton(startX, startY + buttonNo * (buttonHeight + buttonGap), buttonWidth, buttonHeight, modeNumber));
        buttonNo++;
        modeNumber++;

        //Add Polygon
        this.defaultButtons.push(generateAddPolygonButton(startX, startY + buttonNo * (buttonHeight + buttonGap), buttonWidth, buttonHeight, modeNumber));
        buttonNo++;
        modeNumber++;

        //Add Joint
        this.defaultButtons.push(generateAddJointButton(startX, startY + buttonNo * (buttonHeight + buttonGap), buttonWidth, buttonHeight, modeNumber));
        buttonNo++;
        modeNumber++;

        //Limit Joints
        this.defaultButtons.push(generateLimitJointsButton(startX, startY + buttonNo * (buttonHeight + buttonGap), buttonWidth, buttonHeight, modeNumber));
        buttonNo++;
        modeNumber++;

        //Move/Rotate
        this.defaultButtons.push(generateMoveRotateButton(startX, startY + buttonNo * (buttonHeight + buttonGap), buttonWidth, buttonHeight, modeNumber));
        buttonNo++;
        modeNumber++;

        //Resize
        this.defaultButtons.push(generateMoveResizeButton(startX, startY + buttonNo * (buttonHeight + buttonGap), buttonWidth, buttonHeight, modeNumber));
        buttonNo++;
        modeNumber++;

        //Fuse Shapes
        this.defaultButtons.push(generateFuseShapesButton(startX, startY + buttonNo * (buttonHeight + buttonGap), buttonWidth, buttonHeight, modeNumber));
        buttonNo++;
        modeNumber++;

        //Clone Shape
        this.defaultButtons.push(generateCloneShapeButton(startX, startY + buttonNo * (buttonHeight + buttonGap), buttonWidth, buttonHeight, modeNumber));
        buttonNo++;
        buttonNo++;//have the delete button at the bottom
        modeNumber++;

        //Delete
        this.defaultButtons.push(generateDeleteButton(startX, startY + buttonNo * (buttonHeight + buttonGap), buttonWidth, buttonHeight, modeNumber));
        buttonNo ++;
        modeNumber++;

        //BOTTOM RIGHT_____________________________________________________________________________________________________________________________________________________________________________________________
        //Advanced
        this.defaultButtons.push(generateAdvancedButton(canvas.width - buttonWidth - 10, startY + 8 * (buttonHeight + buttonGap), buttonWidth, buttonHeight, modeNumber));
        buttonNo++;
        modeNumber++;

        //Cosmetics
        this.defaultButtons.push(generateCosmeticsButton(canvas.width - buttonWidth - 10, startY + 9 * (buttonHeight + buttonGap), buttonWidth, buttonHeight, modeNumber));
        buttonNo++;
        modeNumber++;

        //Evolve
        this.defaultButtons.push(generateEvolveButton(canvas.width - buttonWidth - 10, startY + 10 * (buttonHeight + buttonGap), buttonWidth, buttonHeight, modeNumber));
        buttonNo++;
        modeNumber++;


        //Top RIGHT Play pause and shit______________________________________________________________________________________________________________________________________________________________________________
        //Play Pause button
        this.defaultButtons.push(generatePlayPauseButton(canvas.width - 70, 80, 25, 25));
        //Stop button
        this.defaultButtons.push(generateStopButton(canvas.width - 110, 80, 25, 25));


    }

    instantiateCosmeticButtons() {

        const buttonHeight = 40;
        const buttonWidth = 160;
        const buttonGap = 20;
        const startX = 10;
        const startY = 80;
        let buttonNo = 0;
        let modeNumber = 0;

        //LEFT FROM TOP TO BOTTOM _________________________________________________________________________________________________________________________________________________________________________________
        //Add Images to shape
        this.cosmeticButtons.push(generateAddImageToShapeButton(startX, startY + buttonNo * (buttonHeight + buttonGap), buttonWidth, buttonHeight, modeNumber));
        buttonNo++;
        modeNumber++;
        //Move Resize
        this.cosmeticButtons.push(generateMoveResizeImageButton(startX, startY + buttonNo * (buttonHeight + buttonGap), buttonWidth, buttonHeight, modeNumber));
        buttonNo++;
        modeNumber++;
        //Move Rotate
        this.cosmeticButtons.push(generateMoveRotateImageButton(startX, startY + buttonNo * (buttonHeight + buttonGap), buttonWidth, buttonHeight, modeNumber));
        buttonNo++;
        modeNumber++;

        //change fill color
        this.cosmeticButtons.push(generateChangeFillColorButton(startX, startY + buttonNo * (buttonHeight + buttonGap), buttonWidth, buttonHeight, modeNumber));
        buttonNo++;
        modeNumber++;

        //DeleteImage
        this.cosmeticButtons.push(generateDeleteImageButton(startX, startY + buttonNo * (buttonHeight + buttonGap), buttonWidth, buttonHeight, modeNumber));
        buttonNo++;
        modeNumber++;


        //BOTTOM RIGHT_____________________________________________________________________________________________________________________________________________________________________________________________
        //Construction
        this.cosmeticButtons.push(generateConstructionButton(canvas.width - buttonWidth - 10, startY + 9 * (buttonHeight + buttonGap), buttonWidth, buttonHeight, modeNumber));
        buttonNo++;
        modeNumber++;

        //Evolve
        this.cosmeticButtons.push(generateEvolveButton(canvas.width - buttonWidth - 10, startY + 10 * (buttonHeight + buttonGap), buttonWidth, buttonHeight, modeNumber));
        buttonNo++;
        modeNumber++;

        //Top RIGHT Play pause and shit______________________________________________________________________________________________________________________________________________________________________________
        //Play Pause button
        this.cosmeticButtons.push(generatePlayPauseButton(canvas.width - 50, 80, 25, 25));
        //Stop button
        this.cosmeticButtons.push(generateStopButton(canvas.width - 90, 80, 25, 25));

    }


    instantiateAdvancesButtons() {

        const buttonHeight = 40;
        const buttonWidth = 160;
        const buttonGap = 20;
        const startX = 10;
        const startY = 80;
        let buttonNo = 0;
        let modeNumber = 0;


        //LEFT FROM TOP TO BOTTOM _________________________________________________________________________________________________________________________________________________________________________________
        //Shape Collisions
        this.advancedButtons.push(generateShapeCollisionsButton(startX, startY + buttonNo * (buttonHeight + buttonGap), buttonWidth, buttonHeight, modeNumber));
        buttonNo++;
        modeNumber++;


        //Edit Shape Layers
        this.advancedButtons.push(generateEditShapeLayersButton(startX, startY + buttonNo * (buttonHeight + buttonGap), buttonWidth, buttonHeight, modeNumber));
        buttonNo++;
        modeNumber++;

        //Death Upon Floor
        this.advancedButtons.push(generateDeathUponFloorButton(startX, startY + buttonNo * (buttonHeight + buttonGap), buttonWidth, buttonHeight, modeNumber));
        buttonNo++;
        modeNumber++;


        //BOTTOM RIGHT_____________________________________________________________________________________________________________________________________________________________________________________________
        this.advancedButtons.push(generateBasicOptionsButton(canvas.width - buttonWidth - 10, startY + 8*(buttonHeight + buttonGap), buttonWidth, buttonHeight, modeNumber));
        modeNumber++;
        //Cosmetics
        this.advancedButtons.push(generateCosmeticsButton(canvas.width - buttonWidth - 10, startY + 9 * (buttonHeight + buttonGap), buttonWidth, buttonHeight, modeNumber));
        modeNumber++;
        //Evolve
        this.advancedButtons.push(generateEvolveButton(canvas.width - buttonWidth - 10, startY + 10 * (buttonHeight + buttonGap), buttonWidth, buttonHeight, modeNumber));
        modeNumber++;

        //TOP RIGHT TOGGLE BUTTONS_____________________________________________________________________________________________________________________________________________________________________________________________
        let toggleButtonWidth = 220;
        let toggleButtonHeight = 40;
        let toggleButtonGap = 10;
        let toggleButtonNo = 0;
        let toggleButtonsStartingX = canvas.width - (toggleButtonWidth + toggleButtonGap);
        let toggleButtonsStartingY = 80 + toggleButtonHeight + toggleButtonGap;

        // Show Joint Limits Toggle
        this.advancedButtons.push(generateShowJointLimitsToggleButton(toggleButtonsStartingX, toggleButtonsStartingY + toggleButtonNo * (toggleButtonHeight + toggleButtonGap), toggleButtonWidth, toggleButtonHeight));
        toggleButtonNo++;
        // Allow Body Collisions Toggle
        this.advancedButtons.push(generateAllowBodyCollisionsToggleButton(toggleButtonsStartingX, toggleButtonsStartingY + toggleButtonNo * (toggleButtonHeight + toggleButtonGap), toggleButtonWidth, toggleButtonHeight));

        //Top RIGHT Play pause and shit______________________________________________________________________________________________________________________________________________________________________________
        //Play Pause button
        this.advancedButtons.push(generatePlayPauseButton(canvas.width - 50, 80, 25, 25));
        //Stop button
        this.advancedButtons.push(generateStopButton(canvas.width - 90, 80, 25, 25));


    }

    instantiateLearningButtons() {

        const buttonHeight = 40;
        const buttonWidth = 160;
        const buttonGap = 20;
        const startX = 10;
        const startY = 80;
        let buttonNo = 0;
        let modeNumber = 0;

        //BOTTOM RIGHT_____________________________________________________________________________________________________________________________________________________________________________________________
        this.learningButtons.push(generateReplayPopularSpeciesButton(canvas.width - buttonWidth - 10, startY + 8 * (buttonHeight + buttonGap), buttonWidth, buttonHeight, this.learningButtons.length));
        modeNumber++;

        this.learningButtons.push(generateReplayEvolutionHighlightsButton(canvas.width - buttonWidth - 10, startY + 9 * (buttonHeight + buttonGap), buttonWidth, buttonHeight, this.learningButtons.length));
        modeNumber++;
        //Edit Creature
        this.learningButtons.push(generateEditCreatureButton(canvas.width - buttonWidth - 10, startY + 10 * (buttonHeight + buttonGap), buttonWidth, buttonHeight, modeNumber));



        //TOP RIGHT BUTTONS_____________________________________________________________________________________________________________________________________________________________________________________________
        //mute button
        this.learningButtons.push(generateMuteButton(canvas.width - 70, 10, 40, 40));
        let toggleButtonWidth = 220;
        let toggleButtonHeight = 30;
        let toggleButtonGap = 10;
        let toggleButtonNo = 0;
        let toggleButtonsStartingX = canvas.width - (toggleButtonWidth + toggleButtonGap);
        let toggleButtonsStartingY = 70 + 0 * (toggleButtonHeight + toggleButtonGap);


        // Replay Evolution hightlights button

        toggleButtonNo = 0;
        //Death Lazer Speed Value Button
        this.learningButtons.push(generateDeathLazerSpeedValueButton(toggleButtonsStartingX, toggleButtonsStartingY + toggleButtonNo * (toggleButtonHeight + toggleButtonGap), toggleButtonWidth - 2 * toggleButtonHeight, toggleButtonHeight));
        toggleButtonNo++;
        //Simulation speed value button
        this.learningButtons.push(generateSimulationSpeedValueButton(toggleButtonsStartingX, toggleButtonsStartingY + toggleButtonNo * (toggleButtonHeight + toggleButtonGap), toggleButtonWidth - 2 * toggleButtonHeight, toggleButtonHeight));
        toggleButtonNo++;
        //number of batches value button
        this.learningButtons.push(generateNumberOfBatchesValueButton(toggleButtonsStartingX, toggleButtonsStartingY + toggleButtonNo * (toggleButtonHeight + toggleButtonGap), toggleButtonWidth - 2 * toggleButtonHeight, toggleButtonHeight));
        toggleButtonNo++;
        //population size value button
        this.learningButtons.push(generatePopulationSizeValueButton(toggleButtonsStartingX, toggleButtonsStartingY + toggleButtonNo * (toggleButtonHeight + toggleButtonGap), toggleButtonWidth - 2 * toggleButtonHeight, toggleButtonHeight));
        toggleButtonNo++;
        // Speed up when players die Toggle
        this.learningButtons.push(generateSpeedUpWhenPlayersDieToggleButton(toggleButtonsStartingX , toggleButtonsStartingY + toggleButtonNo * (toggleButtonHeight + toggleButtonGap), toggleButtonWidth, toggleButtonHeight));
        toggleButtonNo++;
    }

    //--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //most of these are not worth explaining
    activateAdvancedButtons() {
        this.activeButtons = this.advancedButtons;
    }

    activateDefaultButtons() {
        this.activeButtons = this.defaultButtons;
    }

    activateCosmeticButtons() {
        this.activeButtons = this.cosmeticButtons;
    }

    activateLearningButtons() {
        this.activeButtons = this.learningButtons;
    }

    showActiveButtons() {
        for (let button of this.activeButtons) {
            button.show();
        }
    }

    showCurrentModeEffects() {
        if (this.modeNo !== -1) {
            this.getCurrentMode().drawEffects();
        }
    }

    updateCurrentMode() {
        if (this.modeNo !== -1) {
            this.getCurrentMode().everyFrame();
        }
    }

    onKeyPressed() {
        if (this.modeNo !== -1) {
            this.getCurrentMode().buttonPressed();
        }
    }

    onMouseWheelMove(mouseDirection) {
        if (this.modeNo !== -1) {
            this.getCurrentMode().scrollWheel(mouseDirection);
        }
    }

    //check if any buttons are clicked if not then check if the current mode needs the input
    onClick() {
        for (let button of this.activeButtons) {
            if (button.mouseOverButton()) {
                button.onClick();
                return;// if a button is clicked then leave
            }
        }


        if (this.modeNo !== -1) {
            this.getCurrentMode().onClick();
        }


    }

    getCurrentMode() {
        return this.activeButtons[this.modeNo].mode;
    }


    getCurrentModeNumber() {
        return this.modeNo;
    }

    //returns whether the modeString matches the button text of the currently active mode
    isInMode(modeString) {
        return (this.modeNo !== -1 && this.activeButtons[this.modeNo].text === modeString);
    }

    //finds allmodes which are active and deactivates them
    deactivateActiveModes() {
        for (let b of this.activeButtons) {

            if (b.mode && b.mode.isActive) {
                b.mode.deactivate();
            }
        }
        this.modeNo = -1;
        //unselect everything just in case
        creature.unselectEverything();

    }

    //returns whether we are currently in cosmetics mode
    areCosmeticsActive(){
        return this.cosmeticButtons === this.activeButtons;
    }
}



