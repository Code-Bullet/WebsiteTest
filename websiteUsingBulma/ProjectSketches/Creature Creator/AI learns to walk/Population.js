//this class handles the logic used to run and evolve the players using the NEAT algorithm
class Population {

    constructor(size) {
        this.players = [];
        this.bestPlayer; //the best ever player
        this.bestScore = 0; //the score of the best ever player
        this.globalBestScore = 0;
        this.gen = 1;
        this.species = [];
        this.massExtinctionEvent = false;

        this.innovationHistory = [];//a list of all innovations made throughout the evolution, its needed for NEAT
        this.champPositions = [];//the positions of the species champs in the players array

        this.numberOfBatches = numberOfBatches;

        this.playersPerBatch = Math.ceil(size / this.numberOfBatches);
        this.batchNo = 0;

        this.bestScoreOfAPreviousBatch = 0;

        this.bestOfEachSpecies = [];//stores the best players of each species so they can be replayed
        this.genPlayers = [];//stores the best players of each generation so they can be replayed

        //populate the players array
        for (let i = 0; i < size; i++) {
            this.players.push(new Player());
            this.players[this.players.length - 1].brain.fullyConnect(this.innovationHistory);
            this.players[this.players.length - 1].brain.mutate(this.innovationHistory);
            this.players[this.players.length - 1].brain.generateNetwork();
        }


        this.showingCount = 0;// the number of players currently showing on the screen
        speciesNumber = 0;

    }


    //------------------------------------------------------------------------------------------------------------------------------------------
    //returns true if all the players are dead, plays a warning if the batch/generation timed out
    done() {
        let lowestTTL = 1000000;
        for (let player of this.players) {
            lowestTTL = Math.min(lowestTTL, player.stepsToLive);
            if (!player.dead)
                return false;
        }

        if (lowestTTL <= 0) {

            if (this.numberOfBatches > 1) {
                warning = new Warning("Batch Timed out", 200, true);
            } else {
                warning = new Warning("Generation Timed out", 200, true);
            }
        }

        return true;
    }


    //------------------------------------------------------------------------------------------------------------------------------------------
    //sets the best player globally and for thisthis.gen
    setBestPlayer() {
        let tempBest = this.species[0].players[0];
        tempBest.gen = this.gen;


        //if best thisthis.gen is better than the global best score then set the global best as the best thisthis.gen

        if (tempBest.score > this.bestScore) {
            this.genPlayers.push(tempBest.cloneForReplay());
            console.log("old best: " + this.bestScore);
            console.log("new best: " + tempBest.score);
            this.bestScore = tempBest.score;
            this.bestPlayer = tempBest.cloneForReplay();
        }
    }

