import React, { useEffect, useState } from 'react';
import { FormControl, TextField } from "@mui/material";
import axios from 'axios';
import {queryConfig, getToken} from '../../components/QueryConfig';
import styled from "@emotion/styled";
import Sidebar from "../../components/Sidebar/Sidebar";
import styles from './User.module.css'
import {useParams} from "react-router-dom";
import { TailSpin } from 'react-loading-icons'
import RedirectButton from "../../components/CustomButtons/RedirectButton";

interface IUserData {
    id: number,
    email: string,
    username: string,
    type: string,
    premiumType: string,
    subscriptionStart: string,
    subscriptionEndL: string
}

const User: React.FC = () => {
    const [user, setUser] = useState<IUserData>();
    const [fetching, setFetching] = useState<boolean>(true);
    const props = useParams();
    const token = getToken();
    useEffect(() => {
        axios.get(`user/id/${props.id}`, queryConfig(token))
            .then(res => {
                setFetching(false);
                setUser(res.data);
            })
            .catch(console.log)
    }, []);

    const StyledTextField = styled(TextField)`
      width: 500px;
      margin-left: 270px;
      margin-top: 20px;
    `

    return (
        <div>
            <Sidebar/>
            <RedirectButton page={'users'} text={"BACK"}/>
            <div className={styles.form}>
                {
                    fetching ?
                        <TailSpin
                            className={styles.spinner}
                            stroke="#678DA6"
                            strokeWidth="3px"/> :
                        <FormControl>
                            {
                                user &&
                                Object.keys(user!).map((key) =>
                                    <StyledTextField
                                        key={key}
                                        label={key.replaceAll('_', ' ')}
                                        defaultValue={user[key as keyof typeof user]}
                                        inputProps={{
                                            readOnly: true
                                        }}
                                        color="secondary"
                                    />)
                            }
                        </FormControl>
                }
            </div>
        </div>
    );
};

export default User;