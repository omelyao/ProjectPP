import React from 'react';
import KanbanHeader from "../../Components/KanbanHeader/KanbanHeader";
import s from './kanban.module.css'
import KanbanChart from "../../Components/KanbanChart/KanbanChart";
import GlobalStyles from "../../styles/GlobalStyles";
import theme from "../../styles/theme";
import {RecoilRoot} from "recoil";
import {ThemeProvider} from "@mui/material";
import {ToastContainer} from "react-toastify";

const Kanban = () => {
    return (
            <ThemeProvider theme={theme}>
                <GlobalStyles/>
                <div className={s.container}>
                    <KanbanHeader/>
                    <div className={s.kanban}>
                        <KanbanChart/>
                    </div>
                </div>
                <ToastContainer/>
            </ThemeProvider>
    );
};

export default Kanban;
