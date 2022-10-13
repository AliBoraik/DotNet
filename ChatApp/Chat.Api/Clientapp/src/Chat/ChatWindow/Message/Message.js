import React from 'react';
import '../../Chat_Style.css'

const Message = (props) => (
    <div className="msg left-msg">
        <div
        className="msg-img"
    ></div>

    <div className="msg-bubble">
        <div className="msg-info">
            <div className="msg-info-name">{props.user}</div>
        </div>
        <div className="msg-text">
            {props.message}
        </div>
    </div>
</div>
);



export default Message;