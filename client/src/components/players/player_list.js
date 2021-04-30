import React from 'react';

const PlayerList = ({ players }) => {

    return (
        <div>
            <h3>Players</h3>
            <div className='player-list-wrapper'>
            {players.map((player, i) => <div key={i}>{player.playerName} ({(player.ready) ? "Ready" : "Not Ready"})</div>)}
            </div>
        </div>
    );
};

export default PlayerList;