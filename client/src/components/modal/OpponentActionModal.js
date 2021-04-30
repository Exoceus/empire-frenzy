import React from 'react'

export default function OpponentActionModal({opponentAction, sendOpponentActionResponse, hand}) {
    return (
        <div className='modal'>
            <div className="modal-main">

                <div className='modal-content-wrapper'>

                    <div className='modal-header'>

                        <h2 className='modal-title'>{opponentAction.opponent.name} has played a {opponentAction.action.type} on one of your cards</h2>

                      
                    </div>
                    
                    <div className='modal-body'>

                    
                    <button className='waiting-room-button' onClick={e => sendOpponentActionResponse(e, false)}> Allow Action</button>
                    
                    {(hand.some((card) => {return card.action === 3})) ? <button className='waiting-room-button' onClick={e => sendOpponentActionResponse(e, true)}> Play Nein</button>  : null}

                    </div>
    
                    
                </div>
            </div>
        </div>
    )
}
