import React, {useEffect} from 'react';
import KanbanHeader from "../../Components/KanbanHeader/KanbanHeader";
import s from './kanban.module.css'
import KanbanChart from "../../Components/KanbanChart/KanbanChart";
import GlobalStyles from "../../styles/GlobalStyles";
import theme from "../../styles/theme";
import {RecoilRoot, useRecoilState, useSetRecoilState} from "recoil";
import {ThemeProvider} from "@mui/material";
import {ToastContainer} from "react-toastify";
import {projectInterns, projectsId, projectsList, tasksKanbanState, tasksState, userState} from "../../store/atom";
import {getAllTask, getProjectInterns, getUserInfo} from "../../services/task";

const Kanban = () => {
    const setUser = useSetRecoilState(userState);
    const [projectId, setProjectId] = useRecoilState(projectsId);
    const setProjectList = useSetRecoilState(projectsList)
    const setTasks = useSetRecoilState(tasksKanbanState);
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
        getAllTask("kanban", projectId)
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
                    <KanbanHeader/>
                    <div className={s.kanban}>
                        <KanbanChart/>
                    </div>
                </div>
            </ThemeProvider>
    );
};

export default Kanban;
