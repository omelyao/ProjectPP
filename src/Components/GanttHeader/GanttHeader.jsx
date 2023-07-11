import React, {useEffect, useState} from 'react';
import s from './GanttHeader.module.css'
import Select from "../UI/Select";
import Button from "../UI/Button";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {projectInterns, projectsId, projectsList, tasksState, teamsList, userState} from "../../store/atom";
import Modal from "../GanttTaskForm/Modal/Modal";
import { getAllTask, getProjectInterns, getUserInfo} from "../../services/task";

const GanttHeader = () => {
    const [user, setUser] = useRecoilState(userState);
    const [projectId, setProjectId] = useRecoilState(projectsId);
    const [formType, setFormType] = useState('')
    const [showModal, setShowModal] = useState(false)
    const parentId = null
    const projectList = useRecoilValue(projectsList)
    const setProjectList = useSetRecoilState(projectsList)
    const setTasks = useSetRecoilState(tasksState);
    const setInterns = useSetRecoilState(projectInterns)

    const openForm = (type) => {
        setFormType(type);
        setShowModal(true);
    };

    useEffect(() => {
        getUserInfo()
            .then((response) => {
                setUser(response);
                setProjectId(user[0]?.id)
                console.log(projectsId)
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

    const options = [
        { id: '', name: 'Название проекта' },
        { id: 21, name: 'ЛК оценка' },
        { id: 22, name: 'ЛК Гант' },
        { id: 23, name: 'ЛК Канбан' },
    ];

    return (
        <div className={s.container}>
            <div className={s.elements}>
                <div className={s.selects}>
                    <Select options={projectList}
                            dis={"Мои задачи"}
                            onChange={(event) => setProjectId(event.target.value)}
                    />
                    {/*<Select*/}
                    {/*    options={options.map(opt => ({value: opt.id, name: opt.name}))}*/}
                    {/*    onChange={(event) => setProjectId(event.target.value)}*/}
                    {/*/>*/}
                    {/*<Select options={teamList} dis={"Команда"}/>*/}
                </div>
                <div className={s.buttons}>
                    <Button children={"Создать задачу"} onClick={()=>openForm('create')}/>
                </div>
            </div>
            <Modal parentId={parentId} showModal={showModal} setShowModal={setShowModal} formType={formType} setFormType={setFormType}/>
        </div>
    );
};

export default GanttHeader;
