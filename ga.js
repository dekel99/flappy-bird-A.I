function nextGeneration(){
    calculateFitness()
    for (let i = 0; i < birdsTotal; i++){
        birds.push(Object.assign({}, bird))
        // birds[i].brain = savedBirds.brain.copy()
    }
    applyBirds("brain")
    console.log("next gen created")
}

function pickOne(){
    let index = 0
    let r = Math.random()

    while(r > 0){
        r = r - savedBirds[index].fitness
        index++
    }
    index--

    let bird = savedBirds[index]
}

function calculateFitness(){
    let sum = 0
    savedBirds.forEach(bird => bird)
}