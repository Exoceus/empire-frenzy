import React from 'react';

import ScrollToBottom from 'react-scroll-to-bottom';

import ChatMessage from './message';

const ChatDisplay = ({ messages, user_name }) => {


    return (
            <ScrollToBottom className="chat-messages-wrapper">
                {messages.map((message, i) => <ChatMessage message={message} name={user_name} key={i}/>)}
            </ScrollToBottom>
    )
};

export default ChatDisplay;