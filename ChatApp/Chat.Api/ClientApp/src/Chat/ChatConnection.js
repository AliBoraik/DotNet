import React, { useState } from 'react';

const ChatConnection = (props) => {
    const [username, setUsername] = useState('');

    const onUserUpdate = (e) => {
        setUsername(e.target.value);
    }
    
    const onSubmit = (e) => {
        e.preventDefault();

        const isUserProvided = username && username !== '';

        if (isUserProvided) {
            props.onConnection(username)
        }
        else {
            alert('Please insert an user and a message.');
        }
    }

    

    return (
        <form
            onSubmit={onSubmit}>
            <label htmlFor="user">User:</label>
            <br />
            <input
                id="user"
                name="user"
                value={username}
                onChange={onUserUpdate} />
            <br/>
            <button>Connect</button>
        </form>
    )
}

export default ChatConnection;