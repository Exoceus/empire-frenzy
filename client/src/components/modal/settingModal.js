import React from 'react'

export default function SettingModal({opponentViewSize, setOpponentViewSize, settings, setSettings}) {
    return (
        <div className='modal'>
            <div className="modal-main">

                <div className='modal-content-wrapper'>

                    <div className='modal-header'>

                        <h2 className='modal-title'>Settings</h2>

                        <button className='modal-close' onClick={e=> {
                            e.preventDefault();
                            setSettings(false)
                        }}
                        ><i class="fas fa-times"></i></button>
                    </div>
                    
                    <div className='modal-body'>
                    <label for="vol">Opponent View Size (between 10% and 75%):</label>
                    <input type="range" name="vol" min="10" max="75" value={opponentViewSize} onChange={e => setOpponentViewSize(e.target.value)}/> <span>{opponentViewSize}%</span>
                    </div>
    
                    
                </div>
            </div>
        </div>
    )
}
