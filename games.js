const { deck_template } = require('./deck');


var gameState = [];

/*
Schema of Game state object in the overall gamestate array

var game = {
    gameID: '',
    timer: setInterval(),
    players: [{
        playerID: '',
        playerName: '',
        hand: [''],
        played: {
            cash: [''],
            properties: ['']
        },
        ready: bool
    }],
    turn: player_index
    deck: [''],
    status: ''
}
*/

//check if game exists
const gameExist = (gameID) => {
    var i;
    for (i = 0; i < gameState.length; i++) {
        if (gameState[i].gameID == gameID) {
            return true;
        }
    }

    return false
}

//player joins a game and is initialized with a basic schema
const playerJoin = (playerName, playerID, gameID) => {
    var i;
    for (i = 0; i < gameState.length; i++) {
        if (gameState[i].gameID == gameID) {
            const player = { playerName, playerID, hand: [], played: {cash: [], properties: []}, ready: false };
            gameState[i].players.push(player);
            return;
        }
    }
}

//create a new game given the gameID (lobby code)
const createGame = (playerName, playerID, gameID) => {

    const game = {
        gameID,
        players: [],
        status: 'waiting'
    }

    gameState.push(game)
}

//get all players in the game
const showPlayers = (gameID) => {
    var i = findGame(gameID);
    return gameState[i].players;
}

//get only one player in specified game
const showPlayer = (playerID, gameID) => {
    var i = findGame(gameID);
    var j;
    for (j = 0; j < gameState[i].players.length; j++) {
        if (gameState[i].players[j].playerID == playerID) {
            return gameState[i].players[j];
        }
    }
}

//remove player from game
const removePlayer = (playerID, gameID) => {
    var i = findGame(gameID);
    var j;
    for (j = 0; j < gameState[i].players.length; j++) {
        if (gameState[i].players[j].playerID == playerID) {
            gameState[i].players.splice(j, 1);
        }
    }
}

//change player ready status for player (true/false)
const changePlayerReadyStatus = (playerID, gameID, ready_status) => {
    var i = findGame(gameID);
    var j;
    for (j = 0; j < gameState[i].players.length; j++) {
        if (gameState[i].players[j].playerID == playerID) {
            gameState[i].players[j].ready = ready_status
        }
    }
}

//check if all ready in a game are ready
const checkPlayersReady = (gameID) => {
    var i = findGame(gameID);
    if (gameState[i].players.length > 1) {
        var j;
        for (j = 0; j < gameState[i].players.length; j++) {
            if (!gameState[i].players[j].ready) {
                return false
            }
        }
        return true;
    }

    else {
        return false;
    }
}

//starts a game assuming all players are ready
const startGame = (socket_io, gameID) => {
    
    var i = findGame(gameID);

    gameState[i].status = 'ongoing'
    socket_io.to(gameID).emit('game_instruction', { subject: 'game_status', action: `ongoing` });

    socket_io.to(gameID).emit('chat_message', { user: 'Gamemaster', text: `Game is now ongoing` });

    shufflePlayers(gameState[i].players);
    socket_io.to(gameID).emit('player_list', { gameID: gameID, players: showPlayers(gameID) });
    socket_io.to(gameID).emit('chat_message', { user: 'Gamemaster ', text: `Players have been shuffled` });

    var temp_deck = deck_template
    gameState[i].deck = shuffleDeck(temp_deck)

    distributeCards(socket_io, gameID)

    socket_io.to(gameID).emit('chat_message', { user: 'Gamemaster', text: `Cards have been shuffled and distributed.` });

    gameState[i].turn = 0;

    nextTurn(i, gameID, socket_io)
}

