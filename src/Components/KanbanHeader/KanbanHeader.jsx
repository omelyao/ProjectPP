import React, {useEffect, useState} from 'react';
import Select from "../UI/Select";
import Button from "../UI/Button";
import s from './KanbanHeader.module.css'
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {projectInterns, projectsId, projectsList, tasksKanbanState, tasksState} from "../../store/atom";
import {deleteCompletedTask, getAllTask, getProjectInterns} from "../../services/task";
import {useParams} from "react-router-dom";
import {useGetUserQuery} from "../../redux/authApi";


const KanbanHeader = () => {
    const [projectId, setProjectId] = useRecoilState(projectsId);
    const projectList = useRecoilValue(projectsList)
    const setTasks = useSetRecoilState(tasksKanbanState);
    const setInterns = useSetRecoilState(projectInterns)
    const internsList = useRecoilValue(projectInterns)
    let {userId} = useParams();
    let user = useGetUserQuery({id: userId});

    const changeId = async (event) => {
        event.preventDefault()
        setProjectId(event.target.value)
    }

    const Delete = async () => {
        try {
            await deleteCompletedTask(projectId)
            await getAllTask("kanban", projectId)
                .then((response) => {
                    setTasks(response);
                })
                .catch((error) => {
                    console.log(error);
                });
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() =>{
        if(changeId){
            getProjectInterns(projectId)
                .then((response) => {
                    setInterns(response)
                })
                .catch((error) => {
                    console.log(error)
                })
            getAllTask("kanban", projectId)
                .then((response) => {
                    setTasks(response);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [])

    return (
        <div className={s.container}>
            <div className={s.elements}>
                <div className={s.selects}>
                    <Select dis={"Мои задачи"}
                            options={projectList}
                            onChange={changeId}
                            defaultValue={projectList[0]?.id}
                    />
                </div>
                {internsList?.interns?.find((intern) => intern?.id_intern === user?.data?.id) &&
                    <>
                        <div className={s.buttons}>
                            <Button onClick={() => Delete()} children={"Убрать завершенные задачи"} width={250}/>
                        </div>
                    </>
                }
            </div>
        </div>
    );
};

export default KanbanHeader;
