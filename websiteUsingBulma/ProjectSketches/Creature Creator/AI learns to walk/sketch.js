//------------------------------------------GLOBALS


let showMode = 3; // 0: show all, 1:show previous best, 2: show best of each species, 3:show 20% of the population
let genLifespan = 0; //how long the current generation have lived, used for the lazer position
let deathLazerSpeed = 8;


//some storage to keep track of the lazer position when switching modes (i.e. gen replay and species replay)
let storeGenLifespan = 0;
let storeMoveCounter = 0;

//Evolution highlights replay stuff
let genReplay = false;
let genPlayer;
let genPlayersCounter = 0;

//Popular species replay stuff
let speciesReplay = false;
let speciesPlayer;
let speciesPlayersCounter = 0;


let thinkEveryXFrames = 5;//in order to smooth the players movement the player will only change their current movement decisions every X frames
let moveCounter = 0; //since the players only think every (thinkEveryXframes) a counter must be held to keep track of how many frames the players have gone without thinking


var showNothing = false;
let autoSpeedUp = false;
let showDeath = true;

let playerScaleAmount = 0.8;//scale down the players by this amount, this is only a visual change
let nextConnectionNo = 1000;//used by the neat algorithm to give each connection gene a unique number

let population;
let populationSize = 200;
let numberOfBatches = 1;

let simulationSpeed = 1;
let paused = false;

let muted = false;
let isCreatureScreaming = false;

//called whenever the program enters the learning mode
function AILearnsToWalkSetup() {

    setDefaultInstructions();

    buttonManager.activateLearningButtons();

    genLifespan = 0;
    moveCounter = 0;

    population = new Population(populationSize);
}

//called every frame when in AI learns to draw mode
function AILearnsToWalkDraw() {
    if (!paused) {


        autoPan();


        drawBackground();
        drawToScreen();

        showWarning();

        if (!paused && !genReplay && !speciesReplay) {
            if (!population.done()) { //if any players are alive then update them\
                let speedUpAmount = simulationSpeed;
                if (autoSpeedUp) {//speeds the simulation speed based on howmany players are alive, since less players, less box2d simulations, less processing required
                    let alive = population.getNumberOfPlayersAliveInBatch();
                    speedUpAmount *= floor(population.playersPerBatch / alive);
                }

                let startingBatchNo = population.batchNo;
                for (var m = 0; m < speedUpAmount; m++) {
                    moveCounter++;
                    genLifespan++;
                    if (moveCounter % thinkEveryXFrames === 0) {
                        population.updateAliveInBatches();
                    } else {
                        population.updateAliveWithoutThinkingInBatches();
                    }
                    if (startingBatchNo != population.batchNo)//if the batch has ended then stop updating
                        break;
                }
                population.showPlayersInBatch();

            } else { //all dead
                //genetic algorithm
                population.naturalSelection();
                genLifespan = 0;
                moveCounter = 0;
                panX = 0;
                resetAudio();

            }
        }

        if (!paused) {

            buttonManager.updateCurrentMode();
        }


        if (!showNothing || genReplay || speciesReplay) {
            drawLazer();
        }
        showInstructions();
        buttonManager.showActiveButtons();
    } else if (warning && (!warning.isFinished() || warningFade > 0)) {
        drawWhilePaused();
    } else {
        buttonManager.showActiveButtons();
    }
    manageSounds();

}

//when the simulator is paused not only the visuals need to be redrawn, so no updating the players or box2d math, just drawing shit to look pretty
function drawWhilePaused() {

    drawBackground();
    drawToScreen();
    showWarning();

    if (!genReplay && !speciesReplay) {
        population.showPlayersInBatch();
    }
    buttonManager.showCurrentModeEffects();

    if (!showNothing || genReplay || speciesReplay) {
        drawLazer();
    }
    showInstructions();
    buttonManager.showActiveButtons();

    manageSounds();


}

