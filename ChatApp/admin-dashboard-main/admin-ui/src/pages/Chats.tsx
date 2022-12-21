import React, {useEffect} from 'react';
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
import {Link} from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Button from "@mui/material/Button";
import axios from "axios";
import {KeyboardDoubleArrowDown} from "@mui/icons-material";
import { TailSpin } from 'react-loading-icons';
import {styled} from "@mui/material/styles";
import {getToken, queryConfig} from "../components/QueryConfig";
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

interface Chat {
    id: number,
    name: string
}

const Chats = () => {
    let loadMore;
    const type = React.useState('name');
    const input = React.useState('');
    const [offset, setOffset] = React.useState<number>(0);
    const [chats, setChats] = React.useState<Chat[]>([]);
    const [fetching, setFetching] = React.useState(true);
    const [received, setReceived] = React.useState(true);
    const [clear, setClear] = React.useState(true);
    let token = getToken();

    useEffect(() => {
        setChats([]);
        setClear(true);
        setOffset(0);
        setReceived(true)
    }, [input[0], type[0]]);

    const chatSearch = () => {
        setFetching(true);
        setTimeout(() => {
        if (type[0] === 'id'){
            axios.get('chat/id/' + input[0], queryConfig(token))
            .then((res) => {
                setClear(false);
                setChats([res.data]);
                setFetching(false);
                setReceived(false)
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    /*logout*/
                }
            });
        }
        else {
            axios.get('chat/name/'
                + input[0]
                + '?offset=' + offset
                + '&limit=15'
                + '&chatType=' + type[0], queryConfig(token))
                .then((res) => {
                    setClear(false);
                    setChats([...chats, ...res.data]);
                    setOffset(offset + 15);
                    setFetching(false);
                    if (res.data.length === 0) {
                        setReceived(false)
                        setChats(chats)
                    }
                })
                .catch((error) => {
                    if (error.response.status === 403) {
                        window.location.href = "/Account/Login";
                    }
                });
            }
        }, 100)
    };

    let renderList = chats?.map((chat: Chat, index) => {
            return (
                <StyledTableRow key={chat.id}>
                    <StyledTableCell sx={{width: 2}}>
                        {index+1}
                    </StyledTableCell>
                    <StyledTableCell sx={{width: 3}}>
                        {chat.id}
                    </StyledTableCell>
                    <StyledTableCell>
                        {chat.name}
                    </StyledTableCell>
                    <StyledTableCell width="120px">
                        <Link
                            to={`http://localhost:3000/?mod=user&chat=${chat.id}`}
                            style={{color: "#1475c2", textDecoration: "none"}}
                        >
                            Take to work
                        </Link>
                    </StyledTableCell>
                    <StyledTableCell sx={{width: 2}}>
                        <Link
                            to={`/Chat/${chat.id}`}
                            style={{color: "grey", textDecoration: "none"}}
                        >
                            Details
                        </Link>
                    </StyledTableCell>
                </StyledTableRow>
        )});

    loadMore =
    (chats.length > 0 && received)?
        <Button
            sx={{width: "100%", m: 0}}
            size={"small"}
            onClick={() => {
                chatSearch();
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
        </Button> : "";

    return (
        <div>
            <Sidebar/>
            <Header
                typeOptions={['name', 'id']}
                onSearch={chatSearch}
                inputState={input}
                typeState={type}
                addButton={false}
            />
            <div style={{height: "70px"}}/>
            <Paper elevation={0} sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 550 }}>
                    <Table
                        sx={{ minWidth: 550, maxWidth: "calc(100% - 300px)", marginLeft: "250px" }}
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
                            {renderList}
                            <TableRow>
                                <TableCell colSpan={5} >
                                    {loadMore}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                {chats.length === 0 && !clear? <Typography sx={{marginLeft: 40, fontSize: 30}}>Nothing found</Typography> :''}
            </Paper>
        </div>
    );
};

export default Chats;