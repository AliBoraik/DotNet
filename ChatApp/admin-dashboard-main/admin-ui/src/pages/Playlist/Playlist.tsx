
import React, {useCallback, useEffect, useState} from 'react';

import {useNavigate, useParams} from "react-router-dom";

import axios from "axios";
import {getToken, queryConfig, queryConfigMultipart} from "../../components/QueryConfig";
import styled from "@emotion/styled";
import {FormControl, TextField} from "@mui/material";
import Sidebar from "../../components/Sidebar/Sidebar";
import styles from "./Playlist.module.css";
import {TailSpin} from "react-loading-icons";
import RedirectButton from "../../components/CustomButtons/RedirectButton";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';

import {useDropzone, FileWithPath} from "react-dropzone";
import CoverUpload from "../../components/Dropzone/CoverUpload";

import Dropzone from "../../components/Dropzone/Dropzone";
import AddSong from "../../components/AddSong/AddSong";
import Song from "../../components/Song/Song";
import PlaylistSongList from "../../components/PlaylistSongList";


const Playlist: React.FC = () => {
    const [fetching, setFetching] = useState<boolean>(true);
    const [updating, setUpdating] = useState<boolean>(false);
    const [id, setId] = useState<string | null>();
    const [title, setTitle] = useState<string | null>();
    const [userId, setUserId] = useState<string | null>();
    const [type, setType] = useState<string | null>();
    const [paths, setPaths] = useState([]);
    let [source, setSource] = useState('');
    const [headerTitle, setHeaderTitle] = useState<string | null | undefined>("Loading..");
    const props = useParams();
    const token = getToken();
    const [isCreatingSong, setIsCreatingSong] = useState<boolean>(false);
    const playlistId = (props.id) ?? props.idP;
    const songId = props.idS;
    const navigate = useNavigate();

    const onDrop = useCallback(acceptedFiles => {
        setPaths(acceptedFiles.map((file: any) => URL.createObjectURL(file)));
    }, [setPaths]);
    const dropData = useDropzone({
        minSize: 0,
        maxSize: 1048576,
        onDrop
    });

    useEffect(() => {
        if (songId){
            axios.get(`/content/song/${songId}/playlist/${playlistId}`, queryConfig(token))
                .then(res => {
                    if (res.data.length === 0){
                        navigate("/404", {replace: true});
                    }
                })
                .catch(er => console.log(er))
        }
        axios.get(`/content/playlist/${playlistId}`, queryConfig(token))
            .then(res => {
                setId(res.data[0]["id"]);
                setTitle(res.data[0]["title"]);
                setUserId(res.data[0]["user_id"]);
                setType(res.data[0]["type"]);
                setHeaderTitle(title!);
                setFetching(false);
                setSource(res.data[0]["img_src"]);
            })
            .catch(console.log)
    }, []);

    const StyledTextField = styled(TextField)`
      width: 500px;
      margin-left: 270px;
      margin-top: 20px;
    `

    const handleUpdatePlaylist = (e: React.FormEvent<HTMLFormElement>) => {
        setUpdating(true);
        e.preventDefault();
        const form: any = new FormData();
        let config = queryConfig(token);
        form.append('title', title!);
        form.append('id', id!);
        form.append('user_id', userId!);
        form.append('type', type!);
        if (dropData.acceptedFiles[0]) {
            form.append('cover', dropData.acceptedFiles![0])
            config = queryConfigMultipart(token);
        }

        axios.put("/content/playlist", form, config)
            .then(() => {
                setUpdating(false);
                setHeaderTitle(title!);
            })
            .catch(er => {
                setUpdating(false);
                console.log(er)
            });
    }

    if (!headerTitle)
        setHeaderTitle(title);

    return (
        <div>
            <Sidebar/>
            <RedirectButton page={'content'} text={"BACK"}/>
            <h1 className={styles.title}>Playlist — "{headerTitle ?? title}" </h1>
            <div className={styles.form}>
                {
                    fetching ?
                        <TailSpin className={styles.spinner} stroke="#678DA6" strokeWidth="5px"/>
                        :
                        <form onSubmit={handleUpdatePlaylist}>
                        <FormControl>


                            {
                                paths[0] === undefined?<img className={styles.cover} src={"http://localhost:8080/api/" + source}/>:''
                            }
                            <CoverUpload {...dropData} filetype={"cover"} size={1} cover={paths}/>


                            <StyledTextField
                                onChange={(e) => setId(e.target.value)}
                                label="playlist id"
                                type="number"
                                inputProps={{
                                    readOnly: true,
                                }}
                                color="secondary"
                                defaultValue={id}
                            />
                            <StyledTextField
                                size='medium'
                                multiline={false}
                                inputProps={{
                                    readOnly: fetching,
                                    autoComplete: 'off'
                                }}
                                onBlur={(e) => setTitle(e.target.value)}
                                label="title"
                                defaultValue={title}
                                color="secondary"
                                required
                            />
                            <StyledTextField
                                onBlur={(e) => setUserId(e.target.value)}
                                label="artist id"
                                type="number"
                                defaultValue={userId}
                                inputProps={{
                                    readOnly: fetching,
                                    autoComplete: 'off'
                                }}
                                color="secondary"
                                required
                            />
                            <FormControl>
                                <InputLabel
                                    color="secondary"
                                    sx={{
                                        marginLeft: "272px",
                                        marginTop: "21px"
                                    }}
                                >
                                    type
                                </InputLabel>
                                <Select
                                    value={type}
                                    sx={{
                                        marginLeft: "270px",
                                        marginTop: "20px"
                                    }}
                                    label="type"
                                    onChange={(e) => setType(e.target.value)}
                                    color="secondary"
                                    required
                                >
                                    <MenuItem value={"album"}>Album</MenuItem>
                                    <MenuItem value={"single"}>Single</MenuItem>
                                    <MenuItem value={"ep"}>Ep</MenuItem>
                                </Select>
                            </FormControl>
                            {
                                updating ?
                                    <TailSpin
                                        className={styles.spinner}
                                        stroke="#678DA6"
                                        strokeWidth="4px"/>
                                    :
                                    <button
                                        type="submit"
                                        className={`${styles.info} ${styles.update}`}
                                    >
                                        UPDATE
                                    </button>

                            }
                        </FormControl>
                        </form>
                }
            </div>
            <hr/>
            {
                props.idS && props.idP ?
                    <Song id={props.idS} playlistId={props.idP}/>
                    :
                isCreatingSong ?
                    <AddSong artistId={parseInt(userId!)} playlistId={playlistId!} setIsCreatingSong={setIsCreatingSong}/>
                    :
                    <div className={styles.tracks}>
                        <div className={styles.playlistSongsHeader}>
                            <h1>Playlist Songs</h1>
                            <button
                                className={`${styles.info} ${styles.add}`}
                                onClick={() => setIsCreatingSong(true)}
                            >
                                ADD NEW
                            </button>
                        </div>
                        <div className={styles.playlistSongsList}>
                            <PlaylistSongList playlistId={playlistId!}/>
                        </div>
                    </div>
            }
        </div>
    );
};

export default Playlist;