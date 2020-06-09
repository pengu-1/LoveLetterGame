from flask import Flask, request
from flask_socketio import SocketIO, emit, join_room, leave_room
from json import dumps
from time import sleep
from datetime import datetime as dt, timedelta
# import pymysql.cursors
import string
import random
from flask_sqlalchemy import SQLAlchemy
import datetime
import threading
# import functions.playCard as play


# try:
#     conn = psycopg2.connect("dbname='gameState")
# except Exception as e:
#     print("Unable to connect to the database")
#     print(e)

# cur = conn.cursor()

# https://flask-sqlalchemy.palletsprojects.com/en/2.x/queries/#deleting-records

APP = Flask(__name__, static_folder='./build', static_url_path='/')
socketio = SocketIO(APP, cors_allowed_origins="http://localhost:5000")
ENV='prod'
if ENV == 'dev':
    APP.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://pengu1:Dixonmaiateapie1@localhost/gamestate'
else:
    APP.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://tbvmgabjhlvcau:3520a9fe1c3ccdf5fc9dfc8ad1cb3dd25f2cbf3a20dcc3276aefbfe2b06836e5@ec2-54-86-170-8.compute-1.amazonaws.com:5432/d716jnbocptfmd'
#APP.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:Dixonmaiateapie1@127.0.0.1/gamestate'
APP.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(APP)

class Gameid(db.Model):
    __tablename__ = 'gameid'
    code = db.Column('code', db.String(4), primary_key=True)
    createtime = db.Column('createtime', db.DateTime, default=db.func.now())
    started = db.Column('started', db.BOOLEAN, default=False)
    turn = db.Column('turn', db.Integer, default=0)
    dcard = db.Column('dcard', db.Integer)
    deckref = db.relationship("Decks", cascade="all, delete-orphan")
    handref = db.relationship("Hands", cascade="all, delete-orphan")
    playerref = db.relationship("Players", cascade="all, delete-orphan")
    
    # def __repr__(self):
    #     return '<Gameid %r>' self.code

class Decks(db.Model):
    __tablename__= 'decks'
    code = db.Column('code', db.String(4), db.ForeignKey("gameid.code"), primary_key=True)
    card = db.Column('card', db.Integer, primary_key=True)
    # def __repr__(self):
    #     return '<Decks %r>' self.code

class Hands(db.Model):
    __tablename__ = 'hands'
    code = db.Column('code', db.String(4), db.ForeignKey("gameid.code"), primary_key=True)
    player = db.Column('player', db.String(16), primary_key=True)
    card = db.Column('card', db.Integer, primary_key=True)
    # def __repr__(self):
    #     return '<Hands %r>' self.code

class Players(db.Model):
    code = db.Column('code', db.String(4), db.ForeignKey("gameid.code"), primary_key=True)
    player = db.Column('player', db.String(16), primary_key=True)
    turn = db.Column('turn', db.Integer)
    dead = db.Column('dead', db.BOOLEAN, default=False)
    lplayed = db.Column('lplayed', db.Integer)
    # def __repr__(self):
    #     return '<Players %r>' self.code

@APP.route('/')
def index():
    return APP.send_static_file('index.html')

def cleanDatabase():
    db.session.query(Gameid).delete()
    while True:
        lastHour = dt.now() - timedelta(hours=1)
        db.session.query(Gameid).filter(Gameid.createtime < lastHour).delete()
        db.session.commit()
        sleep(3600)


def roomGen(stringLength):
    # cur = con.cursor()
    # while True:
    #     letters = string.ascii_lowercase
    #     room = ''.join(random.choice(letters) for i in range(4))
    #     checkExist = "SELECT count(*) FROM gameid WHERE code = %s"
    #     cur.execute(checkExist, (room,))
    #     data = cur.fetchone()
    #     if data[0] == 0:
    #         cur.close()
    #         return room
    while True:
        letters = string.ascii_lowercase
        room = ''.join(random.choice(letters) for i in range(4))
        exists = db.session.query(Gameid).filter_by(code=room).first()
        if exists is None:
            return room

def cardTranslate(card):
    if (card >= 1 and card <= 5):
        return 1
    if (card <= 7):
        return 2
    if (card <= 9):
        return 3
    if (card <= 11):
        return 4
    if (card <= 13):
        return 5
    if (card == 14):
        return 6
    if (card == 15):
        return 7
    if (card == 16):
        return 8