//stores the point the camera is panned to
//it actually is the offset for the players , so if a player is at 100,10 and we have pan X set to -100 then the player will be displayed at 0,10

let panX = 0;
let panY = 0;//never used (yet)

//pans to the leading player
function autoPan() {

    //get the player  to pan to depending on the mode
    let playerToPanTo;
    if (speciesReplay)
        playerToPanTo = speciesPlayer;
    else if (genReplay)
        playerToPanTo = genPlayer;
    else if (!showNothing)
        playerToPanTo = population.getCurrentBestPlayerInBatch();
    else
        return;//if show nothing

    //if the player to pan to is too far right then pan right
    while (worldCoordsToPixelCoords(playerToPanTo.getCenterOfMass().x, 0).x * playerScaleAmount > canvas.width * 0.65) {
        panX -= 1;
    }

    //if the player to pan to is too far left then pan left
    while (worldCoordsToPixelCoords(playerToPanTo.getCenterOfMass().x, 0).x * playerScaleAmount < canvas.width * 0.25) {
        panX += 1;
    }

}

//stores the random values used to simulate the sparks of the lazer, this is used when the simulator is paused so the sparks can be in the same position
let randomValues = [];

//draws the lazer
function drawLazer() {

    if (!paused)
        randomValues = [];


    //get the position of the lazer
    let pos = worldCoordsToPixelCoords(-10 + deathLazerSpeed * genLifespan / 100.0, 0);
    pos.mult(playerScaleAmount);

    //draw lines making the lazer
    push();
    stroke(255, 0, 0);
    strokeWeight(11);
    line(pos.x, 0, pos.x, canvas.height - 105);
    stroke(255, 100, 100);
    strokeWeight(5);
    line(pos.x, 0, pos.x, canvas.height - 102);
    stroke(255, 200, 200);
    strokeWeight(1);
    line(pos.x, 0, pos.x, canvas.height - 102);

    //draw some images to sell the power of the lazer
    image(lazerBurnGroundImage, pos.x - lazerBurnGroundImage.width + 4, canvas.height - 121);

    //draw spark lines
    let randomValueCounter = 0;
    for (let i = 0; i < 20; i++) {

        i < 10 ? strokeWeight(2) : strokeWeight(1);//have first 10 draw be thicker than the second half

        //if the lazer is paused then use the previously used random numbers, randomise it
        let rand1 = paused ? randomValues[randomValueCounter++] : random(200, 255);
        let rand2 = paused ? randomValues[randomValueCounter++] : random(0, 100);

        //random color
        stroke(rand1, rand2, 0);


        //random line length and direction
        let rand3 = paused ? randomValues[randomValueCounter++] : random(-30, 30);
        let rand4 = paused ? randomValues[randomValueCounter++] : random(30);

        line(pos.x, canvas.height - 100, pos.x + rand3, canvas.height - 100 - rand4);

        //add these new values to storage array if the game is paused
        if (!paused) {
            randomValues.push(rand1, rand2, rand3, rand4);
        }
    }
}


//called whenever a key is pressed when the ais are training
function AILearnsToWalkKeyPressed() {
    switch (keyCode) {
        case TAB://changes the show mode
            showMode = (showMode + 1) % 5;
            showNothing = showMode === 4;
            break;
    }
    switch (key) {
        case ' '://toggles pause
            paused = !paused;
            manageSounds();
            break;

    }

    //see if any of the current modes need the input
    buttonManager.onKeyPressed();

    //if the simulator is paused then things might have changed so redraw everything
    if (paused)
        drawWhilePaused();
}

//a useless function implemented incase I wanted the arrow keys to control something and you needed to hold them down.
//i dont know why i wrote this comment instead of just deleting the function but im a code hoarder
let up = false;
let down = false;
let right = false;
let left = false;

function AILearnsToWalkKeyReleased() {
    switch (keyCode) {
        case RIGHT_ARROW:
            right = false;
            break;
        case LEFT_ARROW:
            left = false;
            break;
        case UP_ARROW:
            up = false;
            break;
        case DOWN_ARROW:
            down = false;
            break;
    }
}


