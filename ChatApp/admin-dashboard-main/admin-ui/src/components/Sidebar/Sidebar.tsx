import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import styles from './Sidebar.module.css';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {Link} from "react-router-dom";
import { styled } from '@mui/material/styles';

const drawerWidth = 240;

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    '& .MuiToggleButtonGroup-grouped': {
        margin: theme.spacing(0.5),
        border: 0,
        '&.Mui-disabled': {
            border: 0,
        },
        '&:not(:first-of-type)': {
            borderRadius: theme.shape.borderRadius,
        },
        '&:first-of-type': {
            borderRadius: theme.shape.borderRadius,
        },
    },
}));

const Sidebar = () => {
    const [view, setView] = React.useState('list');

    const handleChange = (event: React.MouseEvent<HTMLElement>, nextView: string) => {
        setView(nextView);
    };

    const handleLogout = async () => {
        document.cookie = 'SAT=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Toolbar><Typography sx={{ml: 5}} variant='h6' >Admin Panel</Typography></Toolbar>
                <Divider />
                <Box className={styles.button}>
                    <StyledToggleButtonGroup
                        orientation="vertical"
                        value={view}
                        exclusive
                        onChange={handleChange}
                        aria-label="text alignment"
                        className={styles.btnGroup}
                    >
                        `<ToggleButton sx={{p: 0, height: 50}} value="top" aria-label="top aligned">
                            <Link className={styles.link} to="/Users">
                                <Typography variant={"inherit"} sx={{mt: 1}}>Users</Typography>
                            </Link>
                        </ToggleButton>
                        <ToggleButton sx={{p: 0, height: 50}} value="bottom" aria-label="bottom aligned">
                            <Link className={styles.link} to="/Content">
                                <Typography variant={"inherit"} sx={{mt: 1}}>Content</Typography>
                            </Link>
                        </ToggleButton>
                    </StyledToggleButtonGroup>
                </Box>
                <Box sx={{ flexGrow: 1}}/>
                <Divider/>
                <ToggleButton sx={{p: 0, height: 50, border: 'none'}} value="bottom" aria-label="bottom aligned">
                    <a href={'/'} className={styles.link} onClick={handleLogout}>
                        Log Out
                    </a>
                </ToggleButton>
            </Drawer>
        </Box>
    );
};

export default Sidebar;