    //------------------------------------------------------------------------------------------------------------------------------------------------
    //this function is called when all the players in the this.players are dead and a newthis.generation needs to be made
    naturalSelection() {

        this.batchNo = 0;

        let previousPopulationSize = this.players.length;
        let previousBest = this.players[0];
        this.bestScoreOfAPreviousBatch = this.globalBestScore;
        this.speciate(); //seperate the this.players varo this.species
        this.calculateFitness(); //calculate the fitness of each player
        this.sortSpecies(); //sort the this.species to be ranked in fitness order, best first
        if (this.massExtinctionEvent) {
            this.massExtinction();
            this.massExtinctionEvent = false;
        }
        this.cullSpecies(); //kill off the bottom half of each this.species
        this.setBestPlayer(); //save the best player of thisthis.gen
        this.killStaleSpecies(); //remove this.species which haven't improved in the last 15(ish)this.generations
        this.killBadSpecies(); //kill this.species which are so bad that they cant reproduce


        console.log("generation  " + this.gen + "  Number of mutations  " + this.innovationHistory.length + "  species:   " + this.species.length + "  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");


        let averageSum = this.getAvgFitnessSum();
        let children = [];
        this.champPositions = [];

        for (let j = 0; j < this.species.length; j++) { //for each this.species
            children.push(this.species[j].champ.clone()); //add champion without any mutation
            this.champPositions.push(children.length - 1);
            let NoOfChildren = floor(this.species[j].averageFitness / averageSum * populationSize) - 1; //the number of children this species is allowed, note -1 is because the champ is already added
            for (let i = 0; i < NoOfChildren; i++) { //get the calculated amount of children from this this.species
                children.push(this.species[j].giveMeBaby(this.innovationHistory));
            }
        }

        if (children.length < populationSize) {
            children.push(previousBest.clone());
        }

        while (children.length < populationSize) { //if not enough babies (due to flooring the number of children to get a whole var)
            children.push(this.species[0].giveMeBaby(this.innovationHistory)); //get babies from the best this.species
        }

        this.players = [];
        arrayCopy(children, this.players); //set the children as the current this.playersulation
        this.gen += 1;
        for (let i = 0; i < this.players.length; i++) { //generate networks for each of the children
            this.players[i].brain.generateNetwork();
        }

        //set number of players per batch
        this.playersPerBatch = Math.ceil(this.players.length / this.numberOfBatches);

        //if the numbers of players changed inform the user
        if (this.players.length !== previousPopulationSize) {
            if (this.numberOfBatches > 1)
                warning = new Warning(`Population Size updated to ${this.players.length}, Players Per Batch: ${this.playersPerBatch}`, 200, true);
            else
                warning = new Warning(`Population Size updated to ${this.players.length}`, 200, true);
        }
    }

    //------------------------------------------------------------------------------------------------------------------------------------------
    //seperate players into species based on how similar they are to the leaders of each species in the previous gen
    speciate() {
        for (let s of this.species) { //empty this.species
            s.players = [];
        }
        for (let i = 0; i < this.players.length; i++) { //for each player
            let speciesFound = false;
            for (let s of this.species) { //for each species
                if (s.sameSpecies(this.players[i].brain)) { //if the player is similar enough to be considered in the same species
                    s.addToSpecies(this.players[i]); //add it to the species
                    speciesFound = true;
                    break;
                }
            }
            if (!speciesFound) { //if no species was similar enough then add a new this.species with this as its champion
                this.species.push(new Species(this.players[i]));
                this.bestOfEachSpecies.push({champ: this.players[i].cloneForReplay(), maxPlayerLength: 1});
                print("new Species");
            }
        }
        for (let s of this.species) {
            this.bestOfEachSpecies[s.speciesNumber] = {
                champ: s.champ.cloneForReplay(),
                maxPlayerLength: Math.max(this.bestOfEachSpecies[s.speciesNumber].maxPlayerLength, s.players.length)
            };
        }


        this.bestOfEachSpeciesSorted = [...this.bestOfEachSpecies];
        this.bestOfEachSpeciesSorted.sort((a, b) => a.champ.bestScore - b.champ.bestScore);
        this.bestOfPopularSpeciesSorted = this.bestOfEachSpeciesSorted.filter((a) => a.maxPlayerLength >= 2);


        let minAllowedPlayerLength = 3;
        while (this.bestOfPopularSpeciesSorted.length > 30) {

            for (let i = 0; i < this.bestOfPopularSpeciesSorted.length - 5; i++) {
                if (this.bestOfPopularSpeciesSorted[i].maxPlayerLength < minAllowedPlayerLength && this.bestOfPopularSpeciesSorted.length > 30) {
                    this.bestOfPopularSpeciesSorted.splice(i, 1);
                    i--;
                }
            }

            minAllowedPlayerLength++;
        }


    }

    //------------------------------------------------------------------------------------------------------------------------------------------
    //calculates the fitness of all of the players
    calculateFitness() {
        for (let i = 1; i < this.players.length; i++) {
            this.players[i].calculateFitness();
        }
    }

