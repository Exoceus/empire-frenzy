import React, { useState, useEffect } from "react";


const PropertySet = ({ properties, cardSelection, playerID, setName, setNum, propertyImage, setCompletedSets,completedSets }) => {

    const handleClick = (index) => {
        cardSelection({index, playerID})
    }

    var set_amt = 0;

    if(setNum === 1){
        set_amt = 3
    } else if(setNum === 2){
        set_amt = 2
    } else if(setNum === 3){
        set_amt = 3
    } else if(setNum === 4){
        set_amt = 4
    } else if(setNum === 5){
        set_amt = 3
    } else if(setNum === 6){
        set_amt = 3
    } else if(setNum === 7){
        set_amt = 4
    } else if(setNum === 8){
        set_amt = 2
    } else if(setNum === 9){
        set_amt = 3
    } else if(setNum === 10){
        set_amt = 2
    }

    if(properties.length >= set_amt && setCompletedSets && set_amt > 0){
        if(!completedSets.includes(setName)){
            setCompletedSets(oldArray => [...oldArray, setName]);
        }
    }

    else if(setCompletedSets && completedSets){
        if(completedSets.includes(setName)){
            setCompletedSets(completedSets.filter(item => item !== setName));
        }
    }

    if(properties.length > 0){

        return (
            <div>
                <h5 className='property-set-heading'>{setName} Set ({properties.length}/{set_amt})</h5>
                <div className='cash-section'>

                    {properties.map((card, i) => 
                    
                    <div key={i} className='card-wrapper property-card-wrapper'>
                        
                        <img src={propertyImage} className='card-img-wrapper'/>

                        <div className='card-play-options'>
                            <div>{card.cash_value} M </div> 
                            {(cardSelection) ? <button className='card-play-option-button' onClick={e => {e.preventDefault();handleClick(card.index)}}>Select</button> : null}
                        </div>
                    </div>
                    )}
                </div>
            </div>
        );
    }


    else{
        return null;
    }

};

export default PropertySet;