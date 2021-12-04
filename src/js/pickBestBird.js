let bestBird = {}
bestBird.score = 0

export default function pickBestBird(birds){
    if(birds){
        let bestScore = 0
        birds.forEach(bird => {
            if (bestScore < bird.score) bestScore = bird.score
        })
        const roundBestBird = birds.find(bird => bestScore === bird.score)
        if (roundBestBird.score > bestBird.score) bestBird = roundBestBird
    }
    return bestBird.score > 0 && bestBird
}