def playCard(room, card, targ, targCard, user):
    db.session.query(Hands).filter_by(code=room).filter_by(player=user).filter_by(card=card).delete()
    db.session.query(Players).filter_by(code=room).filter_by(player=user).update({Players.lplayed: card})

    db.session.commit()
    game = db.session.query(Gameid).filter_by(code=room).first()
    curTurn = game.turn
    players = db.session.query(Players).filter_by(code=room).all()
    hands = db.session.query(Hands).filter_by(code=room).all()

    socketio.emit("showCard", {'play': True, 'card': card, 'pos': curTurn, 'targ': targ, 'targCard':targCard, 'discard': True}, room=room)
    socketio.sleep(3)
    # Guard
    if (card >=1 and card <=5):
        if (targ != ""): 
            for i in hands:
                if (i.player == targ):
                    theirCard = i.card
            if (theirCard == targCard or (theirCard < 14 and theirCard - targCard == 1)):
                db.session.query(Hands).filter_by(code=room).filter_by(player=targ).delete()
                db.session.query(Players).filter_by(code=room).filter_by(player=targ).update({Players.dead: True})
    #Priest
    elif(card >= 6 and card <= 7):
        if (targ != ""):
            for i in hands:
                if (i.player == targ):
                    theirCard = i.card
            for i in players:
                if (i.player == targ):
                    theirPos = i.turn
            
    # Baron
    elif(card >= 8 and card <= 9):
        if (targ != ""):
            for i in hands:
                if (i.player == targ):
                    theirCard = i.card
                    theirName = i.player
                if (i.player == user):
                    myCard = i.card
            socketio.emit('baron', {'users': [theirName, user]}, room=room)
            socketio.sleep(3)
            myTCard = cardTranslate(myCard)
            theirTCard = cardTranslate(theirCard)
            if (myTCard > theirTCard):
                for i in players:
                    if (i.player == targ):
                        theirTurn = i.turn
                db.session.query(Hands).filter_by(code=room).filter_by(player=targ).delete()
                db.session.query(Players).filter_by(code=room).filter_by(player=targ).update({Players.dead: True})
                socketio.emit("showCard", {'play': False, 'card': theirCard, 'pos': theirTurn, 'discard': True}, room=room)
                socketio.sleep(3)

            elif (myTCard < theirTCard):
                db.session.query(Hands).filter_by(code=room).filter_by(player=user).delete()
                db.session.query(Players).filter_by(code=room).filter_by(player=user).update({Players.dead: True})
                socketio.emit("showCard", {'play': False, 'card': myCard, 'pos': curTurn, 'discard': True}, room=room)
                socketio.sleep(3)

    # Handmaid
    elif(card >= 10 and card <= 11):
        pass

    # Prince
    elif(card >= 12 and card <= 13):
        if (targ != ""):
            for j in players:
                if (j.player == targ):
                    theirturn = j.turn 
            for i in hands:
                if (i.player == targ):
                    if (i.card == 16):
                        db.session.query(Hands).filter_by(code=room).filter_by(player=targ).delete()
                        db.session.query(Players).filter_by(code=room).filter_by(player=targ).update({Players.dead: True})    
                        socketio.emit("showCard", {'play': False, 'card': i.card, 'pos': theirturn, 'discard': True}, room=room)
                        socketio.sleep(3)
                    else:
                        db.session.query(Hands).filter_by(code=room).filter_by(player=targ).delete()
                        draw = db.session.query(Decks).filter_by(code=room).first()
                        if (draw is None):
                            draw = db.session.query(Gameid).filter_by(code=room).first()
                        else:
                            db.session.query(Decks).filter_by(code=room).filter_by(card=draw.card).delete()
                        newHand = Hands(code=room, player=targ, card=draw.card)
                        db.session.add(newHand)
                        socketio.emit("showCard", {'play': False, 'card': i.card, 'pos': theirturn, 'discard': True}, room=room)
                        socketio.sleep(3)
                    break
    # King
    elif(card == 14):
        if (targ != ""):
            for i in hands:
                if (i.player == targ):
                    theirCard = i.card
                if (i.player == user):
                    myCard = i.card
            db.session.query(Hands).filter_by(code=room).filter_by(player=user).update({Hands.card: theirCard})
            db.session.query(Hands).filter_by(code=room).filter_by(player=targ).update({Hands.card: myCard})
    # countess
    elif(card ==15):
        pass

    db.session.commit()
    deck = db.session.query(Decks).filter_by(code=room).first()
    players = db.session.query(Players).filter_by(code=room).all()
    hands = db.session.query(Hands).filter_by(code=room).all()

    allTurns = {}
    nPlayers = len(players)
    for i in players:
        if ( not i.dead):
            allTurns[i.turn] = i.player
    if (len(allTurns) == 1 or deck is None):
        if (deck is None):
            maxCard = 0
            for i in hands:
                if (cardTranslate(i.card) > maxCard):
                    winner = [i.player]
                elif (cardTranslate(i.card) == maxCard):
                    winner.append(i.player)
        else: 
            winner = list(allTurns.values())[0]
        db.session.query(Gameid).filter_by(code=room).update({Gameid.started: False, Gameid.turn: 0})
        db.session.query(Hands).filter_by(code=room).delete()
        db.session.query(Decks).filter_by(code=room).delete()
        db.session.query(Players).filter_by(code=room).update({Players.lplayed: -1, Players.dead: False})
        db.session.commit()
        state = []
        players = db.session.query(Players).filter_by(code=room).order_by(Players.turn).all()
        for i in players: 
            state.append({"name": i.player, "turn": i.turn, "lplayed": i.lplayed, "dead": i.dead})
        return {'state': state, 'end': True, 'winner': winner}

    while True:
        curTurn = (curTurn + 1) % nPlayers
        if curTurn in allTurns:
            break
    db.session.query(Gameid).filter_by(code=room).update({Gameid.turn: curTurn})
    draw = db.session.query(Decks).filter_by(code=room).first()
    db.session.query(Decks).filter_by(code=room).filter_by(card=draw.card).delete()
    newHand = Hands(code=room, player=allTurns[curTurn], card=draw.card)
    db.session.add(newHand)

    db.session.commit()

    players = db.session.query(Players).filter_by(code=room).order_by(Players.turn).all()
    deckSize = db.session.query(Decks.card).filter_by(code=room).count()
    state = []
    for i in players: 
        state.append({"name": i.player, "turn": i.turn, "lplayed": i.lplayed, "dead": i.dead})
    if (cardTranslate(card) == 2):
        return {'state': state, 'turn': curTurn, 'end': False, 'priest': [theirCard, theirPos], 'deckSize': deckSize}
    else:
        return {'state': state, 'turn': curTurn, 'end': False, 'deckSize': deckSize}

