import React, {useEffect, useState} from 'react';
import s from './GanttHeader.module.css'
import Select from "../UI/Select";
import Button from "../UI/Button";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {projectInterns, projectsId, projectsList, tasksState, teamsList, userState} from "../../store/atom";
import Modal from "../GanttTaskForm/Modal/Modal";
import { getAllTask, getProjectInterns, getUserInfo} from "../../services/task";
import ButtonForm from "../GanttTaskForm/UI/Button";
import {useParams} from "react-router-dom";
import {useGetUserQuery} from "../../redux/authApi";

const GanttHeader = () => {
    const [projectId, setProjectId] = useRecoilState(projectsId);
    const [formType, setFormType] = useState('')
    const [typeTask, setTypeTask] = useState('')
    const [showModal, setShowModal] = useState(false)
    const setInterns = useSetRecoilState(projectInterns)
    const parentId = null
    const projectList = useRecoilValue(projectsList)
    const setTasks = useSetRecoilState(tasksState);
    const internsList = useRecoilValue(projectInterns)
    let {userId} = useParams();
    let user = useGetUserQuery({id: userId});


    const openForm = (type) => {
        setFormType(type);
        setShowModal(true);
        setTypeTask('gantt')
    };

    const changeId = async (event) => {
        event.preventDefault()
        setProjectId(event.target.value)
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
            getAllTask("gantt", projectId)
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
                    <Select
                        options={projectList}
                        onChange={changeId}
                        defaultValue={projectList[0]?.id}
                    />
                </div>
                {internsList?.interns?.find((intern) => intern?.id_intern === user?.data?.id) &&
                    <>
                        <div className={s.buttons}>
                            <Button children={"Создать задачу"} onClick={()=>openForm('create')}/>
                        </div>
                    </>
                }
            </div>
            <Modal typeTask={typeTask} parentId={parentId} showModal={showModal} setShowModal={setShowModal} formType={formType} setFormType={setFormType}/>
        </div>
    );
};

export default GanttHeader;
