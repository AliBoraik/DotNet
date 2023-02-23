import React, {useCallback, useState} from 'react';
import {FormControl, InputLabel, MenuItem, TextField} from "@mui/material";
import styled from "@emotion/styled";
import Sidebar from "../../components/Sidebar/Sidebar";
import {useNavigate} from "react-router-dom";
import styles from "./CreatePlaylist.module.css";
import Select from '@mui/material/Select';

import {useDropzone} from "react-dropzone";
import axios from "axios";
import {getToken, queryConfig, queryConfigMultipart} from "../../components/QueryConfig";
import RedirectButton from "../../components/CustomButtons/RedirectButton";
import {TailSpin} from "react-loading-icons";
import CoverUpload from "../../components/Dropzone/CoverUpload";
import {Form} from "react-bootstrap";

const StyledTextField = styled(TextField)`
      width: 500px;
      margin-left: 270px;
      margin-top: 20px;`


const CreatePlaylist = () => {
    const [id, setId] = useState<string|undefined>();
    const [title, setTitle] = useState<string|undefined>();
    const [type, setType] = useState<string|undefined>('album');
    const [paths, setPaths] = useState([]);
    const [uploading, setUploading] = useState<boolean>(false);

    const navigate = useNavigate();
    const token = getToken();

    const onDrop = useCallback(acceptedFiles => {
        setPaths(acceptedFiles.map((file: any) => URL.createObjectURL(file)));
    }, [setPaths]);
    const dropData = useDropzone({
        minSize: 0,
        maxSize: 1048576,
        onDrop
    });



    const createPlaylist =  (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUploading(true);
        const form: any = new FormData();
        let config = queryConfig(token);
        form.append('id', 0);
        form.append('title', title!);
        form.append('user_id', id!);
        form.append('type', type!);
        if (dropData.acceptedFiles[0]) {
            form.append('cover', dropData.acceptedFiles![0])
            config = queryConfigMultipart(token);
        }
        axios.post("/content/playlist", form, config)
            .then(res => {
                setUploading(true);
                navigate(`/Playlist/${res.data[0].id}`)
            })
            .catch(er => {
                setUploading(false);
                console.log(er)
            });
    }

    return (
        <div>
            <Sidebar/>
            <RedirectButton page={'content'} text={"BACK"}/>
            <h1 className={styles.title}>New Playlist</h1>
            <div className={styles.form}>
                <Form onSubmit={createPlaylist}>
                    <FormControl>

                        <CoverUpload {...dropData} filetype={"cover"} size={1} cover={paths}/>

                        <StyledTextField
                            onBlur={(e) => setTitle(e.target.value)}
                            type={'text'}
                            color={"secondary"}
                            label={'Title'}
                            value={title}
                            inputProps={{
                                readOnly: false,
                                autoComplete: 'off'
                            }}
                            required
                        />
                        <FormControl color={"secondary"} sx={{ml: 34, mt: 2}}>
                            <InputLabel id="demo-simple-select-label">Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={type}
                                label="Type"
                                onChange={(e)=>setType(e.target.value)}
                                required
                            >
                                <MenuItem value={'album'}>Album</MenuItem>
                                <MenuItem value={'single'}>Single</MenuItem>
                                <MenuItem value={'ep'}>EP</MenuItem>
                            </Select>
                        </FormControl>
                        <StyledTextField
                            onBlur={(e) => setId(e.target.value)}
                            color={"secondary"}
                            label={'Artist Id'}
                            value={id}
                            type="number"
                            required
                        />
                        {
                            uploading?
                                <TailSpin
                                    className={styles.spinner}
                                    stroke="#678DA6"
                                    strokeWidth="2px"/>
                                :
                                <button className={`${styles.info} ${styles.update}`}>
                                    CREATE
                                </button>
                        }
                    </FormControl>
                </Form>
            </div>
        </div>
    );
};

export default CreatePlaylist;