@APP.route('/api/create', methods=['POST'])
def Create():
    # cur = con.cursor()
    # room = roomGen(4)
    # sql = "INSERT INTO gameid (code) VALUES (%s)"
    # cur.execute(sql, room)
    # cur.close()
    # return ({
    #     'room' : room
    # })
    room = roomGen(4)
    newRoom = Gameid(code=room)
    db.session.add(newRoom)
    db.session.commit()
    return ({
        'room': room
    })


@socketio.on('leave')
def Leave(data):
    room = data['roomCode']
    leave_room(room)

@socketio.on('join')
def Join(data):
    # cur = con.cursor()
    room = data['roomCode']
    user = data['username']
    # mySql = "SELECT * FROM gameid where code = %s"
    mySql = db.session.query(Gameid).filter_by(code=room).first()
    # cur.execute(mySql, (room))
    # game = cur.fetchone()
    if (mySql is None):
        emit('isJoinSuccess', {"isJoined": False, "state": [], "error": "Game doesn't exist"})
        # cur.close()
        return
    # mySql = "SELECT COUNT(*) AS numPlayers from players where code = %s"
    nPlayers = db.session.query(Players).filter_by(code=room).count()
    if (nPlayers >= 4):
        emit('isJoinSuccess', {"isJoined": False, "state": [], "error": "Game is full"})     
        return
    started = db.session.query(Gameid.started).filter_by(code=room).first()
    if (started[0]):
        emit('isJoinSuccess', {"isJoined": False, "state": [], "error": "Game has started"})
        return
    while True:
        conc = 0
        uniq = db.session.query(Players).filter_by(code=room).filter_by(player=user).count()
        if (uniq != 0):
            conc += 1
            user = user + "(" + str(conc) + ")"
            emit('setUser', {"user": user})
        else:
            break
    newPlayer = Players(code=room, player=user, turn=nPlayers, lplayed=-1)
    db.session.add(newPlayer)
    db.session.commit()
    players = db.session.query(Players).filter_by(code=room).order_by(Players.turn).all()
    state = []
    for i in players: 
        state.append({"name": i.player, "turn": i.turn, "lplayed": i.lplayed, "dead": False})
    join_room(room)
    emit('myTurn', {"myTurn": nPlayers})
    emit('isJoinSuccess', {"state": state, "isJoined": True}, room=room)
    return
    # cur.execute(mySql, (room))
    # game = cur.fetchone()
    # nPlayers = game[0]


    # if (nPlayers >= 4): 
    #     emit('isJoinSuccess', {"isJoined": False, "state": [], "error": "Game is full"})     
    #     cur.close()  
    #     return
    # mySql = "SELECT started FROM gameid where code = %s"
    # cur.execute(mySql, (room))
    # game = cur.fetchone()
    # if (game[0]):
    #     emit('isJoinSuccess', {"isJoined": False, "state": [], "error": "Game has started"})
    #     cur.close()
    #     return
    # mySql = "SELECT count(*) FROM players where player=%s and code=%s"
    # while True:
    #     conc = 0
    #     cur.execute(mySql, (user, room))
    #     game = cur.fetchone()
    #     if (game[0]):
    #         conc += 1
    #         user = user + "(" + str(conc) + ")"
    #         emit('setUser', {"user": user})
    #     else:
    #         break
    # mySql = "INSERT INTO players (code, player, turn) VALUES (%s, %s, %s)"
    # cur.execute(mySql, (room, user, nPlayers))
    # mySql = "SELECT * from players where code = %s"
    # cur.execute(mySql, (room))
    # game = cur.fetchall()
    # state = []
    # for row in game:
    #     state.append({"name": row[1], "nCards": 0, "turn": row[2]})
    # join_room(room)
    # emit('isJoinSuccess', {"state": state, "isJoined": True}, room=room)
    # cur.close()

    

