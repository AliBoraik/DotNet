import React, {useEffect} from 'react';
import axios from "axios";
import {getToken, queryConfig} from "./QueryConfig";
import {Link} from "react-router-dom";
import Button from "@mui/material/Button";
import {styled} from "@mui/material/styles";
import {Paper, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow} from "@mui/material";
import {TailSpin} from "react-loading-icons";
import {KeyboardDoubleArrowDown} from "@mui/icons-material";

const PlaylistSongList: React.FC<{playlistId: string}> = (props) => {
    let loadMore;
    const type = React.useState('playlist');
    const input = React.useState(   '');
    let [offset, setOffset] = React.useState<number>(0);
    let [songs, setSongs] = React.useState<song[]>([]);
    const [fetching, setFetching] = React.useState(true);
    const [received, setReceived] = React.useState(true);
    let token = getToken();

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    useEffect(() => {
        setSongs([]);
        setOffset(0);
        setReceived(true);
        songSearch();
    }, [input[0], type[0]]);


    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    interface song {
        song_id: number,
        name: string
    }

    const songDelete = (id: number, index: number) => {
        axios.delete('content/song/'
            + `${id}`, queryConfig(token))
            .then(() => {
                songs = [];
                offset = index;
                songSearch();
            });
    }

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
                                to={`/playlist/${props.playlistId}/song/${song.song_id}`}
                                style={{color: "grey", textDecoration: "none"}}
                            >
                                DETAILS
                            </Link>
                        </StyledTableCell>
                        <StyledTableCell>
                            <Button
                                onClick={() => songDelete(song.song_id, index)}
                                style={{color: "orange", textDecoration: "none", border: "none"}}>
                                DELETE
                            </Button>
                        </StyledTableCell>
                    </>
                }
            </StyledTableRow>
        )});

    const songSearch = () => {
        setFetching(true);
        setTimeout(()=>{
            axios.get(`/content/playlist/${props.playlistId}/songs`
                + input[0]
                + '?offset=' + offset
                + '&limit=15', queryConfig(token))
                .then((res) => {
                    setSongs([...songs, ...res.data]);
                    setOffset(offset+15);
                    setFetching(false);
                    if(res.data.length === 0){
                        setReceived(false);
                        setSongs(songs);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }, 500)
    };

    loadMore =
        (songs.length > 0 && received)?
            <Button
                sx={{width: "100%", m: 0}}
                size={"small"}
                onClick={() => {
                    songSearch();
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
            <Paper elevation={0} sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 550 }}>
                    <Table
                        sx={{ minWidth: 550, maxWidth: "calc(50% - 250px)", marginLeft: "250px" }}
                        size="small"
                        stickyHeader
                    >
                        <TableHead>
                            <TableRow >
                                <TableCell>№</TableCell>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell sx={{width: 2}}/>
                                <TableCell sx={{width: 2}}/>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            { renderSongs }
                            <TableRow>
                                <TableCell colSpan={5} >
                                    { loadMore }
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </div>
    );
};

export default PlaylistSongList;