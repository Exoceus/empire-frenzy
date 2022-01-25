import React from 'react'

import PersonalPlayArea from '../play_area/personal_play_area'

export default function CashRequestModal({cashSelect, setCashSelect, propertiesCashSelect, setPropertiesCashSelect, sendOpponentActionResponse, sendCashPayment, cashRequest ,personalPlayed, hand}) {
    //for cash select, determine total value of cash selected
    if(cashSelect.length > 0){

        if (cashSelect.length === 1){
            var total_cash_selected = cashSelect[0].value
        }
        
        else{
            var total_cash_selected = cashSelect.map(function(obj) { return obj.value; }).reduce((a, b) => {
                return (a + b)
                });
        }
    }

    else{
        var total_cash_selected = 0
    }

    if(propertiesCashSelect.length > 0){

        if (propertiesCashSelect.length === 1){
            var total_properties_selected = propertiesCashSelect[0].value
        }
        
        else{
            var total_properties_selected = propertiesCashSelect.map(function(obj) { return obj.value; }).reduce((a, b) => {
                return (a + b)
                });
        }
    }

    else{
        var total_properties_selected = 0
    }

    return (
        <div className='modal'>
            <div className="modal-main">

                <div className='modal-content-wrapper'>

                    <div className='modal-header'>

                        <h2 className='modal-title'>{cashRequest.from.playerName} has requested {cashRequest.amount} M</h2>

                      
                    </div>
                    
                    <div className='modal-body'>

                    {(personalPlayed.length === 1) ?  <PersonalPlayArea cards={personalPlayed[0].played} cashSelect={cashSelect} setCashSelect={setCashSelect} propertiesCashSelect={propertiesCashSelect} setPropertiesCashSelect={setPropertiesCashSelect} /> : null}
                    

                    <div>
                        Cash amount selected: {total_cash_selected + total_properties_selected} M 
                    </div>

                    {((personalPlayed) && ((cashSelect.length === personalPlayed[0].played.cash.length && propertiesCashSelect.length === personalPlayed[0].played.properties.length) || total_cash_selected + total_properties_selected >= cashRequest.amount)) ? <button className='waiting-room-button' onClick={e => sendCashPayment(e)}> Send Cash</button> : null}
                    {(hand.some((card) => {return card.action === 3})) ? <button className='waiting-room-button' onClick={e => sendOpponentActionResponse(e, true)}> Play Nein</button>  : null}
                    </div>
    
                    
                </div>
            </div>
        </div>
    )
}
