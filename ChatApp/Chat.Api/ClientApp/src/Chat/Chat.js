
import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

import ChatWindow from './ChatWindow';
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
                    getHistory();
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
    const getHistory = () => {
        fetch(`http://localhost:7043/api/message/chats/history?chatId=${props.chat}`, {
            method: 'GET'
        })
            .then((response) =>
            {return response.json()}).then((data) =>
        {
            console.log(data)
            setChat(data)
        })
    }

    const sendMessage = async (messageData) => {
        
        const chatMessage = {
            Username: props.id,
            MessageData: messageData,
            MessageType: 0
        };
        
        try {
            await connection.send('SendMessage', chatMessage, props.chat);
        }
        catch(e) {
            console.log(e);
        }
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