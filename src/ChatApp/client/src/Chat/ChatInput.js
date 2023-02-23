import React, { useState } from 'react';

const ChatInput = (props) => {
    const [messageData, setMessageData] = useState('');
    const [messageType, serMessageType] = useState(0)

    const onSubmit = (e) => {
        e.preventDefault();

        const isMessageProvided = messageData && messageData !== '';

        if (isMessageProvided) {
            props.sendMessage(messageData, messageType);
        }
        else {
            alert('Please insert an user and a message.');
        }
    }
    const onMessageDataUpdate = (e) => {
        setMessageData(e.target.value);
    }

    return (
        <form
            onSubmit={onSubmit}>
            <label htmlFor="message">Message:</label>
            <br />
            <input
                type="text"
                id="message"
                name="message"
                value={messageData}
                onChange={onMessageDataUpdate} />
            <br/>
            <button>Send</button>
        </form>
    )
};

export default ChatInput;