    //------------------------------------------------------------------------------------------------------------------------------------------
    //sorts the players within a this.species and the this.species by their fitnesses
    sortSpecies() {
        //sort the players within a this.species
        for (let s of this.species) {
            s.sortSpecies();
        }

        //sort the this.species by the fitness of its best player
        //using selection sort like a loser
        let temp = []; //new ArrayList<Species>();
        for (let i = 0; i < this.species.length; i++) {
            let max = 0;
            let maxIndex = 0;
            for (let j = 0; j < this.species.length; j++) {
                if (this.species[j].bestFitness > max) {
                    max = this.species[j].bestFitness;
                    maxIndex = j;
                }
            }
            temp.push(this.species[maxIndex]);
            this.species.splice(maxIndex, 1);
            // this.species.remove(maxIndex);
            i--;
        }
        this.species = [];
        arrayCopy(temp, this.species);

    }

    //------------------------------------------------------------------------------------------------------------------------------------------
    //kills all this.species which haven't improved in 15this.generations
    killStaleSpecies() {
        for (let i = 2; i < this.species.length; i++) {
            if (this.species[i].staleness >= 15) {
                // .remove(i);
                // splice(this.species, i)
                this.species.splice(i, 1);
                i--;
            }
        }
    }

    //------------------------------------------------------------------------------------------------------------------------------------------
    //if a this.species sucks so much that it wont even be allocated 1 child for the nextthis.generation then kill it now
    killBadSpecies() {
        let averageSum = this.getAvgFitnessSum();

        for (let i = 1; i < this.species.length; i++) {
            if (this.species[i].averageFitness / averageSum * this.players.length < 1) { //if wont be given a single child
                // this.species.remove(i); //sad
                this.species.splice(i, 1);

                i--;
            }
        }
    }

    //------------------------------------------------------------------------------------------------------------------------------------------
    //returns the sum of each this.species average fitness
    getAvgFitnessSum() {
        let averageSum = 0;
        for (let s of this.species) {
            averageSum += s.averageFitness;
        }
        return averageSum;
    }

    //------------------------------------------------------------------------------------------------------------------------------------------
    //kill the bottom half of each this.species
    cullSpecies() {
        for (let s of this.species) {
            s.cull(); //kill bottom half
            s.fitnessSharing(); //also while we're at it lets do fitness sharing
            s.setAverage(); //reset averages because they will have changed
        }
    }

    //remove all but the top 5 species
    massExtinction() {
        for (let i = 5; i < this.species.length; i++) {
            // this.species.remove(i); //sad
            this.species.splice(i, 1);

            i--;
        }
    }

    //------------------------------------------------------------------------------------------------------------------------------------------
    //              BATCH LEARNING FUNCTIONS
    //------------------------------------------------------------------------------------------------------------------------------------------
    //update all the players which are alive
    updateAliveInBatches() {
        let aliveCount = 0;
        let lowestTTL = 10000;
        let currentBatch = this.getCurrentBatch();
        for (let player of currentBatch) {
            if (!player.dead) {
                aliveCount++;
                player.look();
                player.think();
                player.update();
                this.globalBestScore = Math.max(this.globalBestScore, player.score);
            }
            lowestTTL = Math.min(lowestTTL, player.stepsToLive);
        }


        //if all are dead in this batch and this isnt the last bach of this gen then go to the next batch
        if (aliveCount === 0 && this.batchNo < this.numberOfBatches - 1) {
            this.batchNo++;
            genLifespan = 0;
            moveCounter = 0;
            panX = 0;
            this.bestScoreOfAPreviousBatch = this.globalBestScore;

            if (lowestTTL === 0) {
                warning = new Warning("Batch Timed Out", 150, true);
            }
            resetAudio();
        }

    }

    //returns all the players in the current batch
    getCurrentBatch() {
        let batchStartInclusive = this.batchNo * this.playersPerBatch;
        let batchFinishExclusive = Math.min(this.players.length, batchStartInclusive + this.playersPerBatch);
        return this.players.slice(batchStartInclusive, batchFinishExclusive);
    }

    //returns whether the player at this.players[playerNo] is in the current batch
    isPlayerNumberInCurrentBatch(playerNo) {

        let batchStartInclusive = this.batchNo * this.playersPerBatch;
        let batchFinishExclusive = Math.min(this.players.length, batchStartInclusive + this.playersPerBatch);
        return playerNo >= batchStartInclusive && playerNo < batchFinishExclusive;


    }

