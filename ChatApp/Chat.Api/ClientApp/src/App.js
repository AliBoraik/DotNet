import React from 'react';
import Chat from './Chat/Chat';

function App() {
    let args = window.location.search.replace('?', '').split('&')
    args.forEach(arg => args[args.indexOf(arg)] = arg.split('=')
    )
    let mod = ''
    let id = ''
    let chat = ''
    if(args[0][0] === 'mod'){
        mod = args[0][1]
    }
    if(args[1][0] === 'id'){
        id = args[1][1]
    }
    if(args[2][0] === 'chat'){
        chat = args[2][1]
    }
    return (
        <div style={{ margin: '0 30%' }}>
            <Chat mod={mod} id={id} chat={chat}/>
        </div>
    );
}

export default App;
