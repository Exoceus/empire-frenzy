import React from 'react';

const ChatMessage = ({ message: { text, user }, name }) => {
    return (
        <div className="chat-message-item">
            <div style={{fontWeight: 600}}>{(user == name) ? user + " (you)" : user}</div>
            <div>{text}</div>
        </div>
    );
}

export default ChatMessage;