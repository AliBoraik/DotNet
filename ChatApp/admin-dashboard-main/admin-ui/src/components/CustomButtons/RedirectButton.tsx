import React from 'react';
import styles from "./CustomButton.module.css";
import {useNavigate} from "react-router-dom";

const RedirectButton: React.FC<{page: string, text: string}> = (props) => {
    const navigate = useNavigate();
    return (
        <div>
            <button
                onClick={() => navigate(`/${props.page}`, {replace:false})}
                className={styles.back}
            >{props.text}
            </button>
        </div>
    );
};

export default RedirectButton;