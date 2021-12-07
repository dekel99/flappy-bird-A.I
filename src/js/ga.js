let gen = 2

export function nextGeneration(birds, savedBirds, birdsTotal, bird){
    document.getElementById("gen").innerHTML = `Gen: ${gen}`
    calculateFitness(savedBirds)
    for (let i = 0; i < birdsTotal; i++){
        birds[i] = pickOne(savedBirds, bird)
    }
    gen++
}

function pickOne(savedBirds, bird){
    let index = 0
    let r = Math.random()

    while(r > 0){
        r = r - savedBirds[index].fitness
        index++
    }
    index--

    let savedBird = savedBirds[index]
    let child = Object.assign({}, bird)
    child.brain = savedBird.brain.copy()
    child.brain.mutate(mutate)
    return child
}

function calculateFitness(savedBirds){
    let sum = 0
    savedBirds.forEach(bird => {
        sum += bird.score
    })
    savedBirds.forEach(bird => {
        bird.fitness = bird.score / sum
    })
}

function mutate(val){
    let rate = 0.1
    if (Math.random() < rate){
        return val + (Math.random() * 2 - 1)/5
    } else {
        return val
    }
}