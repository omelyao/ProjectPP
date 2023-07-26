import React, {useEffect, useState} from 'react';
import s from './gant.module.css'
import GanttHeader from "../../Components/GanttHeader/GanttHeader";
import GanttChart from "../../Components/GanttChart/GanttChart";
import GlobalStyles from "../../styles/GlobalStyles";
import theme from "../../styles/theme";
import {RecoilRoot, useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {ThemeProvider} from "@mui/material";
import {ToastContainer} from "react-toastify";
import {getAllTask, getProjectInterns, getUserInfo, refreshAccessToken} from "../../services/task";
import {projectInterns, projectsId, projectsList, tasksState, userState} from "../../store/atom";

const Gantt = () => {
    const setUser = useSetRecoilState(userState);
    const [projectId, setProjectId] = useRecoilState(projectsId);
    const setProjectList = useSetRecoilState(projectsList)
    const setTasks = useSetRecoilState(tasksState);
    const setInterns = useSetRecoilState(projectInterns)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userInfo, tasks, interns] = await Promise.all([
                    getUserInfo(),
                    getAllTask('gantt', projectId),
                    getProjectInterns(projectId)
                ]);

                setUser(userInfo);
                setProjectList(userInfo);
                setProjectId(userInfo[0]?.id);
                setTasks(tasks);
                setInterns(interns);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [setUser, setProjectList, setTasks, setInterns]);


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
