import {Box, Card, CardContent, Button, TextField, makeStyles} from '@material-ui/core'
import React from 'react'
import axios from 'axios'

const useStyles = makeStyles((theme) => ({
'@global': {
    body: {
        backgroundColor: theme.palette.primary.light,
    },
},

// card: {
//     backgroundColor: theme.palette.background.paper,
//     marginTop: theme.spacing(8),
//     padding: theme.spacing(8),
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     borderRadius: theme.shape.borderRadius,
// },

    box: {
        margin: 'auto'
        
    },
    root: {
        width: 350,
        marginTop: theme.spacing(8),
        margin: 'auto',
        padding: theme.spacing(8),
        display: 'flex',
    }
}));

function Lobby({...props}) {
    const classes = useStyles()
    function handleSubmit(event) {
        event.preventDefault()
        const room = event.target[0].value
        if (room.length !== 4) {
            return
        }
        props.history.push("/"+room)
    }
    function handleClick(event) {
        event.preventDefault()
        axios.post('/api/create')
            .then((response) => {
                const data = response.data

                props.history.push("/" + data.room)
            })
    }
 
    return (
        <Box justifyContent="center" >
            <Card className={classes.root}>
                <CardContent className={classes.box}>
                    <Button onClick={handleClick} variant="contained" color="secondary">
                        Create new game
                    </Button>
                    <br/>
                    <br/>
                    <br/>
                    <form onSubmit={handleSubmit}>
                        <TextField
                        required
                        variant="outlined"
                        color="primary"
                        id="join"
                        name="join"
                        type="text"
                        label="Game Code"
                        autoFocus
                        inputProps={{maxLength: 4}}

                        />
                        <br/>
                        <Button type="submit" variant="contained" color="primary">
                            Join Game
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>)
}


export default Lobby