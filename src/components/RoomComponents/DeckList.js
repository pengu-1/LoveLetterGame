import React from 'react'
import { List, ListItem, ListItemText, ListItemAvatar, Divider, Avatar } from '@material-ui/core'

function DeckList(props) {
    return (
        <div style={{width:'20%', float:"right", height:"100vh", borderLeft: "4px solid black"}}>
            <List>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar style={{backgroundColor:"gold", color:'black'}}>1</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Guard (5 copies)" secondary="Choose another player and guess their card (except guard). If correct, they lose" />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemAvatar>
                        <Avatar style={{backgroundColor:"peru", color:'black'}}>2</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Priest (2 copies)" secondary="See another players hand" />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemAvatar>
                        <Avatar style={{backgroundColor:"silver", color:'black'}}>3</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Baron (2 copies)" secondary="Choose another player and compare hands. Player with lower value loses" />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemAvatar>
                        <Avatar style={{backgroundColor:"aquamarine", color:'black'}}>4</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Handmaid (2 copies)" secondary="Player cannot be affected by any effects until their next turn" />
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemAvatar>
                        <Avatar style={{backgroundColor:"dimgray", color:'black'}}>5</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Prince (2 copies)" secondary="Choose any player including yourself to discard their hand and draw. If a player discards Princess, they lose" />
                </ListItem>    
                <Divider />
                <ListItem>
                    <ListItemAvatar>
                        <Avatar style={{backgroundColor:"skyblue", color:'black'}}>6</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="King (1 copy)" secondary="Swap hands with another player" />
                </ListItem>    
                <Divider />
                <ListItem>
                    <ListItemAvatar>
                        <Avatar style={{backgroundColor:"crimson", color:'black'}}>7</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Countess (1 copy)" secondary="If the player holds King or Prince, this card must be played" />
                </ListItem>    
                <Divider />
                <ListItem>
                    <ListItemAvatar>
                        <Avatar style={{backgroundColor:"white", color:'black'}}>8</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Princess (1 copy)" secondary="If this card is discarded, you lose" />
                </ListItem>    
         </List>
        </div>
    )
}

export default DeckList