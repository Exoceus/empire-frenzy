const { games } = require('./games');

const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const { gameExist, playerJoin, createGame, showPlayers, showPlayer, removePlayer, changePlayerReadyStatus, checkPlayersReady, startGame, deleteGame, shiftTurn, placeCard, receiveCashPayment,handleOpponentActionResponse } = require('./games');

const router = require('./router');

const app = express();
const server = http.createServer(app);

const io = socketio(server, {
    cors: {
        origin: "*",
    },
});

app.use(cors());
app.use(router);

//when a connection is established
io.on('connect', (socket) => {

    //the client sends the gameID (room code)
    let { gameID, action, playerName } = socket.handshake.query;
    let playerID = socket.id;

    //join a particular game. this is done when the client is loaded
    socket.on('join', ({ name, room }, callback) => {
        console.log('User join', playerName, gameID, gameExist(gameID))

        //add player to socket room
        socket.join(gameID);

        //check if game doesn't exist
        if (!gameExist(gameID)) {
            createGame(playerName, playerID, gameID)
        }

        //add player to game logic
        playerJoin(playerName, playerID, gameID)

        //announce new player
        socket.emit('chat_message', { user: 'Gamemaster', text: `${playerName}, welcome to game ${gameID}.` });
        
        socket.broadcast.to(gameID).emit('chat_message', { user: 'Gamemaster', text: `${playerName} has joined!` });

        //update player list
        io.to(gameID).emit('player_list', { gameID: gameID, players: showPlayers(gameID) });

        //send the playerID to the client
        socket.emit('player_id', playerID);

        callback();
    });

    //receive chat messages from client
    socket.on('send_chat_message', (message, callback) => {
        io.to(gameID).emit('chat_message', { user: playerName, text: message });

        callback();
    });

    //receive ready status from player client and also start game if all players are ready
    socket.on('player_ready', (ready_status, callback) => {

        changePlayerReadyStatus(playerID, gameID, ready_status);

        io.to(gameID).emit('player_list', { gameID: gameID, players: showPlayers(gameID) });

        io.to(gameID).emit('chat_message', { user: playerName, text: `${playerName} has become ${(ready_status == true) ? "Ready" : "Unready"}!` });

        callback(showPlayer(playerID, gameID));

        if (checkPlayersReady(gameID)) {
            startGame(io, gameID);
        }
    });

    //receive any hand card that is played
    socket.on('place_card', (card_index, action_info) => {
        placeCard(socket, io, gameID, playerID, card_index, action_info)
    });

    //receive cash payment
    socket.on('cash_payment', (receiver_id, cash_cards, callback) => {
        receiveCashPayment(socket, io, gameID, playerID, receiver_id, cash_cards)

        callback();
    });

    //
    socket.on('opponent_action_response', (originalAction, actionResponse, callback) => {
        handleOpponentActionResponse(socket, io, gameID, playerID, originalAction, actionResponse)

        callback();
    });

    //receive if client wants to end turn early
    socket.on('end_turn', () => {
        shiftTurn(gameID, io)
    });

    //receive if client wants to end turn early
    socket.on('winner', (completedSets) => {
        console.log(completedSets)

        io.to(gameID).emit('winner_found', { playerID, playerName});
    });


    //client sends disconnect request when the client component is dismounted. If no players left in the game, the game is ended
    socket.on('disconnect', () => {
        removePlayer(playerID, gameID)
        console.log('User left', playerName)

        if (showPlayers(gameID).length < 1) {
            deleteGame(gameID)
        }

        else {
            io.to(gameID).emit('player_list', { gameID: gameID, players: showPlayers(gameID) });
            io.to(gameID).emit('chat_message', { user: 'Gamemaster', text: `${playerName} has left.` });
        }

        console.log(games)
    })
});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));