//at the end of each timer, the turn is changed to the next person
const nextTurn = (game_index, gameID, socket_io) => {

    player_index = gameState[game_index].turn % gameState[game_index].players.length;

    if (player_index === 0) {
        player_index = gameState[game_index].players.length
    }

    if (gameState[game_index].turn != 0) {
        resetTimer(game_index);

        socket_io.to(gameState[game_index].players[player_index - 1].playerID).emit('turn_status', 'end_turn');
        socket_io.to(gameID).emit('chat_message', { user: 'Gamemaster', text: `${gameState[game_index].players[player_index - 1].playerName}'s turn has ended.` });
    }


    gameState[game_index].turn += 1;

    player_index = gameState[game_index].turn % gameState[game_index].players.length;

    if (player_index === 0) {
        player_index = gameState[game_index].players.length
    }

    //draw cards
    drawCards(socket_io, game_index, player_index - 1)

    //pickup cards
    socket_io.to(gameState[game_index].players[player_index - 1].playerID).emit('turn_status', 'start_turn');

    socket_io.to(gameID).emit('chat_message', { user: 'Gamemaster', text: `It is ${gameState[game_index].players[player_index - 1].playerName}'s turn.` });

    startTimer(game_index, gameID, socket_io);
}

//if user wants to end turn early
const shiftTurn = (gameID, socket_io) => {
    var game_index = findGame(gameID);

    nextTurn(game_index, gameID, socket_io);
}

//place a card from hand as an action or into the cash and property arrays
const placeCard = (socket, socket_io, gameID, playerID, card_index, action_info) => {
    var game_index = findGame(gameID);
    var player_index = findPlayer(game_index, playerID)

    var temp_card = gameState[game_index].players[player_index].hand[card_index]

    
    gameState[game_index].players[player_index].hand.splice(card_index, 1)

    if(temp_card.type === 'action'){
        handleActionCard(socket, socket_io, gameID, game_index, player_index, temp_card, action_info)
    }

    else if(temp_card.type === 'property'){
        gameState[game_index].players[player_index].played.properties.push(temp_card)
    }

    else if(temp_card.type === 'cash'){
        gameState[game_index].players[player_index].played.cash.push(temp_card)
    }

    socket_io.to(gameState[game_index].players[player_index].playerID).emit("hand", { playerID: gameState[game_index].players[player_index].playerID, cards: gameState[game_index].players[player_index].hand });

    socket_io.to(gameID).emit("played", getAllPlayed(game_index));
}

//player chooses to pay for any type of cash payment that was requested (i.e. lottery card, rent, etc)
const receiveCashPayment =  (socket, socket_io, gameID, playerID, receiver_id, cash_cards) => {
    var game_index = findGame(gameID);
    var player_index = findPlayer(game_index, playerID)
    var receiver_index = findPlayer(game_index, receiver_id)

    for (j = 0; j < cash_cards.length; j++) {
        gameState[game_index].players[receiver_index].played.cash.push(gameState[game_index].players[player_index].played.cash[cash_cards[j].index])

        gameState[game_index].players[player_index].played.cash.splice(cash_cards[j].index, 1)
    }

    socket_io.to(gameID).emit("played", getAllPlayed(game_index));
}

//if action is played against player, the player can respon to the action through the 'Nein'card
const handleOpponentActionResponse = (socket, socket_io, gameID, playerID, originalAction, actionResponse) => {

    var game_index = findGame(gameID);

    if(actionResponse){
        activateNein(socket_io, gameID, game_index, findPlayer(game_index, playerID), actionResponse)
    }

    else{

        if(originalAction.action){
            var player_index = findPlayer(game_index, originalAction.opponent.ID)

            slyDealAction(socket_io, gameID, game_index, player_index, {index: originalAction.action.card_index, playerID: playerID})

        }
    }

    
}


/* HELPER FUNCTIONS */
/*Functions that are not exported to the root server file */

//Find Game index given gameID
const findGame = (gameID) => {
    var i;
    for (i = 0; i < gameState.length; i++) {
        if (gameState[i].gameID == gameID) {
            return i;
        }
    }
    return -1;
}

//given game index and playerID, return the index of the player
const findPlayer = (game_index, playerID) => {
    var i = game_index;
    for (j = 0; j < gameState[i].players.length; j++) {
        if (gameState[i].players[j].playerID == playerID) {
            return j;
        }
    }
    return -1;
}

//function to delete a game from the gameState. Done when there are no players left in the game
const deleteGame = (gameID) => {
    var i = findGame(gameID);
    gameState.splice(i, 1);
}

