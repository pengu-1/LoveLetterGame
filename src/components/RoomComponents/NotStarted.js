import React, {useState, useEffect} from 'react'
import { Button, Typography} from '@material-ui/core'
import DeckList from './DeckList'

function NotStarted(props) {
    const [disableButton, setDisableButton] = useState(false)

    const playerList =  props.gameState.map(player => 
        <h2 key={player.turn}>
            {player.name}
        </h2>
    )
    useEffect(() => {
        if (playerList.length <= 1) {
            setDisableButton(true)
        } 
        else {
            setDisableButton(false)
        }
    }, [playerList.length])
    const handleStartGame = () => {
        setDisableButton(true)
        props.socket.emit("startGame", {roomCode: props.room})
    }
    return (
        <div>
            <div style={{margin: '20px', width:'20%', float: 'left'}}>
                {props.winner !== "" &&
                <div>
                    <Typography variant="h3">
                        Last winner: {props.winner}
                    </Typography>
                </div>
                }
                <h1>PLAYER LIST</h1>
                    {props.playerList}
                <br/>
                {playerList}
                <Button onClick={handleStartGame} variant='contained' disabled={disableButton} color='primary'>
                    START GAME
                </Button>
            </div>
            <DeckList/>
            <div style={{width: '50%', height: '100vh', float:'right', borderLeft: '4px solid black'}}>
                <Typography gutterBottom variant='h2'>
                    Rules
                </Typography>
                <Typography>
                    This game is based on the game Love Letter and was created as a personal project for learning purposes
                    with no intention of monetary gain. 
                    <br/><br/>
                    The game has 16 cards.
                    The number on the top left indicates its value. 
                    <br/><br/>
                    On each turn, the player draws a card and discards one, applying the effect. The effects of any cards 
                    discarded due to card effects are not applied.
                    Special cases where there is no target for the card played results in no effect being applied
                    and the card discarded
                    <br/><br/>
                    The game ends when there is only one player left in the game or when there are no cards left
                    in the deck at the end of a turn. In this scenario, the player with the highest value card wins.

                    
                    
                </Typography>
            </div>
        </div>
    )
}

export default NotStarted