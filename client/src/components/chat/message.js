import React from 'react';

const ChatMessage = ({ message: { text, user, colorID }, name }) => {
    return (
        <div className="chat-message-item">
            <div style={{fontWeight: 600, color: `#${colorID}`}}>{(user == name) ? user + " (you)" : user}</div>
            <div>{text}</div>
        </div>
    );
}

export default ChatMessage;