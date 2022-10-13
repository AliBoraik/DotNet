import React from 'react';
import '../Chat_Style.css'

import Message from './Message/Message';

const ChatWindow = (props) => {
    const chat = props.chat
        .map(m => <Message 
            key={Date.now() * Math.random()}
            user={m.user}
            message={m.message}/>);
    return(
        <main className="msger-chat">
            {chat}
        </main>
    )
};

export default ChatWindow;