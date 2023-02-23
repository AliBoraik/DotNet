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

interface user {
    id: number,
    email: string
}

const Users = () => {
    let loadMore;
    const type = React.useState('user');
    const input = React.useState('');
    const [offset, setOffset] = React.useState<number>(0);
    const [users, setUsers] = React.useState<user[]>([]);
    const [fetching, setFetching] = React.useState(true);
    const [received, setReceived] = React.useState(true);
    const [clear, setClear] = React.useState(true);
    let token = getToken();

    useEffect(() => {
        setUsers([]);
        setClear(true);
        setOffset(0);
        setReceived(true)
    }, [input[0], type[0]]);

    const userSearch =() => {
        setFetching(true);
        setTimeout(()=>{
        if (type[0] === 'id'){
            axios.get('user/id/' + input[0], queryConfig(token))
            .then((res) => {
                setClear(false);
                setUsers([res.data]);
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
            axios.get('user/email/'
                + input[0]
                + '?offset=' + offset
                + '&limit=15'
                + '&userType=' + type[0], queryConfig(token))
                .then((res) => {
                    setClear(false);
                    setUsers([...users, ...res.data]);
                    setOffset(offset + 15);
                    setFetching(false);
                    if (res.data.length === 0) {
                        setReceived(false)
                        setUsers(users)
                    }
                })
                .catch((error) => {
                    if (error.response.status === 403) {
                        /*logout*/
                    }
                });
            }
        }, 100)
    };

    let renderList = users?.map((user: user, index) => {
            return (
                <StyledTableRow key={user.id}>
                    <StyledTableCell sx={{width: 2}}>
                        {index+1}
                    </StyledTableCell>
                    <StyledTableCell sx={{width: 3}}>
                        {user.id}
                    </StyledTableCell>
                    <StyledTableCell>
                        {user.email}
                    </StyledTableCell>
                    <StyledTableCell sx={{width: 2}}>
                        <Link
                            to={`/User/${user.id}`}
                            style={{color: "grey", textDecoration: "none"}}
                        >
                            DETAILS
                        </Link>
                    </StyledTableCell>
                </StyledTableRow>
        )});

    loadMore =
    (users.length > 0 && received)?
        <Button
            sx={{width: "100%", m: 0}}
            size={"small"}
            onClick={() => {
                userSearch();
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
                typeOptions={['user', 'artist', 'id']}
                onSearch={userSearch}
                inputState={input}
                typeState={type}
                addButton={false}
            />
            <div style={{height: "70px"}}/>
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
                                <TableCell>Email</TableCell>
                                <TableCell sx={{width: 2}}/>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            { renderList}
                            <TableRow>
                                <TableCell colSpan={4} >
                                    {loadMore}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                {users.length === 0 && !clear? <Typography sx={{marginLeft: 40, fontSize: 30}}>Nothing found</Typography> :''}
            </Paper>
        </div>
    );
};

export default Users;