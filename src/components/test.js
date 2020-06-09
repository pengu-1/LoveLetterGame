import React ,{useState} from 'react';
import { Button, makeStyles, List, ListItem, ListItemIcon, ListItemText, Divider } from '@material-ui/core/';
import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
    table: {
        borderStyle: 'solid'
    },
    button: {
        position: 'absolute',
        bottom: '32vh',
        left: '13vh',
        width: '15vh',
        height: '5vh'
    }

}));

function Tester() {
    const [playerSelect, setPlayerSelect] = useState(-1)
    const [cardSelect, setCardSelect] = useState(-1)
    const classes = useStyles()

    const handlePlayerClick = (event, index) => {
        setPlayerSelect(index);
    };
    const handleCardClick = (event, index) => {
        setCardSelect(index)
    }
    
    return (
        <div>
            <div>
                <Button className={classes.button} variant='contained' color='primary'>
                    Confirm
                </Button>
            </div>
            <div className={classes.table} style={{position: "absolute", bottom: 0, left: 0, width: '20vh', height: '30vh' }}> 
                <List>
                    <ListItem button selected={playerSelect === 0} onClick={(event) => handlePlayerClick(event, 0)}>
                        <ListItemText primary="Inbox" />
                    </ListItem>
                    <ListItem button selected={playerSelect === 1} onClick={(event) => handlePlayerClick(event, 1)}>
                        <ListItemText primary="Drafts" />
                    </ListItem>
                </List>
            </div>
            <div className={classes.table} style={{position: "absolute", bottom: 0, left: '21vh', width: '20vh', height: '30vh' }}> 
                <List>
                    <ListItem button style={cardSelect===0 ? {backgroundColor:'orange'} : {backgroundColor:'white'}} selected={cardSelect === 0} onClick={(event) => handleCardClick(event, 0)}>
                        <ListItemText primary="Inbox" />
                    </ListItem>
                    <ListItem button style={cardSelect===1 ? {backgroundColor:'green'} : {backgroundColor:'white'}} selected={cardSelect === 1} onClick={(event) => handleCardClick(event, 1)}>
                        <ListItemText primary="Drafts" />
                    </ListItem>
                </List>
            </div>
        </div>
    );
}
export default Tester