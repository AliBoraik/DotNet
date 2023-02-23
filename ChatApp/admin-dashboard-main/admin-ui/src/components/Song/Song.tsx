import React, {SetStateAction, useCallback, useEffect, useState} from 'react';
import styled from "@emotion/styled";
import {FormControl, TextField} from "@mui/material";
import axios from "axios";
import {getToken, queryConfig, queryConfigMultipart} from "../QueryConfig";
import {useDropzone} from "react-dropzone";
import {TailSpin} from "react-loading-icons";
import Dropzone from "../Dropzone/Dropzone";
import RedirectButton from "../CustomButtons/RedirectButton";
import styles from './Song.module.css'
import {Form} from "react-bootstrap";
import ReactAudioPlayer from "react-audio-player";

const Song: React.FC<{id: string, playlistId: string}> = (props) => {
    const [fetching, setFetching] = useState<boolean>(true);
    const [updating, setUpdating] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [id, setId] = useState<string>("");
    const [source, setSource] = useState<string>("");
    const [headerSong, setHeaderSong] = useState<string | null | undefined>();
    const [error, setError] = useState<string>("");
    const reader = new FileReader();
    const [path, setPath] = useState<string>();
    const onDrop = useCallback(acceptedFiles => {
        setPath(URL.createObjectURL(acceptedFiles[0]));
    }, [setPath]);
    const dropData = useDropzone({
        minSize: 0,
        maxSize: 1048576*5,
        onDrop
    });
    const StyledTextField = styled(TextField)`
      width: 500px;
      margin-left: 270px;
      margin-top: 20px;
    `
    const token = getToken();

    function getBase64(file: any) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            console.log(reader.result);
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

    useEffect(() => {
        axios.get(`/content/song/${props.id}`, queryConfig(token))
            .then(res => {
                setFetching(false);
                setName(res.data[0]['name'])
                setId(res.data[0]['id'])
                setSource(res.data[0]['source'])
            })
            .catch(console.log)
    }, []);

    const handleUpdateSong = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setUpdating(true);
        let config = queryConfig(token);
        const form: any = new FormData();
        form.append('name', name);
        form.append('id', id);

        if (dropData.acceptedFiles[0]) {
            let nameFile = dropData.acceptedFiles[0].name.split('.');
            if (nameFile[nameFile.length-1]!=="mp3"){
                setUpdating(false);
                setError("It is not mp3 extension");
                return;
            }
            form.append('song', dropData.acceptedFiles![0])
            config = queryConfigMultipart(token);
        };

        axios.put('/content/song', form, config)
            .then(res => {
                setUpdating(false);
                setHeaderSong(name);
            })
            .catch(er => {
                setUpdating(false);
                console.log(er)
            });
    }

    return (
        <div>
            <div>
                <RedirectButton page={`playlist/${props.playlistId}`} text={"BACK"}/> {/*TODO: back kuda?*/}
            </div>
            <h1 className={styles.titleSong}>Song — "{headerSong ?? name}" </h1>
            <div className={styles.formUpdate}>
            {
                fetching ?
                    <TailSpin className={styles.spinner} stroke="#678DA6" strokeWidth="5px"/>
                    :
                    <Form onSubmit={handleUpdateSong}>
                        <FormControl>
                            {
                                path ?
                                    <audio
                                        style={{
                                            marginLeft: '270px',
                                            marginTop: '5px',
                                            position: 'relative',
                                            top: '5px',
                                            backgroundColor: 'white',
                                            border: '1px solid #BBBDBD',
                                            borderRadius: '5px',
                                            width: '500px',
                                            height: '60px',

                                        }}
                                        controls
                                        src={path}
                                    />
                                    :
                                    ""
                            }
                            <Dropzone filetype={"song"} size={"5"} {...dropData}/>
                            <ReactAudioPlayer
                                style={{
                                    marginLeft: '270px',
                                    marginTop: '5px',
                                    position: 'relative',
                                    top: '5px',
                                    backgroundColor: 'white',
                                    border: '1px solid #BBBDBD',
                                    borderRadius: '5px',
                                    width: '500px',
                                    height: '60px',

                                }}
                                controls
                                src={"http://localhost:8080/api/" + source}
                            />
                            <StyledTextField
                                label="id"
                                type="number"
                                inputProps={{
                                    readOnly: true,
                                }}
                                color="secondary"
                                defaultValue={id}
                            />
                            <StyledTextField
                                onBlur={(e) => setName(e.target.value)}
                                label="name"
                                type="text"
                                inputProps={{
                                    readOnly: updating,
                                    autoComplete: 'off'
                                }}
                                color="secondary"
                                defaultValue={name}
                            />
                            <b style={{color:'red', marginLeft: '270px'}}>{error}</b>
                            {
                                updating ?
                                    <TailSpin
                                        className={styles.spinner}
                                        stroke="#678DA6"
                                        strokeWidth="4px"/>
                                    :
                                    <button
                                        className={`${styles.info} ${styles.update}`}
                                    >
                                        UPDATE
                                    </button>
                            }
                        </FormControl>
                    </Form>
            }
            </div>
        </div>
    );
};

export default Song;