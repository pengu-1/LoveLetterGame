function isValidPlay(play, hand) {
    const otherCard = (hand[0] === play ? hand[1] : hand[0] )
    if (play <= 0) {
        return false
    }
    // Countess play
    if (play >= 12 && play <= 14) {
        if (otherCard === 15) {
            return false
        }
    } 
    if (play === 16) {
        return false
    }
    return true
}

export default isValidPlay