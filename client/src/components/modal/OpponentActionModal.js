import React from 'react'

import PropertyCard from '../cards/propertyCards'

export default function OpponentActionModal({opponentAction, sendOpponentActionResponse, hand, properties}) {

    if(opponentAction.action.type === 'sly_deal'){
        var opening_line = <div>The following property was requested: <br /><br /></div>

        var card = <PropertyCard card={properties[opponentAction.action.card_index]}/>
    }

    else if(opponentAction.action.type === 'fbi_raid'){
        var opening_line = <div>The following property set was requested: <br /><br /></div>

        var card = <PropertyCard card={{type: 'property',cash_value: 'N/A',set: opponentAction.action.setNum}}/>
    }



    return (
        <div className='modal'>
            <div className="modal-main">

                <div className='modal-content-wrapper'>

                    <div className='modal-header'>

                        <h2 className='modal-title'>{opponentAction.opponent.name} has played a {opponentAction.action.type} on one of your cards</h2>

                      
                    </div>
                    
                    <div className='modal-body'>


                        {opening_line}


                        {card}
                        
                    
                    <button className='waiting-room-button' onClick={e => sendOpponentActionResponse(e, false)}> Allow Action</button>
                    
                    {(hand.some((card) => {return card.action === 3})) ? <button className='waiting-room-button' onClick={e => sendOpponentActionResponse(e, true)}> Play Nein</button>  : null}

                    </div>
    
                    
                </div>
            </div>
        </div>
    )
}
