import React, {useState, useEffect} from 'react'
import { Paper, Typography, TextField } from '@material-ui/core'
import {socket} from '../Room'
function Chat(props) {
    const [chat, setChat] = useState([])
    const [msgVal, setMsgVal] = useState("")

    useEffect(() => {
        socket.on('getMsg', payload => {
            setChat(prevState => [payload.msg, ...prevState])
        }) 
    }, []) 
    useEffect(() => {
        if (chat.length > 20) {
            setChat(prevState => {prevState.pop(); return prevState})
        }
    }, [chat])
    function handleMsgSubmit(event) {
        event.preventDefault()
        const msg = event.target[0].value
        if (!msg) return
        setMsgVal("")
        socket.emit('sendMsg', {room: props.room, user: props.user, msg: msg})
    }
    function handleChange(event) {
        setMsgVal(event.target.value)
    }
    return (
        <div>
            <div style={{width: '20%', height: '15%', position: 'absolute', right:'20%', bottom: '5%', overflow:'scroll', background:'white'}}> 
                {chat.map((msg, i) => <Typography>{msg}</Typography>)}
            </div>
            <Paper style={{position:'absolute', width:'20%', height:'5%', right:'20%', bottom:0}}>
                <form onSubmit={handleMsgSubmit}>
                    <TextField  inputProps={{maxLength: 30}} value={msgVal} onChange={handleChange}/>
                </form> 
            </Paper>
        </div>
    )
}
export default Chat