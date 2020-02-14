//a class designed to have its getMessages function overwritten so it displays different messages depending on what mode its in
class Instruction {

    getMessages() {
        return []
    }


    //writes the defaultInstructions to the screen.
    show() {

        let messages = this.getMessages();
        if (messages.length === 0) {
            return;
        }

        //full message is the everything except for the heading
        let fullMessage = "";
        for (var i = 1; i < messages.length; i++) {
            fullMessage += messages[i] + "\t\t\t";
        }


        push();
        //show Heading
        textAlign(CENTER, CENTER);

        fill(255,255,0);
        stroke(255,255,0);
        strokeWeight(1);
        textSize(20);
        noStroke();


        textSize(25);
        text(messages[0], canvas.width / 2, 15);



        //show defaultInstructions
        textFont(smallFont);

        textSize(15);
        noStroke();
        text(fullMessage, canvas.width / 2+25, 45);
        pop();
    }
}
//sets the default defaultInstructions when the player is not in a mode, for when they just chillin
function setDefaultInstructions() {
    defaultInstructions = new Instruction();
    if(inCreatureCreatorMode) {
        defaultInstructions.getMessages = function () {
            let messages = [];
            messages.push("Creature Creator");
            messages.push("SPACE: play/pause simulation");
            if (!world.isReset) {
                messages.push("CLICK AND DRAG: move shapes");
                messages.push("R: reset/stop simulation");
            }
            return messages;
        }
    }else{
        defaultInstructions.getMessages = function () {
            let messages = [];
            messages.push("Training your creature");
            messages.push("TAB: change view mode");
            messages.push("SPACE: play/pause");


            return messages;
        }
    }
}

//show the bar and the defaultInstructions at the top of the screen
function showInstructions() {

    //draw black bar at top of screen
    push();
    strokeWeight(2);
    stroke(0, 0, 0);
    fill(0,50);
    image(topImage, 0,0,canvas.width,60);
    rect(1, 1, canvas.width-2, 60);
    pop();

    //write the default Instructions to the screen if not in a mode
    if (buttonManager.modeNo === -1) {
        defaultInstructions.show();
    } else {//otherwise show the modes instructions
        buttonManager.getCurrentMode().instructions.show();
    }

}
