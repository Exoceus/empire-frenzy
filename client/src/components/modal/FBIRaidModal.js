import React from 'react'

import OpponentPlayArea from '../play_area/opponent_play_area'

export default function FBIRaidModal({opponentPlayed, setActionPrompt, setPropertySetSelect}) {

    console.log(setPropertySetSelect)

    return (
        <div className='modal'>
            <div className="modal-main">

                <div className='modal-content-wrapper'>

                    <div className='modal-header'>

                        <h2 className='modal-title'>Select which set to steal</h2>

                        <button className='modal-close' onClick={e=> {
                            e.preventDefault();
                            setActionPrompt(null)
                        }}
                        ><i class="fas fa-times"></i></button>
                    </div>
                    
                    <div className='modal-body'>

                        <div className='opponent-play-area-horizontal'>
                        {(opponentPlayed.length > 0) ?  <OpponentPlayArea opponent_played={opponentPlayed} setPropertySetSelect={setPropertySetSelect}/> : null}
                        </div>
                    
                    </div>
    
                    
                </div>
            </div>
        </div>
    )
}
