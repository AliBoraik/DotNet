import React from 'react';

import Message from './Message';

const ChatWindow = (props) => {
    
    let chat = []
    props.chat.forEach(m => {
        console.log(m)
            chat.push(
                <Message
                    key={Date.now() * Math.random()}
                    user={m.username}
                    message={m.messageData}/>)
    })
    
    return(
        <div>
            {chat}
        </div>
    )
};

export default ChatWindow;