function AILearnsToWalkMousePressed() {
    dragging = true;
    buttonManager.onClick();
    if (paused)
        drawWhilePaused();

}


//handles most of the sounds played by the simulator
//handles when and howmany screams to play
//handles the lazer sound
//doesn't handle the player death sound (that it handled by each indavidual player)
let previousShowingCount = 0;//counts the number of players shown on the screen in the previous scene. this determines the number of sounds we need to stop

function manageSounds() {
    //manage lazer sound

    if (!paused && !muted && !lazerSoundEffect.isPlaying()) {
        lazerSoundEffect.play();

    }
    if ((paused || muted) && lazerSoundEffect.isPlaying()) {
        lazerSoundEffect.pause();

    }


    //manage screams

    if (isCreatureScreaming) {
        let maxNumberOfSounds = screamSounds.length;

        masterVolume(1);
        //if the previous count is not the same as the current showing count then we might need to add or remove audio
        if (population.showingCount !== previousShowingCount || paused || muted || genReplay || speciesReplay) {
            //since all showing counts greater than 10 are considered as playing 10 sounds then we dont need to change them
            if (!genReplay && !speciesReplay && !paused && !muted && previousShowingCount >= 10 && population.showingCount >= maxNumberOfSounds) {
                previousShowingCount = population.showingCount;
                return;
            }

            let numberOfSoundsCurrentlyPlaying = constrain(previousShowingCount, 0, maxNumberOfSounds);
            let numberOfSoundsNeedToPlay = constrain(population.showingCount, 0, maxNumberOfSounds);
            if (genReplay || speciesReplay) {
                numberOfSoundsNeedToPlay = 1;
            }

            if (paused || muted) {
                masterVolume(0);
                numberOfSoundsNeedToPlay = 0;
                for (let sound of screamSounds) {
                    if (sound.isPlaying()) {
                        sound.setVolume(0.2);
                        sound.setLoop(true);
                        sound.playMode('restart');
                        sound.pause();
                    }
                }
                previousShowingCount = 0;
                return;
            }


            if (numberOfSoundsCurrentlyPlaying > numberOfSoundsNeedToPlay) {
                //remove sounds;
                for (let i = numberOfSoundsCurrentlyPlaying; i > numberOfSoundsNeedToPlay; i--) {
                    screamSounds[i - 1].setVolume(0.2);
                    screamSounds[i - 1].setLoop(true);
                    screamSounds[i - 1].playMode('restart');
                    screamSounds[i - 1].pause();
                }
            }
            if (numberOfSoundsCurrentlyPlaying < numberOfSoundsNeedToPlay) {
                //add sounds;
                for (let i = numberOfSoundsCurrentlyPlaying + 1; i <= numberOfSoundsNeedToPlay; i++) {
                    //jump the audio to a random point then play it
                    screamSounds[i - 1].setVolume(0.2);
                    screamSounds[i - 1].setLoop(true);
                    screamSounds[i - 1].playMode('restart');
                    screamSounds[i - 1].rate(1 + (Math.random() - 1) * 0.1);
                    screamSounds[i - 1].play();
                    screamSounds[i - 1].playMode('restart');

                }
            }
        }

        previousShowingCount = population.showingCount;
        if (genReplay || speciesReplay) {
            previousShowingCount = 1;
        }

        if (paused || muted) {
            previousShowingCount = 0;
        }

    }

}

//resets all audio tracks to the begining and stops them, used when a generation or batch is finished
function resetAudio() {

    for (let sound of screamSounds) {
        sound.setVolume(0.2);
        sound.setLoop(true);
        sound.playMode('restart');
        sound.stop();
    }

    previousShowingCount = 0;
    lazerSoundEffect.playMode('restart');
    lazerSoundEffect.stop();

}

