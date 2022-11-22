import React, {useRef, useState} from 'react';

const getFileType = (file) => {
    const mime = file.current.files[0].type;
    if (mime.startsWith("image/")) return "image";
    if (mime.startsWith("video/")) return "video";
    if (mime.startsWith("audio/")) return "audio";
    return "unknown";
}

const ChatInput = ({sendMessage}) => {
    const username = useRef(null);
    const contents = useRef(null);
    const file = useRef(null);
    const [error, setError] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();
        
        if (username.current.value && contents.current.value) {
            const data = {
                username: username.current.value,
                contents: contents.current.value,
                file: file.current.files[0],
                fileType: getFileType(file.current.files[0])
            };
            console.log(data);
            sendMessage(data);
        } else {
            if (!username.current.value) {
                username.current.focus();
                setError("Please provide a username");
            } else if (!contents.current.value) {
                contents.current.focus();
                setError("Please provide a message content");
            }
        }
    }

    return (
        <form 
            onSubmit={onSubmit}
        >
            <label htmlFor="username">Username:</label>
            <br />
            <input
                id="username"
                title="Username"
                ref={username}
            />
            <br/>
            <label htmlFor="message">Contents:</label>
            <br />
            <input
                id="contents"
                title="Message contents"
                ref={contents}
            />
            <br />
            <input
                type="file"
                id="file"
                title="File"
                ref={file}
            />
            <br/><br/>
            <p style={{color: "red"}}>{error}</p>
            <button
                type="submit"
            >
                Submit
            </button>
        </form>
    )
};

export default ChatInput;