import React, {useEffect, useState} from 'react';
import s from './gant.module.css'
import GanttHeader from "../../Components/GanttHeader/GanttHeader";
import GanttChart from "../../Components/GanttChart/GanttChart";
import GlobalStyles from "../../styles/GlobalStyles";
import theme from "../../styles/theme";
import {RecoilRoot, useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {ThemeProvider} from "@mui/material";
import {ToastContainer} from "react-toastify";
import {getAllTask, getProjectInterns, getUserInfo} from "../../services/task";
import {projectInterns, projectsId, projectsList, tasksState, userState} from "../../store/atom";

const Gantt = () => {
    const setUser = useSetRecoilState(userState);
    const [projectId, setProjectId] = useRecoilState(projectsId);
    const setProjectList = useSetRecoilState(projectsList)
    const setTasks = useSetRecoilState(tasksState);
    const setInterns = useSetRecoilState(projectInterns)

    useEffect(() => {
        getUserInfo()
            .then((response) => {
                setUser(response);
                setProjectList(response)
                setProjectId(response[0]?.id)
            })
            .catch((error) => {
                console.log(error);
            });
        getAllTask("gantt", projectId)
            .then((response) => {
                setTasks(response);
            })
            .catch((error) => {
                console.log(error);
            });
        getProjectInterns(projectId)
            .then((response) => {
                setInterns(response);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [setTasks, setProjectList, setInterns, setUser]);

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles/>
            <div className={s.container}>
                <GanttHeader/>
                <div className={s.gant}>
                    <GanttChart/>
                </div>
                <ToastContainer/>
            </div>
        </ThemeProvider>
    );
};

export default Gantt;
