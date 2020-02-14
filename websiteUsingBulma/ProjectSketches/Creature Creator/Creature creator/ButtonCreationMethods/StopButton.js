//this button allows the user to stop the simulation
function generateStopButton(x, y, w, h) {
    let button =  new Button(x, y, w, h, "");
    button.show = function(){
        push();
        !this.mouseOverButton()? fill(255,241,0):fill(150,150,0);
        strokeWeight(2);
        stroke(0);
        rectMode(CORNER);
        rect(x, y, this.w, this.h);
        pop();
    };

    button.onClick = function(){
        world.reset();
    };

    return button;
}