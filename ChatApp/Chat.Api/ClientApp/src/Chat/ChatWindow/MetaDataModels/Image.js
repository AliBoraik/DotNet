import React from 'react';

const Image  = (props) => {
    const fields = ["Name","Type","Author","Resolution"]
    return fields.map((field, index)=> {
        return (
            <div>
                <label htmlFor={field}>{field} : </label>
                <br/>
                <input
                    key={index}
                    type="text"
                    id={field}
                    title={field}
                    ref={(element) => props.metaData.current.push(element)}
                />
            </div>
        )
    })
};


export default Image;
