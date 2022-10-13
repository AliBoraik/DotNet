import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import './Chat_Style.css'

import ChatWindow from './ChatWindow/ChatWindow';
import ChatInput from './ChatInput/ChatInput';

const Chat = () => {
    const [ chat, setChat ] = useState([]);
    const latestChat = useRef(null);

    latestChat.current = chat;

    useEffect(() => {
        let connection;
        connection = new HubConnectionBuilder()
            .withUrl('http://localhost:7043/message')
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(result => {
                console.log('Connected!');

                connection.on('ReceiveMessage', message => {
                    console.log("I GOT MESSAGE " + message)
                    const updatedChat = [...latestChat.current];
                    updatedChat.push(message);
                
                    setChat(updatedChat);
                });
                fetch('http://localhost:7043/api/message/get_history', {
                    method: 'GET'
                })
                    .then((response) =>
                    {return response.json()}).then((data) => 
                {
                    let messages = []
                    data.forEach(message => {
                        messages.push({user: message.user, message: message.messageText})
                    })
                    setChat(messages)
                })
            })
            .catch(e => console.log('Connection failed: ', e));
    }, []);

    const sendMessage = async (user, message) => {
        const chatMessage = {
            user: user,
            message: message
        };

        try {
            await  fetch('http://localhost:7043/api/message', { 
                method: 'POST', 
                body: JSON.stringify(chatMessage),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        catch(e) {
            console.log('Sending message failed.', e);
        }
    }

    return (
        <section className="msger">
            <header className="msger-header">
                <div className="msger-header-title">
                    <i className="fas fa-comment-alt"></i> Chat App
                </div>
            </header>
            <ChatWindow chat={chat}/>
            <div>
                <ChatInput sendMessage={sendMessage} />
                <hr/>
            </div>
        </section>
    );
};

export default Chat;
