import TextField from '@mui/material/TextField';
import React, {useState} from 'react';
import styles from './Login.module.css'
import Button from '@mui/material/Button';
import { TailSpin } from 'react-loading-icons'
import { Outlet } from "react-router-dom";
import axios from "axios";
import {getToken, queryConfig} from "../../components/QueryConfig";

const isLogged = (): boolean => {
    return 0 === document.cookie.indexOf('SAT=');
}

const Login = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [fetching, setFetching] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const token = getToken();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFetching(true);
        await axios.post('/auth/', {
            email: email,
            password: password
        }, queryConfig(token)).then(data => data)
            .then(res => {
                setFetching(false);
                document.cookie = `SAT=${res.data}; max-age=86400; path=/; secure; samesite=strict`
                return res.data;
            }).catch(e => {
                setFetching(false);
                setError("Wrong credentials! 😂")
            })
    }

    return isLogged() ? <Outlet/> :
        (
            <div className={styles.login}>
                <form onChange={() => setError("")} onSubmit={handleSubmit} style={{
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <TextField
                        className={styles.formInput}
                        size='medium'
                        label="email"
                        margin='dense'
                        multiline={false}
                        inputProps={{
                            readOnly: fetching,
                            autoComplete: 'off'
                        }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        className={styles.formInput}
                        type="password"
                        size='medium'
                        label="password"
                        margin='dense'
                        multiline={false}
                        inputProps={
                            { readOnly: fetching }
                        }
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {
                        fetching ?
                            <TailSpin className={styles.spinner} stroke="#678DA6" strokeWidth="3px"/>
                            :
                            <Button
                                type="submit"
                                color="primary"
                                variant="outlined"
                                disabled={fetching}
                            >Login</Button>
                    }
                </form>
                <p style={{
                    color: 'red',
                    textAlign: 'center'
                }}>{error}</p>
        </div>
    );
};

export {Login, isLogged};