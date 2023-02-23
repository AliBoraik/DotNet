import React from 'react';
import {FileWithPath} from "react-dropzone";
import styles from "./Dropzone.module.css";



const Dropzone = (props: any) => {

    const {acceptedFiles, getRootProps, getInputProps, filetype, size} = props


    const files = acceptedFiles.map((file: FileWithPath) => (
        <span key={file.path} style={{overflow: "hidden", whiteSpace: "nowrap", margin: "10px"}}>
            <b>({ Math.ceil(file.size/1000000 * Math.pow(10, 2)) / Math.pow(10, 2)} mb)</b> {file.path}
        </span>
    ));

    return (
        <div>
            <div className={styles.drop} {...getRootProps()}>
                <input {...getInputProps()} />

                {
                    acceptedFiles.length === 0?
                        <p>Click or drag to upload {filetype} ({size}mb max)</p>
                        :<p>{files}</p>
                }
            </div>
        </div>
    );
};

export default Dropzone;