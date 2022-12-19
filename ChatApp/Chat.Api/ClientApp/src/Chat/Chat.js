
import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

import ChatWindow from './ChatWindow';
import ChatConnection from './ChatConnection'
import ChatInput from './ChatInput';

const Chat = (props) => {
    const [ connection, setConnection ] = useState(null);
    const [ chat, setChat ] = useState([]);
    const [user, setUser] = useState('')
    const latestChat = useRef(null);
    
    latestChat.current = chat;

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl('http://localhost:7043/chat')
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(result => {
                    console.log('Connected!');

                    connection.on('Receive', message => {
                        const updatedChat = [...latestChat.current];
                        updatedChat.push(message);
                        setChat(updatedChat);
                    });
                    connectUser();
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);
    
    const connectUser = () => {
        if(props.mod === 'user')
        {
            try {
                connection.invoke('JoinUser', props.chat, props.id);
            }
            catch(e) {
                console.log(e);
            }
        }
        else if(props.mod === 'admin')
        {
            try {
                connection.invoke('JoinAdmin', props.chat, props.id);
            }
            catch(e) {
                console.log(e);
            }
        }
    }

    const sendMessage = async (messageData) => {
        
        const chatMessage = {
            Username: props.id,
            MessageData: messageData,
            MessageType: 1
        };
        
        try {
            await connection.send('SendMessage', chatMessage, props.chat);
        }
        catch(e) {
            console.log(e);
        }
        
        /*if (connection.connectionStarted) {
            
        }
        else {
            alert('No connection to server yet.');
        }*/
    }

    return (
        <div>
            <ChatInput sendMessage={sendMessage} />
            <hr />
            <ChatWindow chat={chat}/>
        </div>
    );
};

export default Chat;