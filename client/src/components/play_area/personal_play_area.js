import React, { useState, useEffect } from "react";

import PropertyView from "./property_view";
import CashView from "./cash_view";

const PersonalPlayArea = ({
  cards,
  playerName,
  playerID,
  colorID,
  setCashSelect,
  cashSelect,
  setPropertiesCashSelect,
  propertiesCashSelect,
  cardSelection,
  setCompletedSets,
  completedSets,
  setPropertySetSelect,
}) => {
  return (
    <div className="play-area-wrapper">
      {playerName ? (
        <h3
          className="overall-game-card-heading"
          style={{ color: `#${colorID}` }}
        >
          {playerName}
        </h3>
      ) : (
        <h3
          className="overall-game-card-heading"
          style={{ color: `#${colorID}` }}
        >
          Your Cards
        </h3>
      )}

      <PropertyView
        properties={cards.properties}
        playerID={playerID}
        cardSelection={cardSelection}
        setCompletedSets={setCompletedSets}
        completedSets={completedSets}
        propertiesCashSelect={propertiesCashSelect}
        setPropertiesCashSelect={setPropertiesCashSelect}
        setPropertySetSelect={setPropertySetSelect}
      />

      <CashView
        cash={cards.cash}
        cashSelect={cashSelect}
        setCashSelect={setCashSelect}
      />
    </div>
  );
};

export default PersonalPlayArea;
