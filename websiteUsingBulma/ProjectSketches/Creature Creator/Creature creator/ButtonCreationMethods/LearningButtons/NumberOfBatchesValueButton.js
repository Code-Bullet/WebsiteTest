//this button allows the user to adjust the number of batches
function generateNumberOfBatchesValueButton(x, y, w, h) {
    let valueButton = new ValueButton(x, y, w, h, "Number of Batches");
    valueButton.getValue = () =>  population.numberOfBatches;
    valueButton.increaseValue = () => {

        population.setNumberOfBatches(population.numberOfBatches+1);
        population.resetGeneration();
        resetAudio();
        warning = new Warning(`Number of Batches: ${population.numberOfBatches}, Players Per Batch: ${population.playersPerBatch}`, 100, true);
    };
    valueButton.decreaseValue = () =>{
        if(population.numberOfBatches===1){
            return;
        }

        population.setNumberOfBatches( population.numberOfBatches -1);
        population.resetGeneration();
        resetAudio();
        warning = new Warning(`Number of Batches: ${population.numberOfBatches}, Players Per Batch: ${population.playersPerBatch}`, 100, true);
    };
    return valueButton;
}