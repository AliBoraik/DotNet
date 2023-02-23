import React from 'react';
import styles from "./CustomButton.module.css";

const SimpleButton: React.FC<{onClick: () => void, text: string}> = (props) => {
    return (
        <div>
            <button
                onClick={() => props.onClick()}
                className={styles.back}
            >{props.text}
            </button>
        </div>
    );
};

export default SimpleButton;