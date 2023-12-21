import React, { useEffect, useState } from 'react';
import Select from "../UI/Select";
import Button from "../UI/Button";
import s from './KanbanHeader.module.css'
import Modal from "../GanttTaskForm/Modal/Modal";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { projectInterns, projectsId, projectsList, tasksKanbanState, tasksState } from "../../store/atom";
import { deleteCompletedTask, getAllTask, getProjectInterns } from "../../services/task";
import { useNavigate, useParams } from "react-router-dom";
import { useGetUserQuery } from "../../redux/authApi";
import { useSelector } from "react-redux";


const KanbanHeader = () => {
    const navigate = useNavigate();
    const [projectId, setProjectId] = useRecoilState(projectsId);
    const [formType, setFormType] = useState('')
    const [typeTask, setTypeTask] = useState('')
    const [showModal, setShowModal] = useState(false)
    const parentId = null
    const setTasks = useSetRecoilState(tasksKanbanState);
    const internsList = useRecoilValue(projectInterns)
    let { userId } = useParams();
    let user = useGetUserQuery({ id: userId });
    const handleCategoryClick = (category) => {
        if (category === 'start') {
            navigate(`/user/projects-lists`);
        }
    };
    const openForm = (type) => {
        setFormType(type);
        setShowModal(true);
        setTypeTask('gantt')
    };

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


    return (
        <div className={s.container}>
            <div className={s.elements}>
                <div className={s.selects}>
                    <Button> <img src={require("../GanttHeader/Black.svg").default} alt="black" onClick={() => handleCategoryClick('start')} width={50} /></Button>
                </div>
                {internsList?.interns?.find((intern) => intern?.id_intern === user?.data?.id) &&
                    <>
                        <div className={s.innerbutton}>
                            <div className={s.buttons}>
                                <Button children={"Создать задачу"} onClick={() => openForm('create')} />
                            </div>
                            <div className={s.buttons}>
                                <Button onClick={() => Delete()} children={"Убрать завершенные задачи"} width={250} />
                            </div>
                        </div>
                    </>
                }
            </div>
            <Modal typeTask={typeTask} parentId={parentId} showModal={showModal} setShowModal={setShowModal} formType={formType} setFormType={setFormType} />
        </div>
    );
};

export default KanbanHeader;
