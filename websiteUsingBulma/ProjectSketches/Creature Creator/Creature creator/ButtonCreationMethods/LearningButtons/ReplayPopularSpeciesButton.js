//this button allows the user to replay popular species
function generateReplayPopularSpeciesButton(x, y, w, h, modeNumber) {
    let buttonText = "Replay Species";
    let mode = new Mode();
    mode.onActivate = function () {
        if (population.gen === 1 || population.bestOfEachSpecies === [] || !population.bestOfPopularSpeciesSorted || population.bestOfPopularSpeciesSorted ===[]) {
            warning = new Warning("You need to wait for a few generations before popular species emerge", 200, false);
            storeGenLifespan = genLifespan;
            storeMoveCounter = moveCounter;
            buttonManager.deactivateActiveModes();
            return;
        }

        speciesReplay = true;
        speciesPlayer = population.bestOfPopularSpeciesSorted[0].champ.cloneForReplay();
        storeGenLifespan = genLifespan;
        storeMoveCounter = moveCounter;
        genLifespan = 0;
        moveCounter = 0;
        speciesPlayersCounter = 0;
        resetAudio();

    };

    mode.onDeactivate = function () {
        speciesReplay = false;
        moveCounter = storeMoveCounter;
        genLifespan = storeGenLifespan;
        speciesPlayersCounter = 0;
        speciesPlayer = null;
    };


    mode.everyFrame = function () {
        if (!speciesPlayer.dead || speciesPlayer.deathCounter > 0) { //if current gen player is not dead then update it
            let speedUpAmount = simulationSpeed;
            for (let m = 0; m < speedUpAmount; m++) {
                moveCounter++;
                genLifespan++;
                if (moveCounter % thinkEveryXFrames === 0) {
                    speciesPlayer.look();
                    speciesPlayer.think();
                }
                speciesPlayer.update();
            }


            //show the gen player
            push();
            translate(0, 2 * 376 * (1 - playerScaleAmount));
            scale(playerScaleAmount);
            speciesPlayer.show();
            pop();


        } else { //if dead move on to the next generation

            this.nextSpeciesPlayer();


        }

    };

    //draw the player
    mode.drawEffects = function () {
        push();
        translate(0, 2 * 376 * (1 - playerScaleAmount));
        scale(playerScaleAmount);
        speciesPlayer.show();
        pop();
    };

    //play next species
    mode.nextSpeciesPlayer = function () {

        speciesPlayersCounter++;
        if (speciesPlayersCounter >= population.bestOfPopularSpeciesSorted.length) { //if at the end then deactivate current mode
            warning = new Warning("Replay is up to date, returning to normal evolution", 200, true);
            buttonManager.deactivateActiveModes();
        } else { //if not at the end then get the next generation
            speciesPlayer = population.bestOfPopularSpeciesSorted[speciesPlayersCounter].champ.cloneForReplay();
            genLifespan = 0;
            moveCounter = 0;
            panX = 0;
        }
        resetAudio();
    };

    //play previous species
    mode.previousSpeciesPlayer = function () {
        if (speciesPlayersCounter === 0) {
            return;
        }
        speciesPlayersCounter--;
        speciesPlayer = population.bestOfPopularSpeciesSorted[speciesPlayersCounter].champ.cloneForReplay();
        genLifespan = 0;
        moveCounter = 0;
        panX = 0;
        resetAudio();
    };


    mode.buttonPressed = function () {
        switch (keyCode) {
            case ESCAPE:
                buttonManager.deactivateActiveModes();
                break;

            case RIGHT_ARROW:
                this.nextSpeciesPlayer();
                break;
            case LEFT_ARROW:
                this.previousSpeciesPlayer();
                break;

        }
    };
    mode.instructions.getMessages = function () {
        let messages = [];
        messages.push("Replaying Popular Species");
        messages.push("  LEFT: Play previous species");
        messages.push("  RIGHT: Play next species");
        messages.push("  SPACE: play/pause");
        messages.push("   ESC: exit");
        return messages;
    };


    return new ModeButton(x, y, w, h, buttonText, mode, modeNumber);
}