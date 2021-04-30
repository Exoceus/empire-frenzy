import React from 'react'

import PersonalPlayArea from '../play_area/personal_play_area'

export default function CashRequestModal({cashSelect, setCashSelect, sendOpponentActionResponse, sendCashPayment, cashRequest ,personalPlayed, hand}) {
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

    return (
        <div className='modal'>
            <div className="modal-main">

                <div className='modal-content-wrapper'>

                    <div className='modal-header'>

                        <h2 className='modal-title'>{cashRequest.from.playerName} has requested {cashRequest.amount} M</h2>

                      
                    </div>
                    
                    <div className='modal-body'>

                    {(personalPlayed.length === 1) ?  <PersonalPlayArea cards={personalPlayed[0].played} cashSelect={setCashSelect}/> : null}
                    

                    <div>
                        Cash amount selected: {(total_cash_selected) ? total_cash_selected + "M" : null}
                    </div>

                    {((personalPlayed) && (cashSelect.length === personalPlayed[0].played.cash.length || total_cash_selected >= cashRequest.amount)) ? <button className='waiting-room-button' onClick={e => sendCashPayment(e)}> Send Cash</button> : null}
                    {(hand.some((card) => {return card.action === 3})) ? <button className='waiting-room-button' onClick={e => sendOpponentActionResponse(e, true)}> Play Nein</button>  : null}
                    </div>
    
                    
                </div>
            </div>
        </div>
    )
}
