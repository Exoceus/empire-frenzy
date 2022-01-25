import React from 'react'
import { Link } from "react-router-dom";

import ChatInput from '../chat/chatInput'

export default function WaitingRoom({chatDisplay, chatMessage, setChatMessage, sendChatMessage, leaveGame, sendReadyStatus, gameStatus, playerList, room, name,ready}) {

    if(ready){
        var button_style = {backgroundColor: 'var(--accent)', color: 'var(--light)'}
    }

    return (
        <div className='waiting-room-page-wrapper'>
                
                <div className="waiting-room-main-wrapper">
                    <h1 className="waiting-room-heading">Waiting Room</h1>
                    <div className='waiting-room-body'>
                        <div>
                            <h3>Welcome, {name}</h3>
                            <div className='waiting-room-lobby-code-wrapper'>
                                <div>Lobby Code :</div>
                                <div className='waiting-room-lobby-code'> {room}</div>
                            </div>
                            {playerList}
                        </div>
                        <div>
                            {
                            (gameStatus === 'waiting') ? <button className='waiting-room-button' style={button_style} onClick={e => sendReadyStatus(e)} title="Game only starts when all players are ready">{(ready === true) ? "Unready" : "Ready"}</button> : null
                            }

                
                            <Link to="/">
                                <button className='waiting-room-button' type="submit" style={{backgroundColor: 'var(--red)', color: 'var(--light)'}} onClick={leaveGame} ><i className="fas fa-sign-out-alt"></i> Leave Game</button>
                            </Link>
                        </div>
                    </div>
                </div>
                

                <div className='chat-view-wrapper '>
     
                    {chatDisplay}
                    <ChatInput chatMessage={chatMessage} setChatMessage={setChatMessage} sendChatMessage={sendChatMessage} />

                </div>
            </div>
    )
}