@socketio.on('startGame')
def Start(data):
    room = data['roomCode']
    gameStarted = db.session.query(Gameid).filter_by(code=room).first()
    if (gameStarted.started):
        return
    else:
        gameStarted.started = True
    db.session.commit()
    deck = [i for i in range(1,17)]
    random.shuffle(deck)
    draw = deck.pop(0)
    db.session.query(Gameid).filter_by(code=room).update({Gameid.createtime: db.func.now(), Gameid.dcard: draw}, synchronize_session='fetch')
    gamePlayers = db.session.query(Players).filter_by(code=room).order_by(Players.turn).all()
    # mySql = "SELECT * FROM players WHERE code=%s order by turn ASC"
    for i in gamePlayers:
        if (i.turn == 0):
            draw = deck.pop(0)
            newHand = Hands(code=room, player=i.player, card=draw)
            db.session.add(newHand)
        draw = deck.pop(0)
        newHand = Hands(code=room, player=i.player, card=draw)
        db.session.add(newHand)
    for i in deck:
        newDeckCard = Decks(code=room, card=i) 
        db.session.add(newDeckCard)   
    db.session.commit()
    emit('start', {"isStarted": True, 'deckSize': len(deck)}, room=room)

@socketio.on('getHand')
def GetHand(data):
    room = data['roomCode']
    user = data['username']
    gameHands = db.session.query(Hands).filter_by(code=room).filter_by(player=user).all()
    hand = []
    for i in gameHands:
        hand.append(i.card)
    emit('giveHand', {"hand": hand})

@socketio.on('playCard')
def PlayCard(data):
    emit('updating', {'updating': True})
    card = data['card']
    user = data['user']
    room = data['room']
    targ = data['target']
    targCard = data['targCard']
    gameState = playCard(room, card, targ, targCard, user)
    if (gameState['end']):
        emit('endGame', {'state': gameState['state'], 'winner': ', '.join(gameState['winner'])}, room=room)
        return
    if (card == 6 or card == 7):
        emit('showCard', {'play': False, 'card': gameState['priest'][0], 'pos': gameState['priest'][1], 'discard': False})
        socketio.sleep(3)
    emit('updating', {'updating': False})
    emit('update', {'state': gameState['state'], 'turn': gameState['turn'], 'deckSize': gameState['deckSize']}, room = room)

@socketio.on('reqCard')
def ReqCard(data):
    room = data['room']
    player = data['user']
    getTurn = db.session.query(Players).filter_by(code=room).filter_by(player=player).first()
    getCard = db.session.query(Hands).filter_by(code=room).filter_by(player=player).first()
    emit('showCard', {'play': False, 'card': getCard.card, 'pos': getTurn.turn, 'discard': False})


if __name__ == '__main__':
    # x = threading.Thread(target=cleanDatabase)
    # x.start()
    socketio.run(APP, debug=True)