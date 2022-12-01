import React from 'react';

const Video  = (props) => {
    const fields = ["Title","Type","Author","Director"]
    return fields.map(field => {
        return (
            <div>
                <label htmlFor={field}>{field} : </label>
                <br/>
                <input
                    type="text"
                    id={field}
                    title={field}
                    ref={(element) => props.metaData.current.push(element)}
                />
            </div>
        )
    })
};


export default Video;
