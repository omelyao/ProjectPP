import React, {useEffect, useState} from 'react';
import Select from "../UI/Select";
import Button from "../UI/Button";
import s from './KanbanHeader.module.css'
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {projectsId, projectsList, tasksState} from "../../store/atom";
import {getAllTask} from "../../services/task";


const KanbanHeader = () => {
    const [projectId, setProjectId] = useRecoilState(projectsId);
    const projectList = useRecoilValue(projectsList)
    const setTasks = useSetRecoilState(tasksState);

    const changeId = async (event) => {
        event.preventDefault()
        setProjectId(event.target.value)
    }

    useEffect(() =>{
        if(changeId){
            getAllTask("kanban", projectId)
                .then((response) => {
                    setTasks(response);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    })

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
                <div className={s.buttons}>
                    <Button children={"Убрать завершенные задачи"} width={250}/>
                </div>
            </div>
        </div>
    );
};

export default KanbanHeader;
