//this button replays all the important improvements the player made over the generations
function generateReplayEvolutionHighlightsButton(x, y, w, h, modeNumber) {
    let buttonText = "Replay Highlights";
    let mode = new Mode();

    mode.onActivate = function () {
        if (population.gen === 1) {//cant replay gens which haven't happened, so deactive this bad boy
            warning = new Warning("Haven't had any generations to replay yet", 200, false);
            storeGenLifespan = genLifespan;
            storeMoveCounter = moveCounter;
            buttonManager.deactivateActiveModes();
            return;
        }
        //sets up variables and stuff
        genReplay = true;
        genPlayer = population.genPlayers[0].cloneForReplay();
        storeGenLifespan = genLifespan;
        storeMoveCounter = moveCounter;
        genLifespan = 0;
        moveCounter = 0;
        genPlayersCounter = 0;
        resetAudio();

    };

    mode.onDeactivate = function () {
        genReplay = false;
        moveCounter = storeMoveCounter;
        genLifespan = storeGenLifespan;
        genPlayersCounter = 0;

    };


    mode.everyFrame = function () {
        if (!genPlayer.dead || genPlayer.deathCounter > 0) { //if current gen player is not dead then update it
            let speedUpAmount = simulationSpeed;
            for (let m = 0; m < speedUpAmount; m++) {
                moveCounter++;
                genLifespan++;
                if (moveCounter % thinkEveryXFrames === 0) {
                    genPlayer.look();
                    genPlayer.think();
                }
                genPlayer.update();
            }


            //show the gen player
            push();
            translate(0, 2 * 376 * (1 - playerScaleAmount));
            scale(playerScaleAmount);
            genPlayer.show();
            pop();


        } else { //if dead move on to the next generation

            this.nextGenPlayer();


        }

    };
    //draw the player
    mode.drawEffects = function () {
        push();
        translate(0, 2 * 376 * (1 - playerScaleAmount));
        scale(playerScaleAmount);
        genPlayer.show();
        pop();
    };


    //go to the next player
    mode.nextGenPlayer = function () {

        genPlayersCounter++;
        if (genPlayersCounter >= population.genPlayers.length) { //if at the end then deactivate current mode
            warning = new Warning("Replay is up to date, returning to normal evolution", 200, true);
            buttonManager.deactivateActiveModes();
        } else { //if not at the end then get the next generation
            genPlayer = population.genPlayers[genPlayersCounter].cloneForReplay();
            genLifespan = 0;
            moveCounter = 0;
            panX = 0;
        }
        resetAudio();
    };

    //go to the previous player (if one exists)
    mode.previousGenPlayer = function () {
        if (genPlayersCounter === 0) {
            return;
        }
        genPlayersCounter--;
        genPlayer = population.genPlayers[genPlayersCounter].cloneForReplay();
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
                this.nextGenPlayer();
                break;
            case LEFT_ARROW:
                this.previousGenPlayer();
                break;

        }
    };
    mode.instructions.getMessages = function () {
        let messages = [];
        messages.push("Replaying Evolution Highlights");
        messages.push("  LEFT: Play previous highlight");
        messages.push("  RIGHT: Play next highlight");
        messages.push("  SPACE: play/pause");
        messages.push("   ESC: exit");
        return messages;
    };


    return new ModeButton(x, y, w, h, buttonText, mode, modeNumber);
}