    //updates the players without letting them see or think so their movements are more smooth
    updateAliveWithoutThinkingInBatches() {
        let aliveCount = 0;
        let lowestTTL = 10000;

        let currentBatch = this.getCurrentBatch();
        for (let player of currentBatch) {
            if (!player.dead) {
                aliveCount++;
                player.update();
                this.globalBestScore = Math.max(this.globalBestScore, player.score);

            }
            lowestTTL = Math.min(lowestTTL, player.stepsToLive);

        }


        //if all are dead in this batch and this isnt the last bach of this gen then go to the next batch
        if (aliveCount === 0 && this.batchNo < this.numberOfBatches - 1) {
            this.batchNo++;
            genLifespan = 0;
            moveCounter = 0;
            panX = 0;
            resetAudio();
            this.bestScoreOfAPreviousBatch = this.globalBestScore;
            if (lowestTTL === 0) {
                warning = new Warning("Batch Timed Out", 150, true);
            }
        }

    }

    //show the players in the current batch, which players are shown is dependent on the showMode
    showPlayersInBatch() {

        push();

        translate(0, 2 * 376 * (1 - playerScaleAmount));

        scale(playerScaleAmount);
        this.showingCount = 0;

        let currentBatch = this.getCurrentBatch();

        for (let p of this.players) {
            p.isShowing = false;
        }

        if (!showNothing) {
            switch (showMode) {
                case 0://show all
                    for (let p of currentBatch) {
                        p.show();
                        if (!p.dead && !p.justDiedFromLazer && p.isOnScreen) {
                            this.showingCount++;
                        }
                    }
                    break;
                case 1://show previous best player
                    if (this.batchNo === 0) {
                        this.players[0].show();
                        if (!this.players[0].dead && !this.players[0].justDiedFromLazer && this.players[0].isOnScreen) {
                            this.showingCount++;
                        }
                    }
                    break;
                case 2://show best of each species

                    for (let p of this.champPositions) {
                        if (this.isPlayerNumberInCurrentBatch(p)) {
                            this.players[p].show();
                            if (!this.players[p].dead && !this.players[p].justDiedFromLazer && this.players[p].isOnScreen) {
                                this.showingCount++;
                            }
                        }
                    }
                    break;
                case 3://show 20% of players
                    for (let i = 0; i < currentBatch.length; i++) {
                        if (i % 5 === 0) {
                            currentBatch[i].show();
                            if (!currentBatch[i].dead && !currentBatch[i].justDiedFromLazer && currentBatch[i].isOnScreen) {
                                this.showingCount++;
                            }
                        }

                    }

                    for (let p of this.champPositions) {
                        if (this.isPlayerNumberInCurrentBatch(p)) {
                            this.players[p].show();
                            if (!this.players[p].dead && !this.players[p].justDiedFromLazer && this.players[p].isOnScreen) {
                                this.showingCount++;
                            }
                        }
                    }
                    break;

            }

        }
        pop();
    }

    //updates the number of batches and the players per batch
    setNumberOfBatches(newNumber) {
        this.numberOfBatches = newNumber;
        numberOfBatches = newNumber;
        this.playersPerBatch = Math.ceil(this.players.length / this.numberOfBatches);
    }

    //returns the best player in the current batch, used for finding the current best score
    getCurrentBestPlayerInBatch() {
        let currentBatch = this.getCurrentBatch();

        let bestPlayer = currentBatch[0];
        for (let p of currentBatch) {
            if (p.score > bestPlayer.score)
                bestPlayer = p;
        }
        return bestPlayer;

    }

    //returns the number of players which are still alive in the current batch
    getNumberOfPlayersAliveInBatch() {
        let aliveCount = 0;
        let currentBatch = this.getCurrentBatch();
        for (let player of currentBatch) {
            if (!player.dead)
                aliveCount++;

        }
        return aliveCount;

    }


    //------------------------------------------------------------------------------------------------------------------------------------------
    //returns all players to the starting position and resets the generation
    resetGeneration() {
        this.batchNo = 0;
        genLifespan = 0;
        moveCounter = 0;
        for (let i = 0; i < this.players.length; i++) {
            this.players[i] = this.players[i].clone();
            this.players[i].fitness = 0;
            this.players[i].bestScore = 0;
        }

    }

    //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //                                                              UNUSED FUNCTIONS REPLACED BY BATCH LOGIC
    //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // updateAlive() {
    //
    //     for (let i = 0; i < this.players.length; i++) {
    //         if (!this.players[i].dead) {
    //             this.players[i].look(); //get inputs for brain
    //             this.players[i].think(); //use outputs from neural network
    //             this.players[i].update(); //move the player according to the outputs from the neural network
    //             if (this.players[i].score > this.globalBestScore) {
    //                 this.globalBestScore = this.players[i].score;
    //             }
    //         }
    //     }
    //
    // }
    //
    //
    // updateAliveWithoutThinking() {
    //     for (let i = 0; i < this.players.length; i++) {
    //         if (!this.players[i].dead) {
    //             this.players[i].update(); //move the player according to the outputs from the neural network
    //             if (this.players[i].score > this.globalBestScore) {
    //                 this.globalBestScore = this.players[i].score;
    //             }
    //         }
    //     }
    // }
    //
    //
    // showPlayers() {
    //
    //     push();
    //     translate(0, 2 * 376 * (1 - playerScaleAmount));
    //
    //     scale(playerScaleAmount);
    //     this.showingCount = 0;
    //
    //     if (!showNothing) {
    //         switch (showMode) {
    //             case 0://show all
    //                 for (let p of this.players) {
    //                     p.show();
    //                     if (!p.dead && !p.justDiedFromLazer && p.isOnScreen) {
    //                         this.showingCount++;
    //                     }
    //                 }
    //                 break;
    //             case 1://show previous best player
    //                 this.players[0].show();
    //                 if (!this.players[0].dead && !this.players[0].justDiedFromLazer && this.players[0].isOnScreen) {
    //                     this.showingCount++;
    //                 }
    //                 break;
    //             case 2://show best of each species
    //
    //                 for (let p of this.champPositions) {
    //                     this.players[p].show();
    //                     if (!this.players[p].dead && !this.players[p].justDiedFromLazer && this.players[p].isOnScreen) {
    //                         this.showingCount++;
    //                     }
    //                 }
    //                 break;
    //             case 3://show 20% of players
    //                 for (let i = 0; i < this.players.length; i++) {
    //                     if (i % 5 === 0) {
    //                         this.players[i].show();
    //                         if (!this.players[i].dead && !this.players[i].justDiedFromLazer && this.players[i].isOnScreen) {
    //                             this.showingCount++;
    //                         }
    //                     }
    //
    //                 }
    //
    //                 for (let p of this.champPositions) {
    //                     this.players[p].show();
    //                     if (!this.players[p].dead && !this.players[p].justDiedFromLazer && this.players[p].isOnScreen) {
    //                         this.showingCount++;
    //                     }
    //                 }
    //                 break;
    //
    //         }
    //
    //     }
    //     pop();
    // }
    //
    // //-------------------------------------------------------------------------------------------------------------------------------------------
    // getNumberOfPlayersAlive() {
    //     let count = 0;
    //     for (let p of this.players) {
    //         if (!p.dead) {
    //             count++;
    //         }
    //     }
    //     return count;
    // }
    // //------------------------------------------------------------------------------------------------------------------------------------------
    // getCurrentBestPlayer() {
    //     let bestPlayer = 0;
    //     let maxScore = -1;
    //     for (let i = 0; i < this.players.length; i++) {
    //         let playerScore = this.players[i].score;
    //         if (playerScore > maxScore) {
    //             maxScore = playerScore;
    //             bestPlayer = i;
    //         }
    //     }
    //     return this.players[bestPlayer];
    // }


}
