import React ,{ useState, useEffect} from 'react';
import { Button, makeStyles, List, ListItem, ListItemText} from '@material-ui/core/';

const useStyles = makeStyles((theme) => ({
    table: {
        borderStyle: 'solid',
        backgroundColor: 'white'
    },
    buttonPos1: {
        position: 'absolute',
        bottom: '32vh',
        left: '2vh',
        width: '15vh',
        height: '5vh'
    },
    buttonPos2: {
        position: 'absolute',
        bottom: '32vh',
        left: '13vh',
        width: '15vh',
        height: '5vh'
    },
    list: {
        overflow: 'auto'
    }

}));


function PlayTable(props) {
    const [playerSelect, setPlayerSelect] = useState("")
    const [cardSelect, setCardSelect] = useState(-1)
    const [playerListItem, setPlayerListItem] = useState()
    const classes = useStyles()
    const [validIsEmpty, setValidIsEmpty] = useState(false)

    const handlePlayerClick = (event, user) => {
        setPlayerSelect(user);
    };
    const handleCardClick = (event, user) => {
        setCardSelect(user)
    }
    useEffect(() => {
        if (props.gameState !== undefined) {
            let i
            let validPlayers = []
            for (i = 0 ; i < props.gameState.length ; i++) {
                if (!props.gameState[i].dead) {
                    if (props.gameState[i].name === props.user) {
                        if (props.clickedCard === 12 || props.clickedCard === 13) {
                            validPlayers.push(props.gameState[i].name)
                        }
                    }
                    else if(!(props.gameState[i].lplayed === 10 ||  props.gameState[i].lplayed === 11)) {
                        validPlayers.push(props.gameState[i].name)
                    }
                }
            }
            if (validPlayers.length === 0) {
                setValidIsEmpty(true)
            }
            else {
                setPlayerListItem(validPlayers.map(user => (
                <ListItem button key={user} style={playerSelect.localeCompare(user)===0 ? {backgroundColor:'orange'} : {backgroundColor:'white'}} selected={playerSelect.localeCompare(user)===0}
                    onClick={(event) => handlePlayerClick(event, user)}>
                        <ListItemText primary={user} />
                </ListItem>)))
            }
        }
    }, [props.gameState, playerSelect])

    return (
        <div>
            <div>
                <Button className={props.table===1 ? (classes.buttonPos1) : (classes.buttonPos2)} variant='contained' color='primary' onClick={() => props.handler( playerSelect, cardSelect, validIsEmpty)}>
                    Confirm
                </Button>
            </div>
            <div className={classes.table} style={{position: "absolute", bottom: 0, left: 0, width: '20vh', height: '30vh' }}> 
                <List>
                    {playerListItem}
                    {/* <ListItem button style={playerSelect.localeCompare('da')==0 ? {backgroundColor:'orange'} : {backgroundColor:'white'}} selected={playerSelect.localeCompare('da') == 0} onClick={(event) => handlePlayerClick(event, 'da')}>
                        <ListItemText primary="da" />
                    </ListItem>
                    <ListItem button style={playerSelect.localeCompare('dad')==0 ? {backgroundColor:'orange'} : {backgroundColor:'white'}} selected={playerSelect.localeCompare('dad') == 0} onClick={(event) => handlePlayerClick(event, 'dad')}>
                        <ListItemText primary="dad" />
                    </ListItem>  */}
                </List>
            </div>
            {props.table===2 &&
            <div className={classes.table} style={{position: "absolute", bottom: 0, left: '21vh', width: '20vh', height: '30vh' }}> 
                <List className={classes.list} style={{height: '28vh'}}>
                    <ListItem button style={cardSelect===6 ? {backgroundColor:'orange'} : {backgroundColor:'white'}} selected={cardSelect === 2} onClick={(event) => handleCardClick(event, 6)}>
                        <ListItemText primary="Priest" />
                    </ListItem>
                    <ListItem button style={cardSelect===8 ? {backgroundColor:'orange'} : {backgroundColor:'white'}} selected={cardSelect === 3} onClick={(event) => handleCardClick(event, 8)}>
                        <ListItemText primary="Baron" />
                    </ListItem>
                    <ListItem button style={cardSelect===10 ? {backgroundColor:'orange'} : {backgroundColor:'white'}} selected={cardSelect === 4} onClick={(event) => handleCardClick(event, 10)}>
                        <ListItemText primary="Handmaid" />
                    </ListItem>
                    <ListItem button style={cardSelect===12 ? {backgroundColor:'orange'} : {backgroundColor:'white'}} selected={cardSelect === 5} onClick={(event) => handleCardClick(event, 12)}>
                        <ListItemText primary="Prince" />
                    </ListItem>
                    <ListItem button style={cardSelect===14 ? {backgroundColor:'orange'} : {backgroundColor:'white'}} selected={cardSelect === 6} onClick={(event) => handleCardClick(event, 14)}>
                        <ListItemText primary="King" />
                    </ListItem>
                    <ListItem button style={cardSelect===15 ? {backgroundColor:'orange'} : {backgroundColor:'white'}} selected={cardSelect === 7} onClick={(event) => handleCardClick(event, 15)}>
                        <ListItemText primary="Countess" />
                    </ListItem>
                    <ListItem button style={cardSelect===16 ? {backgroundColor:'orange'} : {backgroundColor:'white'}} selected={cardSelect === 8} onClick={(event) => handleCardClick(event, 16)}>
                        <ListItemText primary="Princess" />
                    </ListItem>
                </List>
            </div>
            }
        </div>
    );
}
export default PlayTable