//converts world coordinates(in box2ds meters) to pixel coordinates
function worldCoordsToPixelCoords(x, y) {
    x *= SCALE;
    y *= SCALE;
    x += panX;
    y += panY;
    return createVector(x, y);
}



//---------------------------------------------------------------------------------------------------------------------------------------------------------
//draws the display screen
function drawToScreen() {

    drawBrain();
    writeInfo();

}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//show the brain of whatever genome is currently showing
function drawBrain() {
    var startX = canvas.width / 2 - 225;
    var startY = 70;
    var w = 450;
    var h = 160;
    if (genReplay) {
        genPlayer.brain.drawGenome(startX, startY, w, h);
    } else if (speciesReplay) {
        speciesPlayer.brain.drawGenome(startX, startY, w, h);
    } else {
        population.players[0].brain.drawGenome(startX, startY, w, h);
    }
}


//writes info about the current player
function writeInfo() {

    push();
    textAlign(LEFT);
    textSize(20);
    fill(0,100);
    noStroke();
    strokeWeight(1);

    let startingY = 100;
    let gap = 30;
    let startingX = 20;


    //if replaying generation/evolution highlights the show the score of the current player and the generation it belongs to
    if (genReplay) {

        text("Generation: " + genPlayer.gen, startingX, startingY);
        text("Score: " + genPlayer.score.toFixed(2), startingX, startingY + gap);

    //if replaying popular species then show the species number and the current score
    } else if (speciesReplay) {

        text(`Species: ${speciesPlayersCounter+1}/${population.bestOfPopularSpeciesSorted.length}`, startingX, startingY);
        text("Score: " + speciesPlayer.score.toFixed(2), startingX, startingY + gap);


    } else {
        //show gen number
        text("Generation: " + population.gen, startingX, startingY);

        //get the current and previous best score and line them up so the decimal point is in the same place
        let currentBestScoreText = "" + population.getCurrentBestPlayerInBatch().score.toFixed(2);
        let previousBestScoreText = "" + population.bestScoreOfAPreviousBatch.toFixed(2);

        while (currentBestScoreText.length < previousBestScoreText.length) {
            currentBestScoreText = " " + currentBestScoreText;
        }
        while (previousBestScoreText.length < currentBestScoreText.length) {
            previousBestScoreText = " " + previousBestScoreText;
        }

        //if batches are a thing then show which batch we're on
        if (population.numberOfBatches > 1) {
            text(`Batch Number: ${population.batchNo + 1}/${population.numberOfBatches}`, startingX, startingY + gap);
            text("Current Best Score : " + currentBestScoreText, startingX, startingY + gap * 2);
            text("Previous Best Score: " + previousBestScoreText, startingX, startingY + gap * 3);
            startingY = startingY + gap * 4;
        } else {
            text("Current Best Score : " + currentBestScoreText, startingX, startingY + gap * 1);
            text("Previous Best Score: " + previousBestScoreText, startingX, startingY + gap * 2);
            startingY = startingY + gap * 3;
        }


        // show the showing mode
        switch (showMode) {
            case 0:
                text("Showing: All", startingX, startingY);
                break;
            case 1:
                text("Showing: Best of previous generation", startingX, startingY);
                break;
            case 2:
                text("Showing: Best of each species", startingX, startingY);
                break;
            case 3:
                text("Showing: 20% of players", startingX, startingY);
                break;
            case 4:
                text("Showing: Nothing (max performance)", startingX, startingY);
                break;

        }
    }



    // //display frame rate in the bottom left
    // fill(255,255,0,200);
    // noStroke(0);
    // if(frameCount%10===0){
    //     previousFrameRate = frameRate();
    // }
    // text("FPS: " + round(previousFrameRate),20,canvas.height-30);
    //
    // pop();


}

let previousFrameRate = 60;

//// TODO:
/*
- idea for new video is to have the brain just be a series of moves like the WHG AI, this ai could navigate much more difficult terrain and even play games like
mario or something
- another video idea is having players which evolve their bodies as well as their brains





*/
