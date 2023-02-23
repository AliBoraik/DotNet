import React from 'react';
import Dropzone from "./Dropzone";
import styles from "./Dropzone.module.css";

const CoverUpload = (props: any) => {
    return (
        <div>
            {props.cover.map((path: any, index: number) =>
                    <img key={index} className={styles.cover} src={path} />
                )}
            <Dropzone {...props}/>
        </div>
    );
};

export default CoverUpload;