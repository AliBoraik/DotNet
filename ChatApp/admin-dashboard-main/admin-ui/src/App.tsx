import React from 'react';
import { Route, Routes } from "react-router-dom";
import Users from "./pages/Users";
import Content from "./pages/Content";
import { Login } from './pages/Login/Login'
import ProtectedRoutes from "./components/ProtectedRoutes";
import {createTheme, ThemeProvider} from "@mui/material";
import {grey, red} from "@mui/material/colors";
import User from "./pages/User/User";
import CreatePlaylist from "./pages/CreatePlaylist/CreatePlaylist";
import Playlist from "./pages/Playlist/Playlist";
import ErrorPage from "./pages/ErrorPage";
import Chats from "./pages/Chats";
import Chat from "./pages/Chat/Chat";

const appTheme = createTheme({
    palette: {
        secondary: {
            main: grey[700]
        },
        error: {
            main: red[500]
        }
    }
})

function App() {
  return (
      <ThemeProvider theme={appTheme}>
        <div className="App">
            <Routes>
                <Route path="/Login" element={<Login/>}/>
                <Route element={<ProtectedRoutes/>}>
                    <Route path="/Users" element={<Users/>}/>
                    <Route path="/404" element={<ErrorPage/>}/>
                    <Route path="/" element={<Users/>}/>
                    <Route path="/Content" element={<Content/>}/>
                    <Route path="/User/:id" element={<User/>}/>
                    <Route path="/CreatePlaylist" element={<CreatePlaylist/>}/>
                    <Route path="/Playlist/:id" element={<Playlist/>}/>
                    <Route path="/Playlist/:idP/song/:idS" element={<Playlist/>}/>
                    <Route path="/Chats" element={<Chats />}/>
                    <Route path="/Chat/:id" element={<Chat />}/>
                </Route>
            </Routes>
        </div>
      </ThemeProvider>
  );
}

export default App;
