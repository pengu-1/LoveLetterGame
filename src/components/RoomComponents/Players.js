import React from 'react'
import { Paper, Typography } from '@material-ui/core'
import Card from './Card'

function Players(props) {
    const cardBack = <Card card={0} height='20vh' mine={false}/>
    return <div>
    { props.numPlayers > props.pos && 
        (!(props.gameState[(props.myTurn+props.pos) % props.numPlayers].dead) && 
        (props.turn === props.gameState[(props.myTurn + props.pos) % props.numPlayers].turn ? 
            <div>    
                { props.numPlayers > props.pos && 
                    <Paper>
                        <Typography variant="body1" style={{color: "green", fontWeight:'bold', textAlign: 'center'}}>
                            {props.gameState[(props.myTurn+props.pos) % props.numPlayers].name}
                        </Typography>
                    </Paper>
                }
                <div style={{textAlign: "center"}}>
                    <div style={{display: "inlineBlock", alignItems: "center"}}>
                        {cardBack}
                        {cardBack}
                    </div>
                </div>
            </div>
            :
            <div>
                { props.numPlayers > props.pos && 
                    <Paper>
                        <Typography variant="body1" style={{textAlign: 'center'}}>
                            {props.gameState[(props.myTurn+props.pos) % props.numPlayers].name}
                        </Typography>
                    </Paper>
                }
                <div style={{textAlign: "center"}}>
                    <div style={{display: "inlineBlock", alignItems: "center"}}>
                        {cardBack}
                    </div>
                </div>
            </div>
    ))}
    </div>
}
export default Players