import React, { useEffect, useState, useRef } from 'react'
import { Grid, Button, makeStyles} from '@material-ui/core'
import DeckList from './DeckList'
import Card from './Card'
import isValidPlay from './isValidPlay'
import PlayTable from './PlayTable'
import Players from './Players'
import {socket} from '../Room'
import ShowCard from './ShowCard'

makeStyles((theme) => ({
'@global': {
    body: {
        backgroundColor: theme.palette.primary.light,
    },
}
}))

function Started(props) {
    const [openDeckList, setOpenDeckList] = useState(true)
    const [hand, setHand] = useState(props.myHand.map((card) => <Card key={card} />))
    const [numPlayers] = useState(props.gameState.length)
    const [openPlayTable, setOpenPlayTable] = useState(0)
    const [clickedCard, setClickedCard] = useState()
    const [playedThisTurn, setPlayedThisTurn] = useState(false)
    const [updating, setUpdating] = useState(false)
    const [showCardList, setShowCardList] = useState()
    const [topCard, setTopCard] = useState(0)

    const previousTurn = usePrevious(props.turn)

    useEffect(() => {
        if (previousTurn !== props.turn){
            setPlayedThisTurn(false)
        }
    }, [props.turn, previousTurn])
    useEffect(() =>{
        socket.on('showCard', payload => {
            setShowCardList(<ShowCard play={payload.play} pos={payload.pos} targ={payload.targ} targCard={payload.targCard} card={payload.card} numPlayers={numPlayers} myTurn={props.myTurn} openDeckList={openDeckList}/>)
            // setShowCardList(prevList => prevList.unshift(payload.card))
                // prevState.unshift(payload.card)})
            setTimeout(() => {
                setShowCardList()
                if (payload.discard) {
                    setTopCard(payload.card)
                }
            }, 2000)
        })
        // socket.on('test', payload => {

        //     setTimeout(() => console.log(payload.test), 3000)
        // })

        socket.on('updating', payload => {
            setUpdating(payload.updating)
        })
        socket.on('baron', payload => {
            if (props.user.localeCompare(payload.users[0]) === 0) {
                socket.emit('reqCard', {room: props.room, user: payload.users[1]})
            }
            else if (props.user.localeCompare(payload.users[1]) === 0) {
                socket.emit('reqCard', {room: props.room, user: payload.users[0]})
            }
        }) 
    }, [])
    useEffect(() => {
        setHand((props.myHand).map((card) => <Card key={card} card={card} height='40vh' mine={true} handler={handleClickCard}/>))
    }, [props.myHand])

    function handleClickList(event) {
        setOpenDeckList(prevOpenDeckList => !prevOpenDeckList)
    }
    function handleClickCard(card) {
        if (playedThisTurn) {
            return
        }
        if (props.turn !== props.myTurn) {
            return
        }
        setClickedCard(card)
        
    }
    useEffect(() => {
        if (playedThisTurn || updating) {
            return
        }
        if (!isValidPlay(clickedCard, props.myHand)) {
            setOpenPlayTable(0)
            return
        }
        switch (true) {
            case (clickedCard >= 1 && clickedCard <= 5):
                console.log("played guard")
                setOpenPlayTable(2)
                break
            case (clickedCard <= 7):
                console.log("played priest")
                setOpenPlayTable(1)
                break
            case (clickedCard <= 9):
                console.log('played baron')
                setOpenPlayTable(1)
                break
            case (clickedCard <= 11):
                console.log("played handmaid")
                setOpenPlayTable(0)
                socket.emit('playCard', {room: props.room, card: clickedCard, user: props.user, target: "", targCard: -1})
                setPlayedThisTurn(true)
                break
            case (clickedCard <= 14):
                console.log("played prince or king")
                setOpenPlayTable(1)
                break
            case (clickedCard <= 15):
                console.log('played countess')
                setOpenPlayTable(0)    
                socket.emit('playCard', {room: props.room, card: clickedCard, user: props.user, target: "", targCard: -1})
                setPlayedThisTurn(true)
                break
            case (clickedCard <= 16):
                break
            default:
                break
        }
    }, [clickedCard])


    function handlePlayFromTable(target, card, empty) {
        if ((target.localeCompare("")===0 && !empty) || playedThisTurn === true) {
            return
        }
        if (!isValidPlay(clickedCard, props.myHand))
        if (card >= 1 && card <= 5 && card === -1) {
            return
        }
        setOpenPlayTable(0)
        setPlayedThisTurn(true)
        socket.emit('playCard', {room: props.room, card: clickedCard, target: target, targCard: card, user: props.user})

    }

    return (
        <div>
            <div style={{position: 'absolute', bottom: 0, right:0}}>
                <Button variant='contained' color={openDeckList ? 'secondary' : 'primary'} onClick={handleClickList}>
                    { openDeckList ? "Hide card list" : "Show card list"}
                </Button> 
            </div>
            {openDeckList && <DeckList/>}
            <div style={openDeckList ? {width: '79%', float: 'left'} : {width: '100%', float: 'left'}}>
                {(typeof showCardList != "undefined") && showCardList}
                <Grid container  justify="center" direction="row" style={{height: '28vh'}}>
                    <Grid item sm={3}>
                        <Players myTurn={props.myTurn} turn={props.turn} pos={2} numPlayers={numPlayers} gameState={props.gameState}/>
                    </Grid>
                </Grid>
                <Grid container justify="space-between" alignItems="flex-start" direction="row" style={{ minHeight: '28vh'}}>
                    <Grid item sm={3}>
                        <Players myTurn={props.myTurn} turn={props.turn} pos={1} numPlayers={numPlayers} gameState={props.gameState}/>
                    </Grid>
                    <Grid item sm={6}>
                        <div style={{width: '50%', textAlign: 'center', float: 'left'}}>
                            Deck size: {props.deckSize} 
                        </div>
                        <div style={{width: '50%', textAlign: 'center', float: 'right'}}>
                            Top discard
                        </div>
                        <div style={{textAlign: "center"}}>
                            <div style={{display: "inlineBlock", alignItems: "center"}}>
                                <div style={{width: '50%', float: 'left'}}>
                                    <Card card={0} mine={false} height='24vh'/>
                                </div>
                                <div style={{width: '50%', float: 'right'}}>
                                    <Card card={topCard} mine={false} height='24vh'/>
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item sm={3} >
                        <Players myTurn={props.myTurn} turn={props.turn} pos={3} numPlayers={numPlayers} gameState={props.gameState}/>
                    </Grid>
                </Grid>

                <Grid container justify="center" alignItems="flex-start" direction="row" style={{height:'44vh'}}>
                    <Grid item sm={6}>
                        <div style={{textAlign: "center"}}>
                            <div style={{display: "inlineBlock", alignItems:"center"}}>
                                {hand}
                            </div>
                        </div>
                    </Grid>
                </Grid>
                {openPlayTable > 0 && (!playedThisTurn && <PlayTable table={openPlayTable} gameState={props.gameState} handler={handlePlayFromTable} clickedCard = {clickedCard} user={props.user}/>)}
            </div>
        </div>
    )
}

function usePrevious(value) {
    const ref = useRef()
    useEffect(() => {
        ref.current = value
    }, [value])
    return ref.current
}
export default Started
