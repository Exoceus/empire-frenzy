import React from 'react';


const ChatInput = ({ setChatMessage, sendChatMessage, chatMessage }) => (
    <form className="chat-input-wrapper">
        <input
            className="chat-input"
            type="text"
            placeholder="Type a message ..."
            value={chatMessage}
            onChange={({ target: { value } }) => setChatMessage(value)}
            onKeyPress={event => event.key === 'Enter' ? sendChatMessage(event) : null}
        />
        <button className="chat-send-button" onClick={e => sendChatMessage(e)}>Send</button>
    </form>
)

export default ChatInput;