//shuffle players when game is ready to randomize the order of player turns
const shufflePlayers = (players) => {
    let j;
    let x;
    let i;

    for (i = players.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = players[i];
        players[i] = players[j];
        players[j] = x;
    }

    return players;
}

//shuffle deck given the initialized deck from the deck.js array
const shuffleDeck = (deck) => {
    let j;
    let x;
    let i;
    
    for (i = deck.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = deck[i];
        deck[i] = deck[j];
        deck[j] = x;
    }

    return deck;
}

//distribute cards initialize hand to each of the players when game starts
const distributeCards = (socket_io, gameID, cards_per_player = 5) => {
    var i = findGame(gameID);
    var j, k, num_players = gameState[i].players.length;

    cards_per_player
    for (j = 1; j <= cards_per_player; j++) {
        for (k = 0; k < num_players; k++) {
            gameState[i].players[k].hand.push(gameState[i].deck[(num_players * j) - num_players + k])
        }
    }

    gameState[i].deck.splice(0, (num_players * cards_per_player));

    var a;
    for (k = 0; k < num_players; k++) {
        for (a = 0; a < gameState[i].players[k].hand.length; a++) {
            if (gameState[i].players[k].hand[a].type === 'property') {
                gameState[i].players[k].played.properties.push(gameState[i].players[k].hand[a])        
    
                gameState[i].players[k].hand.splice(a, 1);
    
                a = 0
            }

            else if (gameState[i].players[k].hand[a].type === 'cash') {
                gameState[i].players[k].played.cash.push(gameState[i].players[k].hand[a])        
    
                gameState[i].players[k].hand.splice(a, 1);
    
                a = 0
            }

        }
    }

    
    socket_io.to(gameState[i].gameID).emit("played", getAllPlayed(i));
    
    for (k = 0; k < num_players; k++) {
        socket_io.to(gameState[i].players[k].playerID).emit("hand", { playerID: gameState[i].players[k].playerID, cards: gameState[i].players[k].hand });
    }
}

//draw cards at each turn and add to hand
const drawCards = (socket_io, game_index, player_index, draw_amount = 2) => {

    if(gameState[game_index].players[player_index].hand.length === 0){
        draw_amount = 5
    }

    gameState[game_index].players[player_index].hand = gameState[game_index].players[player_index].hand.concat(gameState[game_index].deck.slice(0, draw_amount))

    gameState[game_index].deck.splice(0, draw_amount);
    
    var i;

    for (i = 0; i < gameState[game_index].players[player_index].hand.length; i++) {      
        if (gameState[game_index].players[player_index].hand[i].type === 'property') {
            gameState[game_index].players[player_index].played.properties.push(gameState[game_index].players[player_index].hand[i])        

            gameState[game_index].players[player_index].hand.splice(i, 1);

            i = 0
        }

        if (gameState[game_index].players[player_index].hand[i].type === 'cash') {
            gameState[game_index].players[player_index].played.cash.push(gameState[game_index].players[player_index].hand[i])        

            gameState[game_index].players[player_index].hand.splice(i, 1);

            i = 0
        }
    }

    socket_io.to(gameState[game_index].gameID).emit("played", getAllPlayed(game_index));
    
    socket_io.to(gameState[game_index].players[player_index].playerID).emit("hand", { playerID: gameState[game_index].players[player_index].playerID, cards: gameState[game_index].players[player_index].hand });
}

//get all the played cards from all players
const getAllPlayed = (game_index) => {
    var i

    var temp_played = []

    for (i = 0; i < gameState[game_index].players.length; i++) {
        temp_played.push({ playerID: gameState[game_index].players[i].playerID, playerName: gameState[game_index].players[i].playerName, played: gameState[game_index].players[i].played })
    }

    return temp_played
}

//timer for timing each person's turn and forces switch of turns after 60 seconds
const startTimer = (game_index, gameID, socket_io, time = 60000) => {
    gameState[game_index].timer = setTimeout(() => {
        nextTurn(game_index, gameID, socket_io)
    }, time);
}

const resetTimer = (game_index) => {
    clearTimeout(gameState[game_index].timer);
}

