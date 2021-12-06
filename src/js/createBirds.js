let birds = []

export default function createBirds(bird, birdsTotal){
    for(let i=0; i<birdsTotal; i++){
        birds.push(Object.assign({}, bird))
    }
    return birds
}