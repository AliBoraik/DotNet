import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { v4 as uuid } from 'uuid';

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

    const sendMessage = async (data) => {
        try {
            const chatMessage = {
                user: data.user,
                message: data.message,
            };
            await  fetch('http://localhost:7043/api/message', { 
                method: 'POST', 
                body: JSON.stringify(chatMessage),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
          if (data.file){
              // send file
              let bodyData = new FormData();
              bodyData.append('file', data.file)
              await fetch('http://localhost:7043/api/file?bucketName=temp', {
                  method: 'POST',
                  body: bodyData,
                  headers: {
                      'Content-Type': 'multipart/form-data'
                  }
              });
              // send metadata
              const metaDataDictionary = Object.assign({}, ...data.metadata.map((x) => ({[x.id]: x.value})));
              const chatMessage = {
                  Id: uuid() ,
                  Metadata: metaDataDictionary
              };
              await  fetch('http://localhost:7043/api/metadata', {
                  method: 'POST',
                  body: JSON.stringify(chatMessage),
                  headers: {
                      'Content-Type': 'application/json'
                  }
              });
          }
        }
        catch(e) {
            console.log('fetch error.', e);
        }
    }

    return (
        <div>
            <ChatInput sendMessage={sendMessage} />
            <hr/>
            <ChatWindow chat={chat}/>
        </div>
    );
};

export default Chat;
