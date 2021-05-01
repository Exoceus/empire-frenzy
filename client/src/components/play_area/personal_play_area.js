import React, { useState, useEffect } from "react";

import PropertyView from "./property_view"
import CashView from "./cash_view"

const PersonalPlayArea = ({ cards, playerName, playerID, cashSelect, cardSelection, setCompletedSets, completedSets}) => {
    return (
        <div>
            {(playerName) ? <h3 className='overall-game-card-heading'>{playerName}</h3> : <h3 className='overall-game-card-heading'>Your Cards</h3>}
            <PropertyView properties={cards.properties} playerID={playerID} cardSelection={cardSelection} setCompletedSets={setCompletedSets} completedSets={completedSets} />
            <CashView cash={cards.cash} cashSelect={cashSelect} />
        </div>
    );
};

export default PersonalPlayArea;