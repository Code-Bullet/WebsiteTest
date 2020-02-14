//this button allows the user to play/pause the simulation
function generatePlayPauseButton(x, y, w, h) {
    let button =  new Button(x, y, w, h, "");
    button.show = function(){
        push();
        !this.mouseOverButton()? fill(255,241,0):fill(150,150,0);
        strokeWeight(2);
        stroke(0);
        rectMode(CORNER);

        if (world.paused) {
            beginShape();
            vertex(this.x, this.y);
            vertex(this.x, this.y + this.h);
            vertex(this.x + this.w, this.y + this.w / 2.0);
            endShape(CLOSE);

        } else {
            rect(this.x, this.y, 2 * this.w / 5, this.h);
            rect(this.x + 3 * this.w / 5, y, 2 * this.w / 5, this.h);

        }
        pop();
    };

    button.onClick = function(){
        world.togglePause();
    };

    return button;
}