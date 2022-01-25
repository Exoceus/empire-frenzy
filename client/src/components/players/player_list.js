import React from 'react';

const PlayerList = ({ players }) => {

    return (
        <div>
            <h3  style={{textTransform: 'uppercase', color: 'var(--accent)', fontSize: '1.5rem'}}>Players</h3>
            <div className='player-list-wrapper'>
            {players.map((player, i) => <div key={i} style={{color: `#${player.colorID}`}} >{player.playerName} ({(player.ready) ? "Ready" : "Not Ready"})</div>)}
            </div>
        </div>
    );
};

export default PlayerList;