import React, { useState, useEffect } from 'react'
import guard from '../cards/Cards/guard.jpg'
import priest from '../cards/Cards/priest.jpg'
import baron from '../cards/Cards/baron.jpg'
import handmaid from '../cards/Cards/handmaid.jpg'
import prince from '../cards/Cards/prince.jpg'
import king from '../cards/Cards/king.jpg'
import countess from '../cards/Cards/countess.jpg'
import princess from '../cards/Cards/princess.jpg'
import cardBack from '../cards/Cards/cardBack.jpg'

function Card(props) {
    const [cardImg, setCardImg] = useState()
    useEffect(() => {
        switch (true) {
            case (props.card === 0):
                setCardImg(cardBack)
                break
            case (props.card <= 5):
                setCardImg(guard)
                break
            case (props.card <= 7):
                setCardImg(priest)
                break
            case (props.card <= 9):
                setCardImg(baron)
                break
            case (props.card <= 11):
                setCardImg(handmaid)
                break
            case (props.card <= 13):
                setCardImg(prince)
                break
            case (props.card === 14):
                setCardImg(king)
                break
            case (props.card === 15):
                setCardImg(countess)
                break
            case (props.card === 16):
                setCardImg(princess)
                break
            default:
                break
        }
    }, [props.card])

if (props.mine) {
    return <img alt='Unable to find' id={props.card} src={cardImg} style={{height: props.height}} onClick={() => props.handler(props.card)} /> 
}
else {
    return <img alt='Unable to find' id={props.card} src={cardImg} style={{height: props.height}} /> 
}


}

export default Card