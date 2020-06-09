import React, {useState, useEffect} from 'react'
import { Grid, Typography } from '@material-ui/core'
import Card from './Card'
function cardTranslate(card) {
    if (card >= 1 && card <= 5)
        return 'Guard'
    if (card <= 7)
        return 'Priest'
    if (card <= 9)
        return 'Baron'
    if (card <= 11)
        return 'Handmaid'
    if (card <= 13)
        return 'Prince'
    if (card === 14)
        return 'King'
    if (card === 15)
        return 'Countess'
    if (card === 16)
        return 'Princess'
}

function ShowCard(props) {
    const [position, setPosition] = useState(props.myTurn - props.pos)
    const [justify, setJustify] = useState()
    const [top, setTop] = useState() 
    useEffect(() => {
        if (props.pos - props.myTurn < 0) {
            setPosition(props.pos - props.myTurn + props.numPlayers)
        }
        else{
            setPosition(props.pos - props.myTurn)
        }
    }, [props.myTurn, props.pos, props.numPlayers])
    useEffect (() => {
        if (position === 1){ 
            setJustify('flex-start')
            setTop('28vh')
        }
        else if (position === 2) {
            setJustify('center')
            setTop('0vh')
        }
        else if (position === 3){
            setJustify('flex-end')
            setTop('28vh')
        }
    }, [position])
    if (typeof position !== 'undefined' && position !== 0) {
        return(
            <div style={{textAlign: "center"}}>
                <div style={{display:"inlineBlock", alignItems: "center"}}>
                    <Grid container justify={typeof justify !== 'undefined' ? justify : 'flex-start'} direction="row" style={
                        props.openDeckList ? {width: '79%', float: 'left', position:'absolute', top: top !== "" ? top : 0 , left: 0, height:'24vh'}
                        :
                        {width: '100%', float: 'left', position:'absolute', top: top !== "" ? top : 0, left: 0, height:'24vh'}}>
                        <Grid item sm={3}>
                            <Card card={props.card} height='28vh' mine={false}/>
                            {props.play &&
                            <div>
                                {props.targ !== "" &&
                                <Typography variant='h5' style={{color: 'darkred'}}>
                                    Target: {props.targ} 
                                </Typography>
                                }
                                {props.targCard !== -1 && 
                                <Typography variant='h5' style={{color: 'darkred'}}>
                                has {cardTranslate(props.targCard)}?
                                </Typography>
                                }
                            </div>
                            }
                        </Grid>
                    </Grid>
                </div>
            </div>
        )   
    }
    else {
        return null
    }
}
export default ShowCard