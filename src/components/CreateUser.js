
import {Container, Button, Box, TextField, makeStyles} from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles((theme) => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.primary.light,
        },
    },

    card: {
        backgroundColor: theme.palette.background.paper,
        marginTop: theme.spacing(8),
        padding: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: theme.shape.borderRadius,
    },
}));

function CreateUser({setAuth, ...props}) {
    function handleSubmit(event) {
        event.preventDefault()
        const name = event.target[0].value
        console.log(name);
        if (!name) return
        setAuth(1, name)
        props.history.push("/")
    }
    
    const classes = useStyles()

    return (
        <Container component="main" maxWidth="sm">
            <Box boxShadow={3} className={classes.card}>
                <form onSubmit={handleSubmit}>
                    <TextField 
                    required
                    fullWidth 
                    id="name" 
                    label="name" 
                    type="text"
                    name="name"
                    margin="none"
                    autoFocus
                    inputProps={{maxLength: 12}}
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Continue
                    </Button>
                    
                </form>
            </Box>
        </Container>
    )
}

export default CreateUser

