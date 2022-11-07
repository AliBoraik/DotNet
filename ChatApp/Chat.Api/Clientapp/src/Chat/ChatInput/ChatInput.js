import React, { useState } from 'react';
import '../Chat_Style.css'

const ChatInput = (props) => {
    const [user, setUser] = useState('');
    const [message, setMessage] = useState('');
    const [file, setFile] = useState()

    const onSubmit = (e) => {
        e.preventDefault();

        const isUserProvided = user && user !== '';
        const isMessageProvided = message && message !== '';
        const isFileProvided = file && file !== '';

        if (isUserProvided && isMessageProvided && !isFileProvided) {
            props.sendMessage(user, message);
        } else if(isUserProvided && isMessageProvided && isFileProvided)
        {
            props.sendMessage(user, message,file);
        }
        else {
            alert('Please insert an user and a message.');
        }
    }
    const onUserUpdate = (e) => {
        setUser(e.target.value);
    }

    const onMessageUpdate = (e) => {
        setMessage(e.target.value);
    }
    function onFileChange(event) {
        setFile(event.target.files[0])
    }

    return (
        <form className="msger-inputarea"
            onSubmit={onSubmit}>
            <input type="file" id="file" onChange={onFileChange} className="custom-file-input"/>
            <input 
                id="user" 
                name="user" 
                value={user}
                onChange={onUserUpdate}  type="text" className="msger-input" placeholder="Enter your name..." />
            <input 
                type="text"
                id="message"
                name="message" 
                value={message}
                onChange={onMessageUpdate} type="text" className="msger-input" placeholder="Enter your message..." />
            <button type="submit" className="msger-send-btn">Send</button>
        </form>
    )
};


export default ChatInput;