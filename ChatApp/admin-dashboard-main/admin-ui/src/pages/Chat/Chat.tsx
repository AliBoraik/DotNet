import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import RedirectButton from "../../components/CustomButtons/RedirectButton";

const Chat = () => {
    return (
        <div>
            <Sidebar/>
            <RedirectButton page={'chats'} text={"BACK"}/>
        </div>
    )
}

export default Chat;