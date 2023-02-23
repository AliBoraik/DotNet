import React from 'react';
import Sidebar from "../components/Sidebar/Sidebar";
import RedirectButton from "../components/CustomButtons/RedirectButton";

const ErrorPage = () => {
    return (
        <div>
            <Sidebar/>
            <RedirectButton page={'content'} text={"BACK"}/>
            <p style={{
                marginLeft: '400px'
            }}>404 page not found</p>
        </div>
    );
};

export default ErrorPage;

