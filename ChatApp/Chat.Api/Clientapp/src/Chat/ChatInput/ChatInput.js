import React, {useEffect, useRef, useState} from 'react';
import Music from "../ChatWindow/MetaDataModels/Music";
import Image from "../ChatWindow/MetaDataModels/Image";
import Video from "../ChatWindow/MetaDataModels/Video";

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
    const [fileType,setFileType] = useState();
    const metaData = useRef([]);
    const [error, setError] = useState("");
    
    const handleChange = (event) => {
       setFileType(event.target.value);
    }
    useEffect(() => {
        file.current.focus();
    }, []);
    const renderSelectedForm = () =>{
        switch(fileType) {
            case 'image':
                return <Image metaData={metaData}/>
            case 'video':
                return  <Video metaData={metaData}/>
            case 'audio':
                return  <Music metaData={metaData}/>
            default:
                return null;
        }
    }
    const onSubmit = (e) => {
        e.preventDefault();
        if (username.current.value && contents.current.value) {
             const data = {
                 username: username.current.value,
                 contents: contents.current.value,
                 file: file.current.files[0],
                 metadata: metaData.current  
             };
                sendMessage(data);
            } 
        else {
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
            <br />
            <div>
                <label>Select MetaData...</label><br/>
                <select value={fileType} onChange={handleChange}>
                    <option value="Select metaData..." selected="selected"></option>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                </select>
                {renderSelectedForm()}
                <br/>
            </div>
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