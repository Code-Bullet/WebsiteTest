//this button allows the user to mute the audio because it kinda annoying
function generateMuteButton(x, y, w, h) {
    let button =  new Button(x, y, w, h, "");
    button.show = function(){
        if (muted) {
            image(mutedImage,this.x,this.y,this.w,this.h);
        } else {
            image(unmutedImage,this.x,this.y,this.w,this.h);
        }

    };

    button.onClick = function(){
        muted = !muted;
        manageSounds();
    };

    return button;
}