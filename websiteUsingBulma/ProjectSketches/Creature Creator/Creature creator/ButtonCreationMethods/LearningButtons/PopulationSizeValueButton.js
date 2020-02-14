//this button allows the user to adjust the number of players in the popyulation
function generatePopulationSizeValueButton(x, y, w, h) {
    let valueButton = new ValueButton(x, y, w, h, "Population Size");
    valueButton.getValue = () => populationSize;
    valueButton.increaseValue = () => {
        populationSize += 20;
        warning = new Warning("Population size will be updated at the start of the next generation", 300, true);


    };
    valueButton.decreaseValue = () => {
        if(populationSize ===20)
            return;
        populationSize = max(20, populationSize - 20);
        warning = new Warning("Population size will be updated at the start of the next generation", 300, true);


    };
    return valueButton;
}