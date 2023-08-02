import React, { useState } from 'react';
import s from './Card.module.css'
import { ReactComponent as User } from "../../../assets/img/User.svg";
import { ReactComponent as Cal } from "../../../assets/img/calendar.svg";
import { ReactComponent as Play } from "../../../assets/img/CardButtons.svg";
import { ReactComponent as Stop } from "../../../assets/img/StopCardButton.svg";
import { ReactComponent as Delete } from "../../../assets/img/DeleteCardButtons.svg";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {projectsId, taskIdState, tasksKanbanState, tasksState, timerState} from "../../../store/atom";
import Modal from "../../GanttTaskForm/Modal/Modal";
import {deleteComments, deleteIdTask, getAllTask, getIdTask} from "../../../services/task";
import {useParams} from "react-router-dom";
import {useGetUserQuery} from "../../../redux/authApi";

const Card = ({
                  items,
                  key,
                  board,
                  dragOverHandler,
                  dragStartHandler,
                  className,
                  tasks,
              }) => {
    let {userId} = useParams();
    let user = useGetUserQuery({id: userId});
    const setTasks = useSetRecoilState(tasksKanbanState);
    const taskId = useRecoilValue(taskIdState)
    const setTaskId = useSetRecoilState(taskIdState)
    const [timer, setTimer] = useRecoilState(timerState)
    const [projectId, setProjectId] = useRecoilState(projectsId);
    const [isHovered, setIsHovered] = useState(false);
    const [formType, setFormType] = useState('')
    const [showModal, setShowModal] = useState(false)

    const openForm = (type) => {
        setFormType(type);
        setShowModal(true);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const DeleteTask = async (id) => {
        try {
            await deleteIdTask(id);
            const updatedTaskId = await getAllTask('kanban', projectId)
            setTasks(updatedTaskId)
        } catch (e) {
            console.log(e);
        }
    };

    const startTimer = () => {
        getIdTask(items.task_id)
            .then((response) => {
                setTaskId(response);
            })
            .catch((error) => {
                console.log(error);
            });

        if (taskId.executors.find((executor) => executor?.user_id === user?.data?.id)) {
            if (!timer.isRunning && timer.taskId === null || !timer.isRunning && timer.taskId === taskId.task.id || !timer.isRunning && timer.taskId !== taskId.task.id && timer.timerId === null) {
                const timerId = setInterval(() => {
                    setTimer((prevTimer) => ({
                        ...prevTimer,
                        time: prevTimer.time + 1,
                        taskId: taskId.task.id
                    }));
                }, 1000);

                setTimer((prevTimer) => ({
                    ...prevTimer,
                    isRunning: true,
                    timerId,
                    taskId: taskId.task.id,
                    taskName: taskId.task.name,
                    time: taskId.executors.find((executor) => executor.user_id === user?.data?.id)?.time_spent !== null ?
                        taskId.executors.find((executor) => executor.user_id === user?.data?.id)?.time_spent
                        : 0,
                }));
            } else {
                return null
            }
        }
    };


    const stopTimer = () => {
        if (taskId.executors.find((executor) => executor.user_id === user?.data?.id)) {

            if (timer.isRunning && timer.taskId === taskId.task.id) {
                clearInterval(timer.timerId);
                setTimer((prevTimer) => ({
                    ...prevTimer,
                    isRunning: false,
                    taskId: taskId.task.id,
                    taskName: taskId.task.name
                }));
            }
        }
    };

    return (
        <>
            <div
                className={`${className} ${isHovered ? s.hovered : ''}`}
                key={key}
                draggable={"true"}
                onDragOver={(e) => dragOverHandler(e)}
                onDragStart={(e) => dragStartHandler(e, board, items)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className={s.title}>
                    <span onClick={()=>openForm('view')}>{items.name}</span>
                </div>
                <div className={s.project}>
                    <span>{tasks.title_project}</span>
                </div>
                <div className={s.team}>
                    <span>#{items.team__teg}</span>
                </div>
                <div className={s.user}>
                    <User style={{width:"16px", height:"16px"}} />
                    <span>{items.user_id__last_name} {items.user_id__first_name}</span>
                </div>
                <div className={s.bottom}>
                    <div className={s.deadline}>
                        <Cal style={{width:"16px", height:"16px"}}/>
                        <span>{items.planned_final_date}</span>
                    </div>
                    {isHovered && (
                        <div className={s.buttons}>
                            {/*<button onClick={timer.isRunning ? stopTimer : startTimer}>*/}
                            {/*    {timer.isRunning && timer.taskId === items.task_id?*/}
                            {/*        <Stop style={{width:"24px", height:"24px"}}/> :*/}
                            {/*        <Play style={{width:"24px", height:"24px"}}/>*/}
                            {/*    }*/}
                            {/*</button>*/}
                            <button onClick={() => DeleteTask(items.task_id)}><Delete style={{width:"24px", height:"24px"}} /></button>
                        </div>
                    )}
                </div>
            </div>
            <Modal id={items.task_id} parentName={items.parent_id__name} showModal={showModal} setShowModal={setShowModal} formType={formType} setFormType={setFormType}/>
        </>
    );
};

export default Card;
