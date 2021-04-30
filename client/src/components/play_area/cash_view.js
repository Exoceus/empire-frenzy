import React, { useState, useEffect } from "react";

import CardImg1M from '../../assets/Cards/Cards_Cash/M_1/M1-1.svg'
import CardImg2M from '../../assets/Cards/Cards_Cash/M_2/M2-1.svg'
import CardImg4M from '../../assets/Cards/Cards_Cash/M_4/M4-1.svg'
import CardImg8M from '../../assets/Cards/Cards_Cash/M_8/M8-1.svg'

const CashView = ({ cash, cashSelect }) => {

    //if clicked, add card to the cash select array
    const handleClick = (index, card) => {
        cashSelect(oldArray => [...oldArray, {index, value: card.cash_value}])
    }

    var M1Card = <img src={CardImg1M} className='card-img-wrapper'/>
    var M2Card = <img src={CardImg2M} className='card-img-wrapper'/>
    var M4Card = <img src={CardImg4M} className='card-img-wrapper'/>
    var M8Card = <img src={CardImg8M} className='card-img-wrapper'/>

    return (
        <div>
            <h4 className='game-card-section-heading'>Cash {(cash.length > 1) ? "(" + cash.map(function(obj) { if(obj){return obj.cash_value} }).reduce((a, b) => {
            return (a + b)
            }) + " M)" : null}</h4>

            <div className='cash-section'>
            {
            cash.map((card, i) => 
            <div key={i} className='card-wrapper cash-card-wrapper'>
                
                { card.cash_value === 1 && M1Card}
                { card.cash_value === 2 && M2Card}
                { card.cash_value === 4 && M4Card}
                { card.cash_value === 8 && M8Card}

        
                
                <div className='card-play-options'> 
                <div>{card.cash_value} M </div>
                    {(cashSelect) ? <button className='card-play-option-button' onClick={e => {handleClick(i, card)}}>Use</button>: null}
                </div>
            </div>
            )
            }
            </div>
        </div>
    );
};

export default CashView;