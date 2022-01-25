import React, { useState, useEffect } from "react";

const PropertySet = ({
  properties,
  cardSelection,
  playerID,
  setName,
  setNum,
  propertyImage,
  setCompletedSets,
  completedSets,
  propertiesCashSelect,
  setPropertiesCashSelect,
  setPropertySetSelect,
}) => {
  const handleClick = (index) => {
    cardSelection({ index, playerID });
  };

  const handleCashClick = (card, index) => {
    console.log(card, index);
    if (
      propertiesCashSelect.some((cash) => {
        return cash.index === index;
      })
    ) {
      setPropertiesCashSelect(
        propertiesCashSelect.filter((cash) => cash.index !== index)
      );
      console.log(propertiesCashSelect, index);
    } else {
      setPropertiesCashSelect((oldArray) => [
        ...oldArray,
        { index, value: card.cash_value },
      ]);
    }
  };

  const handleSetClick = () => {
    console.log(setNum, "steal");
    setPropertySetSelect({ setName, setNum, playerID });
  };

  var set_amt = 0;

  if (setNum === 1) {
    set_amt = 3;
  } else if (setNum === 2) {
    set_amt = 2;
  } else if (setNum === 3) {
    set_amt = 3;
  } else if (setNum === 4) {
    set_amt = 4;
  } else if (setNum === 5) {
    set_amt = 3;
  } else if (setNum === 6) {
    set_amt = 3;
  } else if (setNum === 7) {
    set_amt = 4;
  } else if (setNum === 8) {
    set_amt = 2;
  } else if (setNum === 9) {
    set_amt = 3;
  } else if (setNum === 10) {
    set_amt = 2;
  }

  if (properties.length >= set_amt && setCompletedSets && set_amt > 0) {
    if (!completedSets.includes(setName)) {
      setCompletedSets((oldArray) => [...oldArray, setName]);
    }
  } else if (setCompletedSets && completedSets) {
    if (completedSets.includes(setName)) {
      setCompletedSets(completedSets.filter((item) => item !== setName));
    }
  }

  if (properties.length > 0) {
    return (
      <div>
        <h5 className="property-set-heading">
          {setName} Set ({properties.length}/{set_amt})
        </h5>
        {properties.length >= set_amt && setPropertySetSelect ? (
          <button onClick={handleSetClick} className="select-set-button">
            Steal {setName} Set
          </button>
        ) : null}
        <div className="cash-section">
          {properties.map((card, i) => (
            <div key={i} className="card-wrapper property-card-wrapper">
              <img src={propertyImage} className="card-img-wrapper" />

              <div className="card-play-options">
                <div>{card.cash_value} M </div>
                {cardSelection && properties.length < set_amt ? (
                  <button
                    className="card-play-option-button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleClick(card.index);
                    }}
                  >
                    Select
                  </button>
                ) : null}

                <div>{properties.length >= set_amt ? "Full set" : null}</div>

                {setPropertiesCashSelect ? (
                  <button
                    className="card-play-option-button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCashClick(card, card.index);
                    }}
                  >
                    Select
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default PropertySet;
