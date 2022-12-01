import React from 'react';

const Music  = (props) => {
    const fields = ["Name","Artist","Album"]
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

export default Music;