//handle Action card and pass to individual action functions
const handleActionCard = (socket, socket_io, gameID, game_index, player_index, temp_card, action_info) => {  
    if(temp_card.action === 1){
      drawMore(socket_io, game_index, player_index)
    }

    else if(temp_card.action === 2){
        lottery(socket_io, gameID, game_index, player_index)
    }

    else if(temp_card.action === 4){
        slyDealRequest(socket_io, gameID, game_index, player_index, action_info)
    }
}

//function for Draw More action
const drawMore = (socket_io, game_index, player_index, draw_amount=2) => {
    gameState[game_index].players[player_index].hand = gameState[game_index].players[player_index].hand.concat(gameState[game_index].deck.slice(0, draw_amount))
  
    gameState[game_index].deck.splice(0, draw_amount);

    var i;

    for (i = 0; i < gameState[game_index].players[player_index].hand.length; i++) {      
        if (gameState[game_index].players[player_index].hand[i].type === 'property') {
            gameState[game_index].players[player_index].played.properties.push(gameState[game_index].players[player_index].hand[i])        

            gameState[game_index].players[player_index].hand.splice(i, 1);

            i = 0
        }

        if (gameState[game_index].players[player_index].hand[i].type === 'cash') {
            gameState[game_index].players[player_index].played.cash.push(gameState[game_index].players[player_index].hand[i])        

            gameState[game_index].players[player_index].hand.splice(i, 1);

            i = 0
        }
    }

    socket_io.to(gameState[game_index].gameID).emit("played", getAllPlayed(game_index));
                                                    
    socket_io.to(gameState[game_index].players[player_index].playerID).emit("hand", { playerID: gameState[game_index].players[player_index].playerID, cards: gameState[game_index].players[player_index].hand });
}

//function for Lottery action
const lottery = (socket_io, gameID, game_index, player_index) => {
    cashRequest(socket_io, gameID, game_index, player_index, 2)
}

//function for Sly Deal action. This is the request function since the player can then deny the Sly Deal using a 'Nein' card
const slyDealRequest = (socket_io, gameID, game_index, player_index, action_info) => {

    var targeted_player_index = findPlayer(game_index, action_info.playerID)

    console.log('Sly deal requested', player_index, action_info, targeted_player_index)

    socket_io.to(gameState[game_index].players[targeted_player_index].playerID).emit("opponent_action", {opponent: {ID: gameState[game_index].players[player_index].playerID, name: gameState[game_index].players[player_index].playerName}, action: {type: 'sly_deal', card_index: action_info.index}});
}

//function for general cash requests. used for rent and lottery cards
const cashRequest = (socket_io, gameID, game_index, player_index, cash_amount) => {
    socket_io.to(gameID).emit("cash_request", {from: {playerID: gameState[game_index].players[player_index].playerID, playerName: gameState[game_index].players[player_index].playerName}, amount: cash_amount});
}

//if player allows the oppoentn sly deal action, then the action is carried out
const slyDealAction = (socket_io, gameID, game_index, player_index, action_info) => {
    gameState[game_index].players[player_index].played.properties.push(gameState[game_index].players[findPlayer(game_index, action_info.playerID)].played.properties[action_info.index])

    gameState[game_index].players[findPlayer(game_index, action_info.playerID)].played.properties.splice(action_info.index, 1)

    socket_io.to(gameID).emit("played", getAllPlayed(game_index));
}

//if 'Nein' action is activated, then find Nein card and play it
const activateNein = (socket_io, gameID, game_index, player_index, actionResponse) => {
    console.log('activated nein')

    var card_index = gameState[game_index].players[player_index].hand.map(function(e) { return e.action; }).indexOf(3);

    gameState[game_index].players[player_index].hand.splice(card_index, 1)

    socket_io.to(gameState[game_index].players[player_index].playerID).emit("hand", { playerID: gameState[game_index].players[player_index].playerID, cards: gameState[game_index].players[player_index].hand });
    
}

//exports of all functions used in the server.js file
module.exports = {gameExist, playerJoin, createGame, showPlayers, showPlayer, removePlayer, changePlayerReadyStatus, checkPlayersReady, startGame, deleteGame, shiftTurn, placeCard, receiveCashPayment,handleOpponentActionResponse };