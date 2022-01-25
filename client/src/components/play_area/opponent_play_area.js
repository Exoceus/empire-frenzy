import React, { useState, useEffect } from "react";

import PersonalPlayArea from "./personal_play_area";

const OpponentPlayArea = ({
  opponent_played,
  setCardSelect,
  setPropertySetSelect,
}) => {
  return (
    <>
      {opponent_played.map((player, i) => (
        <PersonalPlayArea
          cards={player.played}
          playerName={player.playerName}
          cardSelection={setCardSelect}
          playerID={player.playerID}
          colorID={player.colorID}
          setPropertySetSelect={setPropertySetSelect}
        />
      ))}
    </>
  );
};

export default OpponentPlayArea;

/*
import React, { useState, useEffect } from "react";

import PropertyView from "./property_view"
import CashView from "./cash_view"

const PersonalPlayArea = ({ cards }) => {

    const [cash, setCash] = useState('');
    const [properties, setProperties] = useState('');

    cards.forEach((card) => {
        if (card.type === 'cash' || card.type === 'action') {
            setCash(prevState => [...prevState, card])
        }
        else if (card.type === 'property') {
            setProperties(prevState => [...prevState, card])
        }
    })

    return (
        <div>
            <PropertyView properties={properties} />
            <CashView cash={cash} />
        </div>
    );
};

export default PersonalPlayArea;
*/
