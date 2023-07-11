import React from 'react';
import s from './gant.module.css'
import GanttHeader from "../../Components/GanttHeader/GanttHeader";
import GanttChart from "../../Components/GanttChart/GanttChart";
import GlobalStyles from "../../styles/GlobalStyles";
import theme from "../../styles/theme";
import {RecoilRoot} from "recoil";
import {ThemeProvider} from "@mui/material";
import {ToastContainer} from "react-toastify";

const Gantt = () => {
    return (
            <ThemeProvider theme={theme}>
                <GlobalStyles/>
                <div className={s.container}>
                    <GanttHeader/>
                    <div className={s.gant}>
                        <GanttChart/>
                    </div>
                </div>
            </ThemeProvider>
    );
};

export default Gantt;
