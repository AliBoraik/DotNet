import React, {useEffect} from 'react';
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import {
    Paper,
    Table,
    TableBody,
    TableCell, tableCellClasses,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import axios from "axios";
import {Link} from "react-router-dom";
import Button from "@mui/material/Button";
import {TailSpin} from "react-loading-icons";
import {KeyboardDoubleArrowDown} from "@mui/icons-material";
import {styled} from "@mui/material/styles";
import {getToken, queryConfig} from "../components/QueryConfig";
import playlist from "./Playlist/Playlist";
import Typography from "@mui/material/Typography";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));


interface playlist {
    id: number,
    title: string,
    type: string
}

interface song {
    song_id: number,
    playlist_id: number,
    name: string
}

const Content = () => {
    let loadMore;
    const type = React.useState('playlist');
    const input = React.useState(   '');
    let [offset, setOffset] = React.useState<number>(0);
    let [playlists, setPlaylists ] = React.useState<playlist[]>([]);
    let [songs, setSongs] = React.useState<song[]>([]);
    const [fetching, setFetching] = React.useState(true);
    const [received, setReceived] = React.useState(true);
    const [clear, setClear] = React.useState(true);
    let token = getToken();

    useEffect(() => {
        setPlaylists([]);
        setSongs([]);
        setOffset(0);
        setClear(true);
        setReceived(true)
    }, [input[0], type[0]]);

    const playlistSearch =() => {
        setFetching(true);
        setTimeout(()=>{
            axios.get('content/playlist/title/'
                + input[0]
                + '?offset=' + offset
                + '&limit=15', queryConfig(token))
                .then((res) =>{
                    setPlaylists([...playlists, ...res.data]);
                    setOffset(offset+15);
                    setClear(false)
                    setFetching(false);
                    if(res.data.length === 0){
                        setReceived(false);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }, 500)
    };

    const songSearch =() => {
        setFetching(true);
        setTimeout(()=>{
            axios.get('content/song/name/'
                + input[0]
                + '?offset=' + offset
                + '&limit=15', queryConfig(token))
                .then((res) =>{
                    setSongs([...songs, ...res.data]);
                    setClear(false);
                    setOffset(offset+15);
                    setFetching(false);
                    if(res.data.length === 0){
                        setReceived(false);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }, 500)
    };

    const contentSearch = () => (type[0] === 'song')? songSearch(): playlistSearch();

    const contentDelete = (id: number, index: number) => {
        if (type[0] === 'song'){
            axios.delete('content/song/'
                + `${id}`, queryConfig(token))
                .then(() => {
                    songs = [];
                    offset = index;
                    contentSearch();
                });
        }
        else{
            axios.delete(`content/playlist/${id}/song/`, queryConfig(token))
            .then(() => {
                axios.delete('content/playlist/'
                + `${id}`, queryConfig(token))
                .then(() => {
                    playlists = [];
                    offset = index;
                    contentSearch();
                });
            });
    }};

    let renderPlaylists = playlists?.map((playlist: playlist, index) => {
        return (
            <StyledTableRow key={playlist.id}>
                <StyledTableCell sx={{width: 2}}>
                    {index+1}
                </StyledTableCell>
                <StyledTableCell sx={{width: 3}}>
                    {playlist.id}
                </StyledTableCell>
                <StyledTableCell>
                    {playlist.title}
                </StyledTableCell>
                {playlist.id === 0?
                "":
                    <>
                    <StyledTableCell sx={{width: 2}}>
                        <Link
                            to={`/playlist/${playlist.id}`}
                            style={{color: "grey", textDecoration: "none"}}
                        >
                            DETAILS
                        </Link>
                    </StyledTableCell>
                    <StyledTableCell>
                    <Button onClick={() => contentDelete(playlist.id, index)}
                    style={{color: "orange", textDecoration: "none", border: "none"}}>
                    DELETE</Button>
                    </StyledTableCell>
                    </>
                }

            </StyledTableRow>
        )});

    let renderSongs = songs?.map((song: song, index) => {
        return (
            <StyledTableRow key={song.song_id}>
                <StyledTableCell sx={{width: 2}}>
                    {index+1}
                </StyledTableCell>
                <StyledTableCell sx={{width: 3}}>
                    {song.song_id}
                </StyledTableCell>
                <StyledTableCell>
                    {song.name}
                </StyledTableCell>
                {song.song_id === 0?
                    "":
                    <>
                    <StyledTableCell sx={{width: 2}}>
                        <Link
                            to={`/playlist/${song.playlist_id}/song/${song.song_id}`}
                            style={{color: "grey", textDecoration: "none"}}
                        >
                            DETAILS
                        </Link>
                    </StyledTableCell>
                    <StyledTableCell>
                        <Button onClick={() => contentDelete(song.song_id, index)}
                                style={{color: "orange", textDecoration: "none", border: "none"}}>
                            DELETE</Button>
                    </StyledTableCell>
                    </>
                }
            </StyledTableRow>
        )});

    let renderList = (type[0] === 'song')? renderSongs: renderPlaylists;

    loadMore =
        ((songs.length > 0 || playlists.length > 0) && received)?
            <Button
                sx={{width: "100%", m: 0}}
                size={"small"}
                onClick={() => {
                    contentSearch();
                }}>
                {
                    fetching?
                        <TailSpin className="spinner"
                                  stroke="#616161"
                                  strokeWidth="3px"
                                  width={20}
                                  style={{margin: 0}}
                        />:
                        <KeyboardDoubleArrowDown color={"secondary"}
                                                 sx={{m:1}}/>
                }
            </Button> : '';


    return (
        <div>
            <Sidebar/>
            <Header
                typeOptions={['playlist', 'song']}
                onSearch={contentSearch}
                inputState={input}
                typeState={type}
                addButton={true}
            />
            <div style={{height: "70px"}}/>
            <Paper elevation={0} sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{maxHeight: 550}}>
                    <Table
                        sx={{minWidth: 550, maxWidth: "calc(50% - 250px)", marginLeft: "250px"}}
                        size="small"
                        stickyHeader
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>№</TableCell>
                                <TableCell>ID</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell sx={{width: 2}}/>
                                <TableCell sx={{width: 2}}/>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {renderList}
                            <TableRow>
                                <TableCell colSpan={5}>
                                    {loadMore}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                {songs.length === 0 && !clear && type[0] === 'song'? <Typography sx={{marginLeft: 40, fontSize: 30}}>Nothing found</Typography> : ''}
                {playlists.length === 0 && !clear && type[0] === 'playlist'? <Typography sx={{marginLeft: 40, fontSize: 30}}>Nothing found</Typography> : ''}
            </Paper>
        </div>
    );
};

export default Content;