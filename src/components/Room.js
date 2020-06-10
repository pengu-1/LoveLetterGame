import React, {useState, useEffect } from 'react'
import {Typography, makeStyles} from '@material-ui/core'
import io from 'socket.io-client'
import NotStarted from './RoomComponents/NotStarted'
import Started from './RoomComponents/Started'
//let endPoint = "http://localhost:5000"
let endPoint = "http://penguu.herokuapp.com"
let socket
const useStyles = makeStyles((theme) => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.primary.light,
        },
    }
}))
function ErrorPage() {
    return (
        <h1>
            There seems to be an error
        </h1>
    )
}

function Room(props) {
    const classes = useStyles()
    const room = props.match.params.id
    const user = sessionStorage.getItem("name")
    const [joined, setJoined] = useState(false)
    const [started, setStarted] = useState(false)
    const [gameState, setGameState] = useState([]) //[{name: u1, turn: 0, lplayed: -1, dead: False}, {name:u1, turn: 1, lplayed:-1, dead: False}]
    const [turn, setTurn] = useState()
    const [myTurn, setMyTurn] = useState()
    const [myHand, setMyHand] = useState([])
    const [deckSize, setDeckSize] = useState(0)
    const [winner, setWinner] = useState("")
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        socket = io(endPoint)
        socket.emit('join', {roomCode: room, username: user})
        socket.on('start', payload => {
            setDeckSize(payload.deckSize)
            setStarted(payload.isStarted)
            console.log("start")
            console.log(payload.turn)
            setTurn(payload.turn)
            socket.emit("getHand", {roomCode: room, username: user})
        })
        socket.on('setUser', payload => {
            sessionStorage.setItem("name", payload.user)
        })
        socket.on('isJoinSuccess', payload => {
            setLoading(false)
            setJoined(payload.isJoined)
            setGameState(payload.state)
        })
        socket.on('myTurn', payload => {
            setMyTurn(payload.myTurn)
        })
        socket.on('update', payload => {
            setGameState(payload.state)
            setTurn(payload.turn)
            setDeckSize(payload.deckSize)
            console.log("UPDATE")
            console.log(payload.state)
            console.log(payload.turn)
            socket.emit("getHand", {roomCode: room, username: user})

        })
        socket.on('giveHand', payload => {
            setMyHand(payload.hand)
        })
        socket.on('endGame', payload => {
            setStarted(false)
            setGameState(payload.state)
            setWinner(payload.winner)
            setTurn(payload.turn)
        })
                
        return () => {
            if (joined) {
                socket.emit("leave", {roomCode: room, user: user})
            }
        }
    }, [])
    if (loading) {
        return <Typography variant='h2'>
            Loading...
        </Typography>
    }
    if (!joined) {
        return ErrorPage()
    }

    if (!started) {
        return (
            <div>
                <NotStarted socket={socket} room={room} gameState={gameState} winner={winner} />
            </div>
        ) 
    }
    return (
        <Started room={room} gameState={gameState} myHand={myHand} turn={turn} myTurn={myTurn} user={user} deckSize={deckSize} />
    )
    

}


export default Room
export { socket }