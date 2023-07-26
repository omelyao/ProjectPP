import React, {useEffect} from 'react';
import KanbanHeader from "../../Components/KanbanHeader/KanbanHeader";
import s from './kanban.module.css'
import KanbanChart from "../../Components/KanbanChart/KanbanChart";
import GlobalStyles from "../../styles/GlobalStyles";
import theme from "../../styles/theme";
import {useRecoilState, useSetRecoilState} from "recoil";
import {ThemeProvider} from "@mui/material";
import {projectInterns, projectsId, projectsList, tasksKanbanState, tasksState, userState} from "../../store/atom";
import {getAllTask, getProjectInterns, getUserInfo, refreshAccessToken} from "../../services/task";

const Kanban = () => {
    const setUser = useSetRecoilState(userState);
    const [projectId, setProjectId] = useRecoilState(projectsId);
    const setProjectList = useSetRecoilState(projectsList)
    const setTasks = useSetRecoilState(tasksKanbanState);
    const setInterns = useSetRecoilState(projectInterns)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userInfo, tasks, interns] = await Promise.all([
                    getUserInfo(),
                    getAllTask('kanban', projectId),
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
                <KanbanHeader/>
                <div className={s.kanban}>
                    <KanbanChart/